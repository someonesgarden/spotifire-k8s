<template>
  <div class="wrapper">
      <parallax class="section page-header header-filter" parallax-active="true" :style="headerStyle">
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
  import mapMixin     from '../mixins/map/index';
  import wsMixin      from '../mixins/ws';
  import Mixins       from "../mixins/basicMixins";
  import mysqlMixin   from "../mixins/mysql";

  import {ruleEmpty}  from '../store/rules';
  import firebase     from 'firebase';

  import M from '../class/map/EMarker';
  import P from '../class/map/EProject';

  import {BlogCard}  from "../components/MD";
  import MapsOverlay from '../components/Emory/MapOverlay';
  import InfoOverlay from '../components/Emory/InfoOverlay';
  import PlayOverlay from '../components/Emory/PlayOverlay';
  import EditOverlay from '../components/Emory/EditOverlay';

  import AdminSection from '../components/Emory/AdminSection';

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
              mode: 'info',
              socket: null,
              userisready: false,
              mainuser: null,
              overlay: {
                  info: null,
                  play: null,
                  edit: null
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
              'ws']),
          avatar_thumb() {
              return this.spotify.bookmarks ? this.spotify.bookmarks[0].album.images[0].url : '/static/img/markers/edit/m_mainuser_1.png'
          }
      },
      created() {
          this.firebaseDB.marker  = firebase.database().ref('markers');
          this.firebaseDB.project = firebase.database().ref('projects');
      },
    mounted() {

      let match;
      const regexp_h4 = /<h4>(.*?)<\/h4>/g;
      const regexp_h = /<h(.)>.*?<\/h\1>/g;
      const regexp_p = /<p>(.*?)<\/p>/g;

      this.c_mysql_getall('posts',res=>{

        let posts =  res.data.map(post=> {
          let content = post.post_content ? this.m_html_comment(decodeURIComponent(post.post_content)) : '';
          let contents = content.split(/\n/); contents = contents.filter(v => v);

          let trip = contents.map(cont => {
            let res = {hs: [], ps: []};
            while ((match = regexp_h.exec(cont)) !== null) res.hs.push(match[1]);
            while ((match = regexp_p.exec(cont)) !== null) res.ps.push(match[1]);
            return res;
          });

          return {
            id: post.ID,
            title: post.post_title ? decodeURIComponent(post.post_title) : '',
            excerpt: post.post_excerpt ? post.post_excerpt : '',
            trip: trip,
            spotifyid: post.spotifyid ? post.spotifyid : null
          }
        });

        this.a_wp(['set','posts',posts]);
        // console.log(posts);

      });

      window.onpagehide = () => this.m_resetWhenBackground();
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState !== "visible") this.m_resetWhenBackground()
      }, false);

      this.overlay.info = this.$refs.info_overlay.$el;
      this.overlay.play = this.$refs.play_overlay.$el;
      this.overlay.edit = this.$refs.edit_overlay.$el;

      this.m_scrollTo('#app');       //TOPにスクロール

      this.a_mapstore(['set', 'mode', 'info']);     //INFOモードに

      //とりあえずゲストで入らせる(最初からログインさせるときは外す）
      this.a_spotify(['set', 'me', {id: 'GUEST'}]);

      //IDがある場合
      if (this.spotify.me.id) {
        //ログイン済みでブックマークデータがない場合
        if (this.spotify.me.id !== 'GUEST' && !this.spotify.me.bookmark_num) {
          this.a_index(['alert', 'set', "Spotifyユーザーデータを調べています"]);
          this.a_index(['alert', 'open']);
          this.a_index(['alert', 'action', null]);
        }
        this.createOrFindMainuser(this.spotify.me.id);     //マーカー作成

      } else {   //IDがない場合
        this.a_index(['alert', 'set', "Spotifyにログインが必要です。"]);
        this.a_index(['alert', 'open']);
        this.a_index(['alert', 'action', 'login']);
      }

      this.a_mapstore(['emory', 'loader', true]);
      //全マーカーとエリアの設定
      this.firebaseDB.marker.on('value', (snapshot) => this.a_mapstore(['set', 'markers', snapshot.val()]));
      this.firebaseDB.project.on('value', (snapshot) => this.a_mapstore(['emory', 'setprojects', snapshot.val()]));
    },

    // errorCaptured(){
    //   this.a_mapstore(['set', 'tracking', false]);
    // },

      beforeDestroy() {
          this.socketDisconnect();
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
          this.firebaseDB.marker.orderByChild('userid').startAt(meid).endAt(meid).once('value', ss=>{
            if(ss.val()) {
              console.log("FOUND");
              let key = Object.keys(ss.val())[0];
              let val = Object.values(ss.val())[0];
              this.a_mapstore(['set', 'mainuser', {...val, id: key}]);
            } else{
              //ローカルにユーザーデータがない場合だけ作成される
              if(!this.mapstore.mainuser) new M({type:'mainuser'}).updateOrNew(this.firebaseDB.marker);
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

      switchMode() {
        if(!this.overlay.info) return; //レイヤーの準備ができててなければ即終了。

        let mode = this.mapstore.emory.mode ? this.mapstore.emory.mode : 'info';

        switch (mode) {
          case 'info':
            this.a_mapstore(['set', 'tracking', false]);
            this.overlay.info.style.visibility = 'visible';
            this.overlay.info.style.zIndex = 401;
            this.overlay.play.style.zIndex = -1;
            this.overlay.edit.style.zIndex = -1;
            document.body.classList.remove('playing');
            break;

          case 'edit':
            this.a_mapstore(['set','editing',{key:'status',val:true}]);
            this.overlay.info.style.visibility = 'hidden';
            this.overlay.info.style.zIndex = -1;
            this.overlay.play.style.zIndex = -1;
            this.overlay.edit.style.zIndex = 401;
            document.body.classList.remove('playing');
            break;

          case 'play_map':
            this.a_mapstore(['set', 'projBoundary', false]);
            this.overlay.info.style.visibility = 'hidden';
            this.overlay.play.style.zIndex = 401;
            this.overlay.edit.style.zIndex = -1;
            document.body.classList.add('playing');
            break;

          case 'play_imagemap':
            this.a_mapstore(['set', 'projBoundary', true]);
            this.overlay.info.style.visibility = 'hidden';
            this.overlay.play.style.zIndex = 401;
            this.overlay.edit.style.zIndex = -1;
            document.body.classList.add('playing');
            break;

          case 'map':
            this.overlay.info.style.visibility = 'hidden';
            this.overlay.info.style.zIndex = -1;
            this.overlay.play.style.zIndex = -1;
            this.overlay.edit.style.zIndex = -1;
            document.body.classList.remove('playing');
            break;

          case 'play':
            this.overlay.info.style.visibility = 'hidden';
            this.overlay.info.style.zIndex = -1;
            this.overlay.play.style.zIndex = 401;
            this.overlay.edit.style.zIndex = -1;
            document.body.classList.add('playing');
            break;
        }
      },

    },

    watch:{
      'spotify.me':{
          handler(newMe) {
              if (!newMe.id) return;
              if (!!this.spotify.me.bookmark_num || newMe.id === 'GUEST') return;

              this.a_index(['alert', 'set', "ユーザー" + newMe.id + "を調べています"]);
              this.a_index(['alert', 'open']);
              this.a_index(['alert', 'action', null]);

              this.createOrFindMainuser(this.spotify.me.id);
          }, deep: true
      },

      'mapstore.mainuser':{
        handler(newUser){
            if(!newUser || this.userisready) return;

            this.socketInit();
            this.connectToSocket();
            this.userisready = true;
        }
      },

      'mapstore.emory.mode':{
        handler:'switchMode'
      },

      'mapstore.emory.projects':{
        handler(newProjects){
            if(!newProjects) return;

              //プロジェクトが全て読み込まれたら位置計算させる
              this.trackOnce();

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
