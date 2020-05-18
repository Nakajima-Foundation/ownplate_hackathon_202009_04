import * as functions from 'firebase-functions'
import * as utils from '../stripe/utils'
import * as netutils from '../lib/netutils'
import { ownPlateConfig } from '../common/project';

export const isEnabled = !!ownPlateConfig.line;

export const validate = async (db: FirebaseFirestore.Firestore, data: any, context: functions.https.CallableContext) => {
  const uid = utils.validate_auth(context);

  const { code, redirect_uri, client_id } = data;
  utils.validate_params({ code, redirect_uri, client_id })
  const LINE_SECRET_KEY = functions.config().line.secret;

  try {
    // We validate the OAuth token (code) given to the redirected page.
    // Result: access_token, id_token, expires_in, refresh_token, scope, token_type
    const access = await netutils.postForm("https://api.line.me/oauth2/v2.1/token", {
      grant_type: "authorization_code",
      code,
      redirect_uri,
      client_id,
      client_secret: LINE_SECRET_KEY
    })
    if (!access.id_token || !access.access_token) {
      throw new functions.https.HttpsError('invalid-argument',
        'Validation failed.', { params: access }
      )
    }

    // We verify this code.
    // amr, aud, exp, iat, iss, name, sub
    const verified = await netutils.postForm('https://api.line.me/oauth2/v2.1/verify', {
      id_token: access.id_token,
      client_id
    })
    if (!verified.sub) {
      throw new functions.https.HttpsError('invalid-argument',
        'Verification failed.', { params: verified }
      )
    }

    // We get user's profile
    const profile = await netutils.request('https://api.line.me/v2/profile', {
      headers: {
        Authorization: `Bearer ${access.access_token}`
      }
    })

    const collection = context.auth!.token.phone_number ? "users" : "admins";
    await db.doc(`/${collection}/${uid}/system/line`).set({
      access, verified, profile
    }, { merge: true })

    return { profile, nonce: verified.nonce };
  } catch (error) {
    throw utils.process_error(error)
  }
}

export const sendMessage = async (db: FirebaseFirestore.Firestore, uid: string | null, message: string) => {
  if (uid === null) {
    return;
  }
  const LINE_MESSAGE_TOKEN = functions.config().line.message_token;
  const data = (await db.doc(`/users/${uid}/system/line`).get()).data() || (await db.doc(`/admins/${uid}/system/line`).get()).data();
  const sub = data && data.profile && data.profile.userId
  if (!sub) {
    return;
  }
  return netutils.postJson('https://api.line.me/v2/bot/message/push', {
    headers: {
      //Authorization: `Bearer ${data.access.access_token}`
      Authorization: `Bearer ${LINE_MESSAGE_TOKEN}`
    }
  }, {
    to: sub,
    messages: [
      { type: "text", text: message }
    ]
  })
}