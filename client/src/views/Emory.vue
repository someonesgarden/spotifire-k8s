<template>
  <div class="wrapper">
      <parallax class="section page-header header-filter" parallax-active="true" :style="headerStyle">
          <deck-overlay ref="deck_overlay" class="layers overlay deck_overlay"/>
          <maps-overlay ref="maps_overlay" class="layers overlay maps_overlay" :markersRef="firebaseDB.marker"/>
          <info-overlay ref="info_overlay" class="overlay info_overlay" @trackOnce="trackOnce"/>
          <play-overlay ref="play_overlay" class="overlay play_overlay" :class="{hide:!mapstore.mainuser}"/>
          <edit-overlay ref="edit_overlay" class="overlay edit_overlay" :class="{hide:!mapstore.mainuser}" :firebaseDB="firebaseDB"/>
      </parallax>

    <div class="main main-raised" :class="[mapstore.emory.mode]">
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
              <div class="md-layout-item md-size-33 md-small-size-100">
                <div class="info">
                  <div class="avatar large" style="background-image:url('/static/img/design/circle1.jpg');"/>
                  <h4 class="info-title">エリアから</h4>
                  <p>
                    箱根、新宿、下北沢など小田急線沿線にたくさんのスポットがあります。
                  </p>
                </div>
              </div>
              <div class="md-layout-item md-size-33 md-small-size-100">
                <div class="info">
                  <div class="avatar large" style="background-image:url('/static/img/design/circle2.jpg');"/>
                  <h4 class="info-title">音楽から</h4>
                  <p>
                    場所と気分に合わせた最高のプレイリストを、Spotifyから厳選しています。
                  </p>
                </div>
              </div>
              <div class="md-layout-item md-size-33 md-small-size-100">
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

            <div class="md-layout" v-if="wp.posts">
              <div class="md-layout-item md-size-50 md-small-size-100 mx-auto text-center" v-for="(post,key,inx) in wp.posts" :key="'post'+key+inx">
                  <top-post-item :post="post"></top-post-item>
              </div>
            </div>
          </div>

        </div><!-- / container -->
      </div><!-- / section -->

      <div class="section text-center section-dark">
        <admin-section/>
      </div>

    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';
  import firebase     from 'firebase';

  import spotifyMixin from '../mixins/spotify';
  import utilMixin    from '../mixins/util';
  import mapMixin     from '../mixins/map/index';
  import wsMixin      from '../mixins/ws';
  import Mixins       from "../mixins/basicMixins";
  import mysqlMixin   from "../mixins/mysql";
  import {ruleEmpty}  from '../store/rules';

  import MapsOverlay from '../components/Emory/MapOverlay';
  import InfoOverlay from '../components/Emory/InfoOverlay';
  import PlayOverlay from '../components/Emory/PlayOverlay';
  import EditOverlay from '../components/Emory/EditOverlay';
  import DeckOverlay from '../components/Emory/DeckOverlay';

  import AdminSection from '../components/Emory/AdminSection';

  import TopPostItem from '../components/Emory/Items/TopPostItem';

  export default {
    name: "emory_main",
    bodyClass: "emory-page",
    mixins: [
      Mixins.HeaderImage,
      spotifyMixin,
      utilMixin,
      mapMixin,
      wsMixin,
      mysqlMixin
    ],
    components: {
      DeckOverlay,
      MapsOverlay,
      InfoOverlay,
      PlayOverlay,
      EditOverlay,
      AdminSection,
      TopPostItem
    },
    data() {
      return {
        image: '/static/img/emory/bg/bg1.png',
        mode: 'info',
        socket: null,
        mainuser: null,
        overlay: {
          info: null,
          play: null,
          edit: null,
          map:  null,
          deck: null
        },
        firebaseDB: {
          marker: null,
          project: null
        },
        blankRules: [ruleEmpty]
      };
    },
    computed: {
      ...mapGetters([
        'spotify',
        'mapstore',
        'loggedIn',
        'ws',
        'wp']),
      avatar_thumb() {
        return this.spotify.bookmarks ? this.spotify.bookmarks[0].album.images[0].url : '/static/img/markers/edit/m_mainuser_1.png'
      }
    },
    created() {
      this.firebaseDB.marker = firebase.database().ref('markers');
      this.firebaseDB.project = firebase.database().ref('projects');
    },

    mounted() {
      window.onpagehide = () => this.m_resetWhenBackground();
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState !== "visible") this.m_resetWhenBackground()
      }, false);

      //基本レイヤーパーツ
      this.overlay.info = this.$refs.info_overlay.$el;
      this.overlay.play = this.$refs.play_overlay.$el;
      this.overlay.edit = this.$refs.edit_overlay.$el;
      this.overlay.deck = this.$refs.deck_overlay.$el;

      //Wordpressからデータ取得
      this.c_all_trips_from_wp();
      this.c_all_posts_from_wp();
      //TOPにスクロール
      this.m_scrollTo('#app');
      this.a_mapstore(['set', 'mode', 'info']);

      this.c_checkLoginStatus(res => {
        this.a_mapstore(['emory', 'loader', true]);
        if(!res){
          //名前をとりあえずGUESTで入らせる(最初からログインさせるときは外す）
          this.a_spotify(['set', 'me', {id: 'GUEST'}]);

          // this.a_index(['alert', 'set', "Spotifyにログインが必要です。"]);
          // this.a_index(['alert', 'open']);
          // this.a_index(['alert', 'action', 'login']);
        }

        //マーカー作成
        this.m_createOrFindMainuser(this.firebaseDB);
        //全マーカーとエリアの設定
        this.firebaseDB.marker.on('value',  (snapshot) => this.a_mapstore(['set', 'markers', snapshot.val()]));
        this.firebaseDB.project.on('value', (snapshot) => this.a_mapstore(['emory', 'setprojects', snapshot.val()]));
      });
    },

      beforeDestroy() {
          this.m_socketDisconnect();
          this.a_mapstore(['set', 'tracking', false]);
          this.firebaseDB.marker = null;
      },

      methods: {
          ...mapActions([
              'a_index',
              'a_spotify',
              'a_mapstore',
              'a_ws',
              'a_wp']),

        trackOnce() {
          this.$refs.maps_overlay.geoCurrentPosition();
        },

        switchMode() {
          if (!this.overlay.info) return; //レイヤーの準備ができててなければ即終了。

          let mode = this.mapstore.emory.mode ? this.mapstore.emory.mode : 'info';

          switch (mode) {
            case 'dock_map':
              this.a_mapstore(['set', 'tracking', false]);
              this.overlay.info.style.visibility = 'hidden';
              this.overlay.info.style.zIndex = -1;
              this.overlay.play.style.zIndex = -1;
              this.overlay.edit.style.zIndex = -1;
              document.body.classList.remove('playing');
              this.overlay.deck.style.zIndex = 401;


              break;
            case 'info':
              this.a_mapstore(['set', 'tracking', false]);
              this.overlay.info.style.visibility = 'visible';
              this.overlay.info.style.zIndex = 401;
              this.overlay.play.style.zIndex = -1;
              this.overlay.edit.style.zIndex = -1;
              document.body.classList.remove('playing');
              this.overlay.deck.style.zIndex = -1;

              break;

            case 'edit':
              this.a_mapstore(['set', 'editing', {key: 'status', val: true}]);
              this.overlay.info.style.visibility = 'hidden';
              this.overlay.info.style.zIndex = -1;
              this.overlay.play.style.zIndex = -1;
              this.overlay.edit.style.zIndex = 401;
              document.body.classList.remove('playing');
              this.overlay.deck.style.zIndex = -1;
              break;

            case 'play_map':
              this.a_mapstore(['set', 'projBoundary', false]);
              this.overlay.info.style.visibility = 'hidden';
              this.overlay.play.style.zIndex = 401;
              this.overlay.edit.style.zIndex = -1;
              document.body.classList.add('playing');
              this.overlay.deck.style.zIndex = -1;
              break;

            case 'play_imagemap':
              this.a_mapstore(['set', 'projBoundary', true]);
              this.overlay.info.style.visibility = 'hidden';
              this.overlay.play.style.zIndex = 401;
              this.overlay.edit.style.zIndex = -1;
              document.body.classList.add('playing');
              this.overlay.deck.style.zIndex = -1;
              break;

            case 'map':
              this.overlay.info.style.visibility = 'hidden';
              this.overlay.info.style.zIndex = -1;
              this.overlay.play.style.zIndex = -1;
              this.overlay.edit.style.zIndex = -1;
              document.body.classList.remove('playing');
              this.overlay.deck.style.zIndex = -1;
              break;

            case 'play':
              this.overlay.info.style.visibility = 'hidden';
              this.overlay.info.style.zIndex = -1;
              this.overlay.play.style.zIndex = 401;
              this.overlay.edit.style.zIndex = -1;
              document.body.classList.add('playing');
              this.overlay.deck.style.zIndex = -1;
              break;
          }
        },
      },

    watch: {
      'mapstore.emory.mode': {
        handler: 'switchMode'
      },

      'spotify.me': {
        handler() {
          console.log("handler");
          if (!this.mapstore.mainuser) this.m_createOrFindMainuser(this.firebaseDB);
        }, deep: true
      },

      'mapstore.mainuser': {
        handler(newUser) {
          if (newUser && !this.ws.you.connected) this.m_startSocket();
        }
      },

      'mapstore.emory.projects': {
        handler(newProjects) {
          if (newProjects) this.trackOnce();//プロジェクトが全て読み込まれたら位置計算させる
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .layers{
    z-index:2;
    position:absolute;
    top:0;
    left:0;
    width:100vw;
    height:100vh;
  }
</style>
