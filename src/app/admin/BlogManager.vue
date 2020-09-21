<template>
  <div>
    <div class="align-center m-t-16">
      <b-button
        tag="nuxt-link"
        :to="`/admin/restaurants/${restaurantid}/create-blog`"
        style="min-width: 256px;"
        class="b-reset op-button-small secondary"
      >
        <span class="c-primary">新規作成</span>
      </b-button>
    </div>

    <div class="columns is-multiline card-style">
      <div
        v-for="(blog, index) in blogs"
        :key="index"
        class="column is-3 blog-card"
      >
        <nuxt-link :to="`blogs/${blog.id}`">
          <div class="card">
            <div class="card-image">
              <figure class="image is-4by3">
                <img :src="blog.imageUrl" alt="Placeholder image" />
              </figure>
            </div>
            <div class="content">
              <div class="media-content">
                <p v-if="blog.public"></p>
                <p v-else>
                  下書き
                </p>
                <p class="title is-4">
                  {{ blog.title }}
                </p>
              </div>
            </div>
          </div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "~/plugins/firebase.js";

export default {
  name: "BlogManager",
  data() {
    return {
      blogs: [],
      restaurantsId: this.restaurantId()
    };
  },
  mounted() {
    db.collection(`restaurants/${this.restaurantsId}/blogs`)
      .get()
      .then(ref => {
        ref.forEach(doc => {
          if (!doc.exists) {
            console.log("No such document!");
          } else {
            this.blogs.push({ id: doc.id, ...doc.data() });
          }
        });
      });
  }
};
</script>

<style>
.card-style {
  padding-top: 24px;
}
</style>
