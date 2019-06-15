<template>
  <div id="app" v-cloak class="app-wrap" :class="[$route.name,{login:($route.name==='Login' || $route.name==='')}]">
    <head-top></head-top>
    <mu-container fluid>
      <router-view></router-view>
    </mu-container>

    <!-- MP3 EPISODE PLAYER-->
    <div class="mp3_players" v-if="$route.name ==='Map' && !!mp3.pods ">
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
      <mu-appbar color="blueGrey900" title="how to play">
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
              <how-slide @moveTo="$refs.how.goToPage(index+1)" :slide="item"></how-slide>
            </slide>

            <slide>
              <h1>センサーチェック</h1>
              <p>端末に内蔵された加速度センサと地磁気センサと、緯度経度を測定するジオロケーション機能を活用しています。</p>

              <div class="ui grid home">
                <div class="eight wide column" style="text-align:center;">
                  <img id="compass_h" ref="compass_h" src="/static/img/spotify_logo.png" style="width:65px;height:65px;border-radius:50%;"/><br/>
                  [水平角度]<br/>{{sensor.angleH | dicimal3}}
                </div>

                <div class="eight wide column" style="text-align:center;">
                  <img id="compass_v" ref="compass_v" src="/static/img/spotify_logo.png" style="width:65px;height:65px;border-radius:50%;"/><br/>
                  [垂直角度]<br/>{{sensor.angleV | dicimal3}}
                </div>
              </div>

              <mu-button color="blueGrey900" full-width @click="a_index(['howModal','set',false])">戻る</mu-button>
            </slide>

          </carousel>
        </mu-flex>
    </mu-dialog>
    <!--/HOW MODAL-->

    <!-- STORY MODAL-->
    <mu-dialog transition="slide-bottom" fullscreen :open.sync="modal.modals.story.open"  class="storyModal">
      <mu-appbar color="teal900" title="story.">
        <mu-button slot="left" icon @click="a_index(['storyModal','set',false])">
          <mu-icon value="chevron_left"></mu-icon>
        </mu-button>
        <mu-button slot="right" flat  @click="a_index(['storyModal','set',false])">
          <mu-icon value="done_all"></mu-icon>
        </mu-button>
      </mu-appbar>
      <mu-flex class="body flex-wrapper" justify-content="center" align-items="center" direction="column">

        <carousel ref="story" navigation-prev-label="〈" navigation-next-label="〉"
                  :per-page="1" :navigation-enabled="true">
          <slide class="slide" v-for="(item,index) in modal.modals.story.items" :key="'howslide'+index">
            <how-slide @moveTo="$refs.story.goToPage(index<modal.modals.story.items.length-1 ? index+1:0)" :slide="item" :end="index===modal.modals.story.items.length-1"></how-slide>
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

