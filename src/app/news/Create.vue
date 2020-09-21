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
              <div v-if="!isLocaleJapan">
                <h2>Post an article</h2>
                <b-field>
                  <b-input v-model="name" placeholder="Title"></b-input>
                </b-field>
                <div>
                  <img src="https://fakeimg.pl/640x200/?text=画像をドラッグドロップ&font=noto" />
                </div>
                <b-field>
                  <b-input maxlength="1000" rows="20" type="textarea" placeholder="Contents"></b-input>
                </b-field>
                <b-field grouped position="is-right">
                  <b-button type="is-success" outlined>Save as draft</b-button>
                  <b-button type="is-success">Post</b-button>
                </b-field>
              </div>

              <!-- Japanese -->
              <div v-else>
                <h2>ニュースを投稿</h2>
                <b-field>
                  <b-input v-model="name" placeholder="タイトル"></b-input>
                </b-field>
                <div>
                  <img src="https://fakeimg.pl/640x200/?text=画像をドラッグドロップ&font=noto" />
                </div>
                <b-field>
                  <b-input maxlength="1000" rows="20" type="textarea" placeholder="本文"></b-input>
                </b-field>
                <b-field grouped position="is-right">
                  <b-button type="is-success" outlined>下書きとして保存</b-button>
                  <b-button type="is-success">投稿</b-button>
                </b-field>
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
import { releaseConfig } from "~/plugins/config.js";

export default {
  name: "HomePage",

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
