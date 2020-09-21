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
                  <div class="flex-1">
                    <div class="cols">
                      <div v-if="blogInfo.imageUrl" class="p-r-16">
                        <div>
                          <img
                            class="w-128 h-128 r-4 cover"
                            :src="blogInfo.imageUrl"
                          />
                        </div>
                        <div class="align-center t-caption">
                          {{ $t("editCommon.current") }}
                        </div>
                      </div>
                      <div>
                        <croppa
                          :width="128"
                          :height="128"
                          :prevent-white-space="true"
                          :zoom-speed="5"
                          :accept="'image/jpeg'"
                          :placeholder="$t('editCommon.clickAndUpload')"
                          :placeholder-font-size="13"
                          :disable-drag-to-move="true"
                          :disable-scroll-to-zoom="true"
                          :disable-rotation="true"
                          initial-position="center"
                          :canvas-color="'gainsboro'"
                          :show-remove-button="true"
                          @file-choose="handleEyecatchImage"
                          @file-type-mismatch="handleEyecatchImageRemove"
                          @image-remove="handleEyecatchImageRemove"
                        ></croppa>
                        <div class="align-center t-caption w-128">
                          {{ $t("editCommon.new") }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                <b-button outlined type="submit" @click="submitDraft">
                  下書きとして保存
                </b-button>
                <b-button type="submit" @click="submitArticle">
                  投稿
                </b-button>
              </b-field>
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
        body: "",
        files: {}
      },
      blogId: this.$route.params.blogId,
      restaurantsId: this.restaurantId()
    };
  },
  mounted() {
    db.collection(`restaurants/${this.restaurantsId}/blogs/`)
      .doc(`${this.blogId}`)
      .get()
      .then(doc => {
        if (!doc.exists) {
          console.log("No such document!");
        } else {
          this.blogInfo.title = doc.data().title;
          this.blogInfo.imageUrl = doc.data().imageUrl;
          this.blogInfo.body = doc.data().body;
        }
      });
  },
  methods: {
    handleEyecatchImage(e) {
      const newFile = Object.assign({}, this.files);
      newFile["eyecatch"] = e;
      this.files = newFile;
    },
    handleEyecatchImageRemove(e) {
      const newFile = Object.assign({}, this.files);
      newFile["eyecatch"] = null;
      this.files = newFile;
    },

    async submitArticle() {
      const restaurantId = this.restaurantId();
      try {
        const date = new Date();
        if (this.files["eyecatch"]) {
          const path = `/images/restaurants/${restaurantId}/${restaurantId}/blogs/eyecatch/${date.getTime()}.jpg`;
          this.blogInfo.imageUrl = await this.uploadFile(
            this.files["eyecatch"],
            path
          );
        }
        const articleData = {
          title: this.blogInfo.title,
          imageUrl: this.blogInfo.imageUrl,
          createdAt: firestore.FieldValue.serverTimestamp(),
          public: true,
          body: this.blogInfo.body
        };
        const cleanData = this.cleanObject(articleData);
        await db
          .doc(`restaurants/${this.restaurantId()}`)
          .collection("blogs")
          .doc(this.blogId)
          .set(cleanData);

        this.$router.push({
          path: `/admin/restaurants/${this.restaurantId()}/blogs`
        });
      } catch (error) {
        console.log(error);
      }
    },

    async submitDraft() {
      const restaurantId = this.restaurantId();
      try {
        const date = new Date();
        if (this.files["eyecatch"]) {
          const path = `/images/restaurants/${restaurantId}/${restaurantId}/blogs/eyecatch/${date.getTime()}.jpg`;
          this.blogInfo.imageUrl = await this.uploadFile(
            this.files["eyecatch"],
            path
          );
        }
        const articleData = {
          title: this.blogInfo.title,
          imageUrl: this.blogInfo.imageUrl,
          createdAt: firestore.FieldValue.serverTimestamp(),
          public: false,
          body: this.blogInfo.body
        };
        const cleanData = this.cleanObject(articleData);
        await db
          .doc(`restaurants/${this.restaurantId()}`)
          .collection("blogs")
          .doc(this.blogId)
          .set(cleanData);

        this.$router.push({
          path: `/admin/restaurants/${this.restaurantId()}/blogs`
        });
      } catch (error) {
        console.log(error);
      }
    }
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
