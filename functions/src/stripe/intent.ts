import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';
import * as constant from '../common/constant'
import Stripe from 'stripe'
import Order from '../models/Order'
import * as utils from './utils'

export const create = async (db: FirebaseFirestore.Firestore, data: any, context: functions.https.CallableContext) => {
  const uid = utils.validate_auth(context);
  const stripe = utils.get_stripe();

  const { orderId, restaurantId, paymentMethodId } = data;
  utils.validate_params({ orderId, restaurantId, paymentMethodId });

  const restaurantData = await utils.get_restaurant(db, restaurantId);
  const venderId = restaurantData['uid']

  const stripeSnapshot = await db.doc(`/admins/${venderId}/public/stripe`).get()
  const stripeData = stripeSnapshot.data()
  if (!stripeData) {
    throw new functions.https.HttpsError('invalid-argument', 'This restaurant is unavailable.')
  }
  const stripeAccount = stripeData.stripeAccount
  try {
    const result = await db.runTransaction(async transaction => {

      const orderRef = db.doc(`restaurants/${restaurantId}/orders/${orderId}`)
      const snapshot = await transaction.get(orderRef)
      const order = Order.fromSnapshot<Order>(snapshot)

      // Check the stock status.
      if (order.status !== constant.order_status.validation_ok) {
        throw new functions.https.HttpsError('aborted', 'This order is invalid.')
      }

      // FIXME: check amount, currency.
      const amount = order.total * 100

      const request = {
        setup_future_usage: 'off_session',
        amount: amount,
        currency: 'USD',
        payment_method: paymentMethodId,
        metadata: { uid, restaurantId, orderId }
      } as Stripe.PaymentIntentCreateParams

      const paymentIntent = await stripe.paymentIntents.create(request, {
        idempotencyKey: orderRef.path,
        stripeAccount
      })

      transaction.set(orderRef, {
        timePaid: admin.firestore.FieldValue.serverTimestamp(),
        status: constant.order_status.customer_paid,
        result: paymentIntent
      }, { merge: true })

      return {
        paymentIntentId: paymentIntent.id,
        orderId: orderRef.id
      }
    })
    return { result }
  } catch (error) {
    throw utils.process_error(error)
  }
};

export const confirm = async (db: FirebaseFirestore.Firestore, data: any, context: functions.https.CallableContext) => {
  const uid = utils.validate_auth(context);
  const stripe = utils.get_stripe();

  const { restaurantId, orderId, paymentIntentId } = data
  utils.validate_params({ restaurantId, orderId, paymentIntentId })

  const orderRef = db.doc(`restaurants/${restaurantId}/orders/${orderId}`)
  const restaurantSnapshot = await orderRef.parent.parent!.get()
  const restaurantData = restaurantSnapshot.data()
  if (!restaurantData) {
    throw new functions.https.HttpsError('invalid-argument', 'Dose not exist a restaurant.')
  }
  const venderId = restaurantData['uid']
  const stripeSnapshot = await db.doc(`/admins/${venderId}/public/stripe`).get()
  const stripeData = stripeSnapshot.data()
  if (!stripeData) {
    throw new functions.https.HttpsError('invalid-argument', 'This restaurant does not support payment.')
  }
  const stripeAccount = stripeData.stripeAccount

  if (venderId !== uid) {
    throw new functions.https.HttpsError('permission-denied', 'You do not have permission to confirm this request.')
  }

  try {
    const result = await db.runTransaction(async transaction => {

      const snapshot = await transaction.get(orderRef)
      const order = Order.fromSnapshot<Order>(snapshot)

      if (!snapshot.exists) {
        throw new functions.https.HttpsError('invalid-argument', `The order does not exist. ${orderRef.path}`)
      }
      // Check the stock status.
      if (order.status !== constant.order_status.cooking_completed) {
        throw new functions.https.HttpsError('failed-precondition', 'This order is not ready yet.')
      }

      try {
        // Check the stock status.
        const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
          idempotencyKey: order.id,
          stripeAccount
        })
        transaction.set(orderRef, {
          timeConfirmed: admin.firestore.FieldValue.serverTimestamp(),
          status: constant.order_status.customer_picked_up,
          result: paymentIntent
        }, { merge: true })
        return paymentIntent
      } catch (error) {
        throw error
      }
    })
    return { result }
  } catch (error) {
    throw utils.process_error(error)
  }
};


export const cancel = async (db: FirebaseFirestore.Firestore, data: any, context: functions.https.CallableContext) => {
  const uid = utils.validate_auth(context);
  const stripe = utils.get_stripe();

  const { restaurantId, orderId, paymentIntentId } = data
  utils.validate_params({ restaurantId, orderId, paymentIntentId })

  const orderRef = db.doc(`restaurants/${restaurantId}/orders/${orderId}`)
  const restaurantData = await utils.get_restaurant(db, restaurantId)
  const venderId = restaurantData['uid']

  const stripeSnapshot = await db.doc(`/admins/${venderId}/public/stripe`).get()
  const stripeData = stripeSnapshot.data()
  if (!stripeData) {
    throw new functions.https.HttpsError('invalid-argument', 'This restaurant is unavailable.')
  }

  const stripeAccount = stripeData.stripeAccount
  try {
    const result = await db.runTransaction(async transaction => {

      const snapshot = await transaction.get(orderRef)
      const order = Order.fromSnapshot<Order>(snapshot)

      if (!snapshot.exists) {
        throw new functions.https.HttpsError('invalid-argument', `The order does not exist. ${orderRef.path}`)
      }
      if (uid !== order.uid) {
        throw new functions.https.HttpsError('permission-denied', 'You do not have permission to cancel this request.')
      }
      if (order.status !== constant.order_status.customer_paid) {
        throw new functions.https.HttpsError('permission-denied', 'Invalid order state to cancel.')
      }

      try {
        // Check the stock status.
        const paymentIntents = await stripe.paymentIntents.cancel(paymentIntentId, {
          idempotencyKey: `${order.id}-cancel`,
          stripeAccount
        })
        transaction.set(orderRef, {
          timeCanceld: admin.firestore.FieldValue.serverTimestamp(),
          status: constant.order_status.order_canceled_by_customer,
          uidCanceledBy: uid,
          result: paymentIntents
        }, { merge: true })
        return paymentIntents
      } catch (error) {
        throw error
      }
    })
    return { result }
  } catch (error) {
    throw utils.process_error(error)
  }
};
