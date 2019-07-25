<template>
  <div id="app" class="app-wrap" :class="[$route.name,{login:($route.name==='Login' || $route.name==='')}]">
<!--    <head-top></head-top>-->
    <router-view name="header"/>
    <router-view/>
    <router-view name="footer" />

    <!-- BOTTOM-VIEW-->
    <mu-bottom-sheet :open.sync="bottom.open" class="bottomnav">
      <bottom-view></bottom-view>
    </mu-bottom-sheet>
    <!--/BOTTOM-VIEW-->

    <!-- COMMON DIALOG-->
    <mu-dialog width="600" max-width="80%" :esc-press-close="false" :overlay-close="false" :open="alert.open">
      {{alert.text}}<br/>
      <mu-button slot="actions" flat color="secondary" @click="dialogClick">{{alert.action ? alert.action : '閉じる'}}</mu-button>
    </mu-dialog>
    <!-- /COMMON DIALOG-->

    <!-- HOW MODAL-->
    <mu-dialog transition="slide-bottom" fullscreen :open.sync="modal.modals.how.open"  class="howModal">
      <mu-appbar color="blueGrey900" title="What's Emory?">
        <mu-button slot="left" icon @click="a_index(['howModal','toggle',false])">
          <mu-icon value="chevron_left"></mu-icon>
        </mu-button>
        <mu-button slot="right" flat  @click="a_index(['howModal','toggle',false])">
          <mu-icon value="done_all"></mu-icon>
        </mu-button>
      </mu-appbar>
        <mu-flex class="body flex-wrapper" justify-content="center" align-items="center" direction="column">

          <carousel ref="how" navigation-prev-label="〈" navigation-next-label="〉"
                  :per-page="1" :navigation-enabled="true">
            <slide class="slide" v-for="(item,index) in modal.modals.how.items" :key="'howslide'+index">
              <how-slide @moveTo="$refs.how.goToPage(index+1)" :slide="item" :end="index===modal.modals.how.items.length-1 && device.platform!=='SP'"/>
            </slide>

            <slide class="slide" v-if="device.platform==='SP'">
              <sensor-check-slide></sensor-check-slide>
            </slide>

          </carousel>
        </mu-flex>
    </mu-dialog>
    <!--/HOW MODAL-->

    <!-- STORY MODAL-->
    <mu-dialog transition="slide-bottom" fullscreen :open.sync="modal.modals.story.open"  class="storyModal">
      <mu-appbar style="background-color:inherit;box-shadow:none;">
        <mu-button slot="left" icon @click="m_resetWhenBackground" style="background-color: black;color:white;">
          <mu-icon value="chevron_left"></mu-icon>
        </mu-button>
      </mu-appbar>
      <mu-flex class="body flex-wrapper" justify-content="center" align-items="center" direction="column">
        <carousel ref="story" :per-page="1">
          <slide class="slide">
            <story-slide></story-slide>
          </slide>
        </carousel>
      </mu-flex>
    </mu-dialog>
    <!--/STORY MODAL-->

  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';
  import feedMixin from './mixins/feed/index';
  import spotifyMixin from './mixins/spotify/index';
  import mapMixin from './mixins/map/index';

  import Player from './components/Spotify/Player/Player.vue';
  import BottomView from './components/Common/BottomView';
  import AudioPlayer from './components/Mp3/AudioPlayer';
  import HowSlide from './components/Slide/HowSlide.vue';
  import StorySlide from './components/Slide/StorySlide.vue';
  import SensorCheckSlide from './components/Slide/SensorCheckSlide.vue';

  export default {
      name: 'app',
      mixins: [feedMixin, spotifyMixin,mapMixin],
      components: {
          Player,
          BottomView,
          AudioPlayer,
          HowSlide,
          StorySlide,
          SensorCheckSlide
      },
      computed: mapGetters(['bottom', 'alert', 'mp3', 'pwa', 'modal', 'device']),

      mounted() {
          this.a_index(['platform', 'check']);
      },

      methods: {
          ...mapActions(['a_index']),

          dialogClick() {
              this.a_index(['alert', 'close']);
              if (this.alert.action === 'login') {
                  if (!this.spotify.credential.expires_in) this.c_getCredential();
              }
          },

          storyModalAction(page = 0) {
              $refs.story.goToPage(page);
              let data = modal.modals.story.items[0];
          }
      }
  }
</script>

<style lang="scss">
  @import "scss/app";
  @import "scss/material-kit";
</style>
