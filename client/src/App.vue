<template>
  <div id="app" v-cloak class="app-wrap" :class="[$route.name,{login:($route.name==='Login' || $route.name==='')}]">
    <head-top></head-top>
    <mu-container fluid>
      <router-view></router-view>
    </mu-container>


    <!-- MP3 EPISODE PLAYER-->
    <div class="mp3_players" v-if="$route.name ==='Map' && !!mp3.pods">
      <audio-player :key="'pod'+index" :num="index" :pod="pod" v-for="(pod,index) in mp3.pods"></audio-player>
    </div>
    <!--/ MP3 EPISODE PLAYER-->


    <mu-bottom-sheet :open.sync="bottom.open" class="bottomnav">
      <bottom-view></bottom-view>
    </mu-bottom-sheet>

    <mu-dialog width="600" max-width="80%" :esc-press-close="false" :overlay-close="false" :open="alert.open">
      {{alert.text}}<br/>
      <mu-button slot="actions" flat color="secondary" @click="dialogClick">{{alert.action ? alert.action : '閉じる'}}</mu-button>
    </mu-dialog>
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

export default {
  name: 'app',
  mixins:[feedMixin,spotifyMixin],
  components: {
    'head-top':HeadTop,
    'player':Player,
      'magazine':Magazine,
    'bottom-view':BottomView,
    'audio-player':AudioPlayer
  },
  computed:mapGetters(['bottom','alert','mp3']),
  methods:{
    ...mapActions(['a_index']),

    dialogClick(){
      this.a_index(['alert','close']);

      if (this.alert.action === 'login') {
        if(!this.spotify.credential.expires_in) this.c_getCredential();
      }

    }
  },

  data:function(){
    return{
      infos:[
       {
      title:'令和の名言',
              subtitle:'令和の名言!!!!',
              description:'「それはこれから人生の混沌の中で見つけ出していきます」',
              btn1label:'ステーション',
              bg:'/static/img/bg1.jpg',
              btncolor:'#1e7019',
              id:'no1'
    },

        {
          title:'昨日のできごとから。',
          subtitle:'昨日のできごとから。',
          description:'「それはこれから人生の混沌の中で見つけ出していきます」',
          btn1label:'ステーション',
          bg:'/static/img/bg2.jpg',
          btncolor:'#c81645',
          id:'no1'
        },
        {
          title:'昨日のできごとから。',
          subtitle:'昨日のできごとから。',
          description:'「それはこれから人生の混沌の中で見つけ出していきます」',
          btn1label:'ステーション',
          bg:'/static/img/bg3.jpg',
          btncolor:'#c8a800',
          id:'no1'
        },
      ],
      tokenizer:null
    }
  },

  watch:{
   '$route':{
     handler(route){

     }
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
    position:absolute;
    bottom:6px;
    text-align:center;
    margin:2px auto;
    /*background-color: rgba(210, 222, 217, 0.3);*/
    padding:4px 0 2px 0;
    z-index:410;
    opacity:0.8;
  }
</style>
