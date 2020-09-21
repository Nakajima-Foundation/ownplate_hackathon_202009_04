<template>
  <div>
    <!-- List Header Area -->
    <div class="columns is-gapless">
      <!-- Left Gap -->
      <div class="column is-narrow w-24"></div>
      <!-- Center Column -->
      <div class="column">
        <div class="m-l-24 m-r-24 m-t-24">
          <!-- Title -->
          <!-- <div class="t-h6 c-text-black-disabled m-t-24">{{$t("find.area")}}</div> -->
					<!-- <img src="./test.jpeg"  /> -->
					<img src="./test.jpeg"  />
					<!-- <div style="background-image: url({{image_url}});" /> -->
					<!-- <p> {{image_url}} </p> -->
					<div>
						<h1> {{ title }} </h1>
					</div>

					<div>
						<p>店舗名</p>
					</div>

					<div>
						<p> {{ body }} </p>
					</div>

        </div>
      </div>
      <!-- Right Gap -->
      <div class="column is-narrow w-24"></div>
    </div>

    <!-- List Body Area -->
    <div class="columns is-gapless">
      <!-- Left Gap -->
      <div class="column is-narrow w-24"></div>
      <!-- Center Column -->
      <div class="column">
        <div class="m-l-24 m-r-16 m-t-16">
          <!-- Areas -->
          <div class="columns is-gapless is-multiline">
          
          </div>
        </div>
      </div>
      <!-- Right Gap -->
      <div class="column is-narrow w-24"></div>
    </div>
    <!-- Likes Header Area -->
    <div class="columns is-gapless" >
      <!-- Left Gap -->
      <div class="column is-narrow w-24"></div>
      <!-- Center Column -->
      <div class="column">
        <div class="m-l-24 m-r-24 m-t-24">
          <!-- Title -->
            <div class="h-full p-b-8 p-r-8">
                <div class="touchable h-full">
                  <div class="cols flex-center">
                    <!-- Restaurant Profile -->

                    <!-- Restaurant Name -->
                    
                  </div>
                </div>
            </div>
        </div>
      </div>
      <!-- Right Gap -->
      <div class="column is-narrow w-24"></div>
    </div>
  </div>
</template>

<script>
import { db } from "~/plugins/firebase.js";
import { RestaurantHeader } from "~/plugins/header.js";
import AreaItem from "~/app/user/Restaurants/AreaItem";
import { ownPlateConfig } from "@/config/project";
import Blog from "~/components/Blog";
import firebase from 'firebase';

export default {
  components: {
    Blog,
  },
  data() {
    return {
			title: '',
			image_url: '',
			body: '',
		}
	},
	mounted() {
		let blogRef = db.collection('restaurants/SeRsv7mMLjPmjDATVZqH/blogs').doc('0cKePr6lGsD7sTXgQdSr');
		let getDoc = blogRef.get()
		.then(doc => {
			if (!doc.exists) {
				console.log('No such document!');
			} else {
				console.log('Document data:', doc.data());
				this.title = doc.data().title;
				this.image_url = doc.data().image_url;
				this.body = doc.data().body;
			}
		})
		.catch(err => {
			console.log('Error getting document', err);
		});
  },
};
</script>
