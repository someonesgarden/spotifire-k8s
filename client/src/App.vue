<template>
  <div id="app" v-cloak class="app-wrap" :class="[$route.name,{login:($route.name==='Login' || $route.name==='')}]">
    <head-top></head-top>
    <mu-container fluid>
      <router-view></router-view>
    </mu-container>

    <!-- MP3 EPISODE PLAYER-->
    <div class="mp3_players" v-if="$route.name ==='Map' || $route.name ==='MapAdmin'">
      <audio-player :key="'pod'+index" :num="index" :pod="pod" v-for="(pod,index) in mp3.pods"></audio-player>
    </div>
    <!--/ MP3 EPISODE PLAYER-->

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
        <mu-button slot="left" icon @click="a_index(['howModal','set',false])">
          <mu-icon value="chevron_left"></mu-icon>
        </mu-button>
        <mu-button slot="right" flat  @click="a_index(['howModal','set',false])">
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
      <mu-appbar style="background-color:inherit;">
        <mu-button slot="left" icon @click="a_index(['storyModal','set',false])">
          <mu-icon value="chevron_left"></mu-icon>
        </mu-button>

      </mu-appbar>
      <mu-flex class="body flex-wrapper" justify-content="center" align-items="center" direction="column">

        <carousel ref="story" navigation-prev-label="〈" navigation-next-label="〉" :per-page="1">
          <slide class="slide" v-for="(item,index) in modal.modals.story.items" :key="'howslide'+index">
            <story-slide @moveTo="$refs.story.goToPage(index<modal.modals.story.items.length-1 ? index+1:0)" :slide="item" :end="index===modal.modals.story.items.length-1"></story-slide>
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

  import HeadTop from './components/Common/Header.vue';
  import Player from './components/Spotify/Player/Player.vue';
  import Magazine from './components/Layout/Magazine.vue';
  import BottomView from './components/Common/BottomView';
  import AudioPlayer from './components/Mp3/AudioPlayer';
  import HowSlide from './components/Slide/HowSlide.vue';
  import StorySlide from './components/Slide/StorySlide.vue';
  import SensorCheckSlide from './components/Slide/SensorCheckSlide.vue';
  //import PWASensors from './class/PWASensors';

export default {
  name: 'app',
  mixins:[feedMixin,spotifyMixin],
    components: {
        HeadTop,
        Player,
        Magazine,
        BottomView,
        AudioPlayer,
        HowSlide,
        StorySlide,
        SensorCheckSlide
    },
  computed:mapGetters(['bottom','alert','mp3','pwa','modal','device']),

    mounted(){
      this.a_index(['platform','check']);
      // this.pwasensors = new PWASensors({});
      // this.pwasensors.init();
    },

  beforeDestroy(){
   // if(!!this.pwasensors) this.pwasensors.stopAll();
  },

  data:function(){
    return {
      pwasensors: null,

      infos: [
        {
          title: '令和の名言',
          subtitle: '令和の名言!!!!',
          description: '「それはこれから人生の混沌の中で見つけ出していきます」',
          btn1label: 'ステーション',
          bg: '/static/img/bg1.jpg',
          btncolor: '#1e7019',
          id: 'no1'
        }
      ],
      tokenizer: null
    }
  },

  methods:{
    ...mapActions(['a_index']),

    dialogClick(){
      this.a_index(['alert','close']);
      if (this.alert.action === 'login') {
        if(!this.spotify.credential.expires_in) this.c_getCredential();
      }
    },

    storyModalAction(page=0){
      $refs.story.goToPage(page);
      let data = modal.modals.story.items[0];
    }
  }
}
</script>

<style lang="scss">
  @import "scss/variables";
  @import "scss/mixins";
  @import "scss/app";
  @import "scss/parts/layout/driveway";
  @import "scss/driveway";

  .container-fluid{
    padding-right:0;
    padding-left:0;
  }

  .mp3_players{
    width:100%;
    position:fixed;
    bottom:3px;
    text-align:center;
    margin:2px auto;
    /*background-color: rgba(210, 222, 217, 0.3);*/
    padding:4px 0 2px 0;
    opacity:1;
  }

  .widget_player{
    background-color:inherit;
    height:230px;
    overflow: hidden;
  }

</style>
