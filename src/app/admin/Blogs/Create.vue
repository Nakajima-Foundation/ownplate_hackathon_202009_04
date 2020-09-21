<template>
  <div>
    <!-- Home Body Area -->
    <div class="columns is-gapless">
      <!-- Left Gap -->
      <div class="column is-narrow w-24"></div>
      <!-- Center Column -->
      <div class="column">
        <div class="columns is-gaplress">
          <div class="column is-three-fifths is-offset-one-fifth">
            <div class="m-l-24 m-r-24">
              <!-- English -->
              <div>
                <h2>記事を投稿</h2>
                <b-field>
                  <b-input
                    v-model="blogInfo.title"
                    placeholder="タイトル"
                    maxlength="50"
                  />
                </b-field>
                <div>
                  <img src="https://fakeimg.pl/640x200/?text=画像をドラッグドロップ&font=noto" />
                </div>
                <b-field>
                  <b-input 
                    v-model="blogInfo.body"
                    maxlength="1000"
                    rows="20" 
                    type="textarea" 
                    placeholder="本文"
                  />
                </b-field>
                <b-field grouped position="is-right">
                  <b-button @click="submitDraft" type="submit" outlined>下書きとして保存</b-button>
                  <b-button @click="submitArticle" type="submit">投稿</b-button>
                </b-field>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { releaseConfig } from "~/plugins/config.js";
import { db, storage, firestore } from "~/plugins/firebase.js";

export default {
  name: "HomePage",

  data() {
    return {
      blogInfo: {
        title: "",
        imageUrl: "",
        createdAt: "",
        public: false,
        body: ""
      }
    };
  },

  methods: {

    async submitArticle() {
      const restaurantId = this.restaurantId();
      try {
        const articleData = {
          title: this.blogInfo.title,
          imageUrl: this.blogInfo.imageUrl,
          createdAt: firestore.FieldValue.serverTimestamp(),
          public: true,
          body: this.blogInfo.body,
        }
        const cleanData = this.cleanObject(articleData);
        await db.doc(`restaurants/${this.restaurantId()}`).collection("blogs").add(cleanData);
  
        this.$router.push({
          path: `/admin/restaurants/${this.restaurantId()}/blogs`
        });
      } catch (error) {
        console.log(error)
      }
    },
  
    async submitDraft() {
      const restaurantId = this.restaurantId();
      try {
        const articleData = {
          title: this.blogInfo.title,
          imageUrl: this.blogInfo.imageUrl,
          createdAt: firestore.FieldValue.serverTimestamp(),
          public: false,
          body: this.blogInfo.body,
        }
        const cleanData = this.cleanObject(articleData);
        await db.doc(`restaurants/${this.restaurantId()}`).collection("blogs").add(cleanData);
  
        this.$router.push({
          path: `/admin/restaurants/${this.restaurantId()}/blogs`
        });
      } catch (error) {
        console.log(error)
      }
    },
  },
  computed: {
    hideUsersLink() {
      return releaseConfig.hideUsersLink;
    },
    featureHeroMobile() {
      return this.regionalSetting.FeatureHeroMobile[
        this.isLocaleJapan ? "ja" : "en"
      ];
    },
    featureHeroTablet() {
      return this.regionalSetting.FeatureHeroTablet[
        this.isLocaleJapan ? "ja" : "en"
      ];
    }
  }
};
</script>