export default {
  name: 'app',
  mixins:[feedMixin,spotifyMixin],
    components: {
        HeadTop,
        Player,
        Magazine,
        BottomView,
        AudioPlayer,
        HowSlide
    },
  computed:mapGetters(['bottom','alert','mp3','pwa','modal']),

  data:function(){

    return{
      gyro:{
        sensor:null,
        x:0,
        y:0,
        z:0
      },

      compass_calib:false,
      orienting: window.DeviceOrientationEvent,
      rotating: window.DeviceMotionEvent,
      sensor:{
        angleH:0.000000000000000,
        hx:0.000000000000000,
        hy:0.000000000000000,
        hz:0.000000000000000,
        angleV:0.000000000000000,
        vx:0.000000000000000,
        vy:0.000000000000000,
        vz:0.000000000000000,
        heading:null,
        alpha:0.000000000000000,
        beta:0.000000000000000,
        gamma:0.000000000000000
      },

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

  mounted(){

    this.$nextTick(() => {
      window.addEventListener('deviceorientation', this.deviceOrientation, false);
      // window.addEventListener("compassneedscalibration", this.compassNeedsCalibration, true);

      // if (this.orienting) {
      //
      // }
      // else if (this.rotating) {
      //     window.addEventListener('devicemove', this.rotate, false)
      // }
      // else {
      //     document.addEventListener('mousemove', this.move)
      // }
      // if (typeof Gyroscope === "function") {
      //   this.gyro.sensor = new Gyroscope();
      //
      //   this.gyro.sensor.addEventListener('reading', () => {
      //     console.log(this.gyro.x);
      //     console.log(this.gyro.y);
      //     console.log(this.gyro.z);
      //   });
      //
      //   this.gyro.sensor.start();
      // }
    })
  },

  beforeDestroy() {
    window.removeEventListener("deviceorientation",  this.deviceOrientation, false);
    // window.removeEventListener("compassneedscalibration", this.compassNeedsCalibration, true);
    // if(this.gyro.sensor) this.gyro.sensor.stop();
  },

  methods:{
    ...mapActions(['a_index']),

    dialogClick(){
      this.a_index(['alert','close']);

      if (this.alert.action === 'login') {
        if(!this.spotify.credential.expires_in) this.c_getCredential();
      }
    },

    compassNeedsCalibration(e){
      this.compass_calib = true;
    },


    deviceOrientation(e){
      //if (navigator.geolocation) navigator.geolocation.getCurrentPosition(position =>  this.sensor.heading = position.coords.heading);

      this.sensor.alpha = e.alpha;
      this.sensor.beta = e.beta;
      this.sensor.gamma = e.gamma;

      let ro = -(window.orientation || 0) * Math.PI / 180;
      let ry =  (e.gamma || 0) * Math.PI / 180;
      let rx =  (e.beta  || 0) * Math.PI / 180;
      let rz =  (e.alpha || 0) * Math.PI / 180;
      let co = Math.cos(ro);
      let so = Math.sin(ro);
      let cy = Math.cos(ry);
      let sy = Math.sin(ry);
      let cx = Math.cos(rx);
      let sx = Math.sin(rx);
      let cz = Math.cos(rz);
      let sz = Math.sin(rz);

      // ローカル x 軸ベクトル
      let axisX = {
        x: co * cy * cz - co * sy * sx * sz - so * cx * sz,
        y: co * cy * sz + co * sy * sx * cz + so * cx * cz,
        z:-co * sy * cx + so * sx
      };

      // ローカル y 軸ベクトル
      let axisY = {
        x:-so * cy * cz + so * sy * sx * sz - co * cx * sz,
        y:-so * cy * sz - so * sy * sx * cz + co * cx * cz,
        z: so * sy * cx + co * sx
      };

      // ローカル z 軸ベクトル
      let axisZ = {
        x: sy * cz + cy * sx * sz,
        y: sy * sz - cy * sx * cz,
        z: cy * cx
      };

      // ------------------------------------------------------------
      // デバイスを水平に寝かせて閲覧している場合
      // ------------------------------------------------------------
      let angleH = Math.atan2(-axisY.x,axisY.y) * (180.0 / Math.PI);
      if(axisZ.z < 0) angleH = -angleH;

      if(this.$refs.compass) this.$refs.compass.style.transform = "rotate(" +  (angleH) + "deg)";
      if(this.$refs.compass_v) this.$refs.compass_h.style.transform = "rotate(" + (angleH) + "deg)";

      this.sensor.angleH = angleH;
      this.sensor.hx = (axisY.x).toFixed(4);
      this.sensor.hy = (axisY.y).toFixed(4);
      this.sensor.hz = (axisY.z).toFixed(4);

      // ------------------------------------------------------------
      // デバイスを垂直に立てて閲覧している場合
      // ------------------------------------------------------------
      let angleV = Math.atan2(axisZ.x,-axisZ.y) * (180.0 / Math.PI);

      if(this.$refs.compass_v) this.$refs.compass_v.style.transform = "perspective(300px) rotateX(65deg) rotateZ(" + (angleV).toFixed(10) + "deg)";
      this.sensor.angleV = angleV;
      this.sensor.vx = (-axisZ.x).toFixed(4);
      this.sensor.vy = (-axisZ.y).toFixed(4);
      this.sensor.vz = (-axisZ.z).toFixed(4);
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
    position:fixed;
    bottom:3px;
    text-align:center;
    margin:2px auto;
    /*background-color: rgba(210, 222, 217, 0.3);*/
    padding:4px 0 2px 0;
    opacity:1;
  }

  img#compass_v, img#compass_h{
    margin:0 auto;
  }

</style>
