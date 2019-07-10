<template>
  <div class="wrapper">
      <parallax class="section page-header header-filter" parallax-active="true" :style="headerStyle">
          <maps-overlay ref="maps_overlay" class="maps_overlay layers overlay" :markersRef="markersRef"/>
          <info-overlay ref="info_overlay" class="info_overlay overlay" @trackOnce="trackOnce"/>
          <play-overlay ref="play_overlay" class="play_overlay overlay" :class="{hide:!mapstore.mainuser}"/>
          <edit-overlay ref="edit_overlay" class="edit_overlay overlay" :class="{hide:!mapstore.mainuser}" :markersRef="markersRef" :projsRef="projsRef"/>

          <div class="mp3_players">
            <audio-player :key="'pod'+index" :num="index" :pod="pod" v-for="(pod,index) in mp3.pods"></audio-player>
          </div>
      </parallax>

    <div class="main main-raised">
      <div class="section">
        <div class="container">
          <div class="md-layout">
            <div
              class="md-layout-item md-size-66 md-small-size-100 mx-auto text-center">
              <h3 class="title">
                <md-icon>check</md-icon>&nbsp;位置情報＋バイノーラルサウンド＝新しい感動
              </h3>
              <h5 class="description">
                立体的な「音」を聴きながら進める体験型ウェブアプリケーションです。
              </h5>
            </div>
          </div>
          <div class="features text-center">
            <div class="md-layout">
              <div class="md-layout-item md-size-33 md-small-size-33">
                <div class="info">
                  <div class="avatar large" style="background-image:url('/static/img/design/circle1.jpg');"/>
                  <h4 class="info-title">エリアから</h4>
                  <p>
                    箱根、新宿、下北沢など小田急線沿線にたくさんのスポットがあります。
                  </p>
                </div>
              </div>
              <div class="md-layout-item md-size-33 md-small-size-33">
                <div class="info">
                  <div class="avatar large" style="background-image:url('/static/img/design/circle2.jpg');"/>
                  <h4 class="info-title">音楽から</h4>
                  <p>
                    場所と気分に合わせた最高のプレイリストを、Spotifyから厳選しています。
                  </p>
                </div>
              </div>
              <div class="md-layout-item md-size-33 md-small-size-33">
                <div class="info">
                  <div class="avatar large" style="background-image:url('/static/img/design/circle3.jpg');"/>
                  <h4 class="info-title">物語から</h4>
                  <p>
                    史実をモデルにワクワクハラハラの物語が体験できます。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section" style="background-color:rgb(212, 4, 156);">
        <div class="container">
          <div class="md-layout">
            <div class="md-layout-item md-size-66 md-small-size-100 mx-auto text-center">
              <h3 class="title text-center" style="color:white;">
                <mu-icon value="book" color="white"></mu-icon>&nbsp;STORIES</h3>
            </div>
          </div>
          <div class="features text-center">
            <div class="md-layout">

              <div class="md-layout-item md-size-50 md-small-size-100 mx-auto text-center">
                <div class="info">

                  <blog-card
                          :shadow-normal="false"
                          :no-colored-shadow="false"
                          :card-image="'/static/img/emory/dummy/sengoku.jpg'">
                    <template slot="cardContent">
                      <h6 class="card-category text-warning"> HISTORY+FANTASY</h6>
                      <h4 class="card-title">
                        <a href="javacript:void(0)">戦国散歩第一話<br/>『JAPANTASY in 箱根』</a>
                      </h4>
                      <p class="card-description">
                        大自然を舞台に繰り広げられる戦国散歩シリーズ第一弾『箱根xJAPANTASY』では、史実をモデルにワクワクハラハラの物語が体験できます。
                        9月末公開！
                      </p>
                    </template>
                  </blog-card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section text-center section-dark">
        <admin-section/>
      </div>

    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';
  import spotifyMixin from '../mixins/spotify';
  import utilMixin    from '../mixins/util';
  import mapMixin     from '../mixins/map';
  import wsMixin      from '../mixins/ws';
  import Mixins       from "../mixins/basicMixins";

  import {ruleEmpty}  from '../store/rules';
  import firebase     from 'firebase';

  import M from '../class/map/EMarker';
  import P from '../class/map/EProject';

  import AudioPlayer from '../components/Mp3/AudioPlayer';
  import {BlogCard}  from "../components/MD";
  import MapsOverlay from '../components/Emory/MapOverlay';
  import InfoOverlay from '../components/Emory/InfoOverlay';
  import PlayOverlay from '../components/Emory/PlayOverlay';
  import EditOverlay from '../components/Emory/EditOverlay';

  import AdminSection from '../components/Emory/AdminSection';


  export default {
    name:"emory_main",
    bodyClass: "emory-page",
    mixins: [
      Mixins.HeaderImage,
      spotifyMixin,
      utilMixin,
      mapMixin,
      wsMixin
    ],
    components: {
      AudioPlayer,
      BlogCard,
      MapsOverlay,
      InfoOverlay,
      PlayOverlay,
      EditOverlay,
      AdminSection
    },
    data() {
      return {
        image: '/static/img/emory/bg/bg1.png',
        mode:        'info',
        socket:       null,
        userisready:  false,
        mainuser:     null,
        //FIREBASE
        markersRef:   null,
        projsRef:     null,
        blankRules: [ruleEmpty]
      };
    },
    computed: {
      ...mapGetters([
        'pwa',
        'spotify',
        'mapstore',
        'loggedIn',
        'ws',
        'mp3']),
      avatar_thumb(){
        return this.spotify.bookmarks ? this.spotify.bookmarks[0].album.images[0].url : '/static/img/markers/m_mainuser_1.png'
      }
    },
    created() {
      this.markersRef = firebase.database().ref('markers');
      this.projsRef   = firebase.database().ref('projects');
    },
    mounted() {
      this.scrollTo('#app');// トップ

      this.a_mapstore(['set','mode','info']);

      //最初の一回だけ、現在位置へジャンプする
      if(!this.mapstore.emory.play.init){
        this.$nextTick(()=>{
          this.trackOnce();
          this.a_mapstore(['emory','initPlay', true]);
        });
        setTimeout(() => this.trackOnce(), 2000);
      }

      //とりあえずゲストで入らせる。最初からログインさせるときは　はずす！
      this.a_spotify(['set','me',{id:'GUEST'}]);

      //IDがある場合
      if(this.spotify.me.id){
        //ログイン済みでブックマークデータがない場合
        if(this.spotify.me.id!=='GUEST' && !this.spotify.me.bookmark_num) {
          this.a_index(['alert', 'set', "Spotifyユーザーデータを調べています"]);
          this.a_index(['alert', 'open']);
          this.a_index(['alert','action',null]);
        }
        //マーカー作成
        this.createOrFindMainuser(this.spotify.me.id);

      }else{
        //IDがない場合
        this.a_index(['alert','set',"Spotifyにログインが必要です。"]);
        this.a_index(['alert','open']);
        this.a_index(['alert','action','login']);
      }

      //全マーカーとエリアの設定
      this.markersRef.on('value', (snapshot)=> this.a_mapstore(['set','markers',snapshot.val()]));
      this.projsRef.on('value',   (snapshot)=> this.a_mapstore(['emory','setprojects',snapshot.val()]));
    },

    beforeDestroy() {
      this.socketDisconnect();
      this.a_mapstore(['set', 'tracking', false]);
      this.markersRef = null;
    },

    methods: {
      ...mapActions([
        'a_index',
        'a_mp3',
        'a_spotify',
        'a_mapstore',
        'a_ws']),

      trackOnce(){
        this.$refs.maps_overlay.geoCurrentPosition();
      },

      createOrFindMainuser(meid){

        if(meid==='GUEST'){
          //ゲストの場合はFirebaseに問いかけず、そのままマーカーを作成する！
          this.a_mapstore(['set', 'mainuser',
            {
              center: {lat:34.722677, lng: 135.492364},
              type:'mainuser',
              project:'mainuser',
              title:'GUEST',
              id: 'GUEST'
            }]);

        }else{
          //メインユーザーを検索してなければ作成
          this.markersRef.orderByChild('userid').startAt(meid).endAt(meid).once('value', ss=>{
            if(ss.val()) {
              console.log("FOUND");
              let key = Object.keys(ss.val())[0];
              let val = Object.values(ss.val())[0];
              this.a_mapstore(['set', 'mainuser', {...val, id: key}]);
            } else{
              //ローカルにユーザーデータがない場合だけ作成される
              if(!this.mapstore.mainuser) new M({type:'mainuser'}).updateOrNew(this.markersRef);
            }
          })
        }
      },

      connectToSocket() {
        if (this.spotify.me && this.spotify.me.id) {
          let your_pos_and_data = {
            name: this.spotify.me.id,
            lat: this.$refs.maps_overlay.lat,
            lng: this.$refs.maps_overlay.lng,
            pid: this.spotify.playlist ? this.spotify.playlist.id : null,
            tid: this.spotify.track ? this.spotify.track.id : null
          };
          this.socketConnect(your_pos_and_data);
        }
      },

      switchLayer() {
        let info_overlay = this.$refs.info_overlay.$el;
        let play_overlay = this.$refs.play_overlay.$el;
        let edit_overlay = this.$refs.edit_overlay.$el;

        let mode = this.mapstore.emory.mode ? this.mapstore.emory.mode : 'info';

        switch (mode) {
          case 'info':
            this.a_mapstore(['set', 'tracking', false]);
            info_overlay.style.visibility = 'visible';
            info_overlay.style.zIndex = 401;
            play_overlay.style.zIndex = -1;
            edit_overlay.style.zIndex = -1;
            break;

          case 'edit':
            this.a_mapstore(['set','editing',{key:'status',val:true}]);
            info_overlay.style.visibility = 'hidden';
            info_overlay.style.zIndex = -1;
            play_overlay.style.zIndex = -1;
            edit_overlay.style.zIndex = 401;
            break;

          case 'play_map':
            this.a_mapstore(['set', 'projBoundary', false]);
            info_overlay.style.visibility = 'hidden';
            play_overlay.style.zIndex = 401;
            edit_overlay.style.zIndex = -1;
            break;

          case 'play_imagemap':
            this.a_mapstore(['set', 'projBoundary', true]);
            info_overlay.style.visibility = 'hidden';
            play_overlay.style.zIndex = 401;
            edit_overlay.style.zIndex = -1;
            break;

          case 'map':
            info_overlay.style.visibility = 'hidden';
            info_overlay.style.zIndex = -1;
            play_overlay.style.zIndex = -1;
            edit_overlay.style.zIndex = -1;
            break;
        }
      },

    },
    watch:{
      'spotify.me':{
        handler(newMe){
          if(!!newMe.id){
            if(!this.spotify.me.bookmark_num && newMe.id!=='GUEST') {
              this.a_index(['alert', 'set', "ユーザー"+newMe.id+"を調べています"]);
              this.a_index(['alert', 'open']);
              this.a_index(['alert','action',null]);
            }
            //ユーザーのbookmarkデータがなくてもとりあえず初期化
            this.createOrFindMainuser(this.spotify.me.id);
          }
        },deep:true
      },

      'mapstore.mainuser':{
        handler(newUser){
          if(!!newUser && !this.userisready){
            this.socketInit();
            this.connectToSocket();
            this.userisready = true;
          }
        }
      },
      'mapstore.emory.mode':{
        handler(newMode){
          this.switchLayer();
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .md-card-actions.text-center {
    display: flex;
    justify-content: center !important;
  }

  .layers{
    z-index:2;
    position:absolute;
    top:0;
    left:0;
    width:100vw;
    height:100vh;
  }

  .mp3_players{
    transform: rotate(90deg);
    left:calc(-50vw + 20px);
    z-index:4;
    text-align:inherit;
  }

  .ctrl-btn{
    min-width:48px;
  }

</style>
