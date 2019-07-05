<template>
    <div class="mapmain md-layout">
        <div class="md-layout-item md-medium-size-50 md-small-size-50 md-xsmall-size-100 mapleft" ref="gradbg">
            <mu-flex  justify-content="center" align-items="center" class="left_content gradbg__anime" style="width:100%;height:100%;">
            </mu-flex>
        </div>

        <div class="md-layout-item md-medium-size-50 md-small-size-50 md-xsmall-size-100 mapright">
            <mu-flex class="mapflex" align-items="center">
                <mu-flex class="maparea" justify-content="center" fill>
                    <!--MAP-->
                    <map-view id="map" class="overlay" ref="emorymap" :markersRef="markersRef" @switchLayer="switchLayer" @mapClick="mapClick" @mClick="mClick" @tClick="mClick" @pClick="pClick"/>

                    <!-- INFO_OVERLAY(MENU) -->
                    <mu-flex class="info_overlay overlay" ref="info_overlay" justify-content="center" direction="column" align-items="center">

                        <bounce-loader class="bounce-loader" v-if="mapstore.tracking"></bounce-loader>

                        <mu-flex class="info_menu" justify-content="center" align-items="center">
                            <mu-flex class="info_box how" justify-content="center" align-items="center" direction="column" fill>
                                <img src="/static/img/emory/logos/isometric_b.png" style="width:180px;height:auto;">

                                <mu-icon value="build" :size="22" color="black" style="position:absolute;bottom:10px;left:10px;" @click="goMap(false,'/mapadmin')"></mu-icon>

                                <mu-icon value="settings_input_antenna" :size="22" color="black" style="position:absolute;top:10px;left:10px;" @click="trackOnce"></mu-icon>

                                <!--                        <div class="geo_status">-->
                                <!--                            <mu-button full-width color="pink700" @click="trackOnce">-->
                                <!--                                <mu-icon value="settings_input_antenna" :size="15"></mu-icon>&nbsp;now-->
                                <!--                            </mu-button>-->
                                <!--                        </div>-->

                                <div class="map_toggle">
                                    <mu-button full-width color="purple800" @click="switchLayer('map')">
                                        <mu-icon value="map" :size="15"></mu-icon>&nbsp;MAP
                                    </mu-button>
                                </div>

                                <div class="mode_toggle" v-if="mapstore.emory.project">
                                    <mu-button full-width color="blue700" @click="switchLayer('toggle_project')" v-if="mapstore.map.projectBoundary">
                                        overlay
                                    </mu-button>
                                    <mu-button full-width color="blue700" @click="switchLayer('toggle_project')" v-else>
                                        normal
                                    </mu-button>
                                </div>


                            </mu-flex>
                        </mu-flex>

                        <mu-flex class="info_menu" justify-content="center" align-items="center">

                            <div class="usercard  login" v-if="spotify.credential.expires_in">
                                <mu-avatar slot="avatar" style="border:2px solid white;">
                                    <img :src="avatar_thumb">
                                </mu-avatar>
                                <div class="title">{{spotify.me.id}}</div>
                                <div class="subtitle">Spotifyにログイン中</div>
                            </div>
                            <div class="usercard" v-else>
                                <!--                        <mu-avatar slot="avatar">-->
                                <!--                            <img src="/static/img/markers/m_mainuser_1.png">-->
                                <!--                        </mu-avatar>-->
                                <div class="title">GUEST USER</div>
                                <div class="subtitle">ログインしていません。</div>
                                <div class="key_btn" @click="c_getCredential"><mu-icon value="vpn_key" :size="18"></mu-icon></div>
                            </div>

                        </mu-flex>

                        <mu-flex class="info_menu" justify-content="center" align-items="center">
                            <mu-flex class="info_box address" fill>
                                <mu-form :model="newMarker" class="range">
                                    <mu-form-item prop="project" class="range">
                                        <mu-select  prop="project" :value="mapstore.emory.project ? mapstore.emory.project : 'プロジェクトを選んでください'" @change="onProjectSelected">
                                            <mu-option v-for="(p,key,inx) in mapstore.emory.projects" :key="'proj'+key" :label="p.title" :value="key" v-if="key !== mapstore.emory.all"></mu-option>
                                        </mu-select>
                                    </mu-form-item>
                                </mu-form>
                            </mu-flex>
                        </mu-flex>

                        <mu-flex class="info_menu" justify-content="center" align-items="center" v-if="mapstore.emory.project">
                            <mu-flex class="info_box play" justify-content="center" align-items="center" direction="column" fill @click="switchLayer('play_map')">
                            </mu-flex>
                            <mu-flex class="info_box area" justify-content="center" align-items="center" direction="column" fill @click="switchLayer('play_imagemap')">
                            </mu-flex>
                        </mu-flex>

                    </mu-flex>

                    <!-- PLAY OVERLAY-->
                    <div class="play_overlay overlay" ref="play_overlay" :class="{hide:!mapstore.mainuser}">
                        <mu-flex class="info_box"　justify-content="center" align-items="center" direction="column" style="height:100%;">
                            <mu-flex justify-content="center" align-items="center" direction="column" style="width:100%;height:100%;padding:8px;">
                                <mu-flex justify-content="center" align-items="center" direction="column" class="inner" style="background-color:rgba(35,230,169,0.9);height:100%;width:100%;border-radius:6px;padding:6px;">

                                    <div gutter style="width:100%;margin-top:-16px;" v-if="mapstore.emory.project">

                                        <mu-col class="info_col" span="12" sm="12" md="12" lg="12" xl="12" style="float:left;" v-if="mapstore.emory.projects[mapstore.emory.project]">
                                            <mu-card raised style="width: 100%; margin: 0 auto;background-color:rgb(41, 41, 93);">

                                                <div class="play_card_img">
                                                    <mu-card-media
                                                            :title="mapstore.emory.projects[mapstore.emory.project].title"
                                                            :sub-title="mapstore.emory.projects[mapstore.emory.project].desc">
                                                        <img :src="mapstore.emory.projects[mapstore.emory.project].thumb">
                                                    </mu-card-media>
                                                </div>

                                                <mu-card-header style="white-space: inherit;padding:4px;" v-if="mapstore.mainuser">
                                                    <my-avatar :marker="marker" :id="marker.id" v-for="(marker,id) in sortedMarkers" :key="'mv'+id"></my-avatar>
                                                </mu-card-header>
                                            </mu-card>
                                        </mu-col>

                                        <mu-col span="12" sm="12" md="12" lg="12" xl="12" style="width:100%;text-align:center;" v-else>
                                            <h1 style="margin:4px auto;color:black;">プロジェクトを選択してください。</h1>
                                        </mu-col>
                                        <mu-col span="12" sm="12" md="12" lg="12" xl="12" style="width:100%;text-align:center;">
                                            <mu-select label="有効範囲" prop="triggerDist" :value="mapstore.emory.triggerDist" @change="(val)=>a_mapstore(['emory','setTriggerDist',val])" style="margin-bottom:0;padding-bottom:0;">
                                                <mu-option  label="8m" :value="8"></mu-option>
                                                <mu-option  label="10m" :value="10"></mu-option>
                                                <mu-option  label="20m" :value="20"></mu-option>
                                                <mu-option  label="30m" :value="30"></mu-option>
                                                <mu-option  label="50m" :value="50"></mu-option>
                                                <mu-option  label="80m" :value="80"></mu-option>
                                            </mu-select>
                                        </mu-col>
                                    </div>

                                    <mu-flex justify-content="center" align-items="center" direction="row">
                                        <mu-button color="primary"    class="smallbtn"  @click="playStart" v-if="mapstore.emory.projects[mapstore.emory.project]">プレイ開始</mu-button>
                                        <mu-button color="indigo800"  class="smallbtn"  @click="backToInfo">メニューへ</mu-button>
                                    </mu-flex>

                                </mu-flex>

                            </mu-flex>
                        </mu-flex>
                    </div>
                </mu-flex>
            </mu-flex>

            <!-- MP3 EPISODE PLAYER-->
            <div class="mp3_players" v-if="$route.name ==='Map' || $route.name ==='MapAdmin'">
                <audio-player :key="'pod'+index" :num="index" :pod="pod" v-for="(pod,index) in mp3.pods"></audio-player>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import spotifyMixin from '../mixins/spotify';
    import mapMixin from '../mixins/map';
    import wsMixin from '../mixins/ws';
    import utilMixin from '../mixins/util';

    import {ruleEmpty} from '../store/rules';
    import firebase from 'firebase';
    import MapView from '../components/Map/MapViewLL';
    import MapUserItem from '../components/Map/MapUserItem';
    import MyAvatar from '../components/Map/MyAvatar';
    import BounceLoader from 'vue-spinner/src/BounceLoader.vue';
    import AudioPlayer from '../components/Mp3/AudioPlayer';

    import M from '../class/map/EMarker';
    import P from '../class/map/EProject';
    import GradBgs from '../class/anime/GradBgs';

    export default {
        name: 'Map',
        mixins: [
            spotifyMixin,
            mapMixin,
            wsMixin,
            utilMixin
        ],
        components: {
            MapView,
            MapUserItem,
            MyAvatar,
            BounceLoader,
            AudioPlayer
        },
        data() {
            return {
                //google GeoCoder
                geocoder: {},

                //SOCKET.IO(not in use)
                socket:     null,
                //MODE
                mode:       'info',

                userisready: false,

                //MAIN USER
                mainuser:   null,

                //FIREBASE
                markersRef: null,
                projsRef:   null,

                //FORM
                blankRules: [ruleEmpty],
                newMarker: {
                    markertype: 'mp3',
                    isEpisode:  false,
                    center:     null,
                    title:      "",
                    desc:       "",
                    type:       'other',
                    spotifyid:  "",
                    public:     'open',
                    thumb:      null,
                    project:    null,
                    w:      35,
                    h:      35
                },
                newProject:{
                    center:     null,
                    zoom:       22,
                    desc:       "",
                    title:      "",
                    spotifyid:  ""
                }
            }
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
            }
        },
        computed:{
            ...mapGetters(['spotify', 'mapstore','loggedIn', 'ws','mp3']),

            avatar_thumb(){
                console.log("avatar_thumb!");
                //return '/static/img/markers/m_mainuser_1.png';
                return this.spotify.bookmarks ? this.spotify.bookmarks[0].album.images[0].url : '/static/img/markers/m_mainuser_1.png'
            }
        },
        created() {
            this.markersRef = firebase.database().ref('markers');
            this.projsRef   = firebase.database().ref('projects');
        },
        mounted() {
            //アニメーションの初期設定
            new GradBgs(this.$refs.gradbg);

            this.switchLayer('info');

            //最初の一回だけ、現在位置へジャンプする
            if(!this.mapstore.emory.play.init){
                this.$nextTick(()=>{
                    this.trackOnce();
                    this.a_mapstore(['emory','initPlay', true]);
                });

                //setTimeout(() => this.trackOnce(), 2000);
            }

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


            //全マーカーの設定（リスナー）
            this.markersRef.on('value', (snapshot)=> this.a_mapstore(['set','markers',snapshot.val()]));
            //全エリアの設定（リスナー）
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
                this.$refs.emorymap.geoCurrentPosition();
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

            onProjectSelected(key) {
                this.newMarker.project = key;
                //リセット(polyの消去）
                this.a_mapstore(['set','poly',null]);
                this.a_mapstore(['emory', 'setproject', key]);
                this.a_mapstore(['set', 'tracking', false]);
                let proj = this.mapstore.emory.projects[key];
                this.a_mapstore(['center', 'map', proj.center]);
                //setTimeout(() => this.a_mapstore(['center', 'map', proj.center]), 5100);
                this.distOfProjPoints();
                this.drawPoly();
            },
            mapClick(val) {
                this.switchLayer('info');
            },
            pClick(val,id){
                this.a_mapstore(['center','map',val.center]);
                this.onProjectSelected(id);
            },
            mClick(val,id){
                this.a_mapstore(['set', 'tracking', false]);
                this.callPlayerFromMap(val);

            },
            connectToSocket() {
                if (this.spotify.me && this.spotify.me.id) {
                    let your_pos_and_data = {
                        name: this.spotify.me.id,
                        lat: this.$refs.emorymap.lat,
                        lng: this.$refs.emorymap.lng,
                        pid: this.spotify.playlist ? this.spotify.playlist.id : null,
                        tid: this.spotify.track ? this.spotify.track.id : null
                    };
                    this.socketConnect(your_pos_and_data);
                }
            },
            setNewCenter(latlng,mouseXY) {
                this.newMarker.center = latlng;
                this.newProject.center = latlng;
                this.$refs.selectedPoint.style.top = mouseXY.y-10+'px';
                this.$refs.selectedPoint.style.left = mouseXY.x-10+'px';
            },


            backToInfo(){
                this.switchLayer('info');
            },

            playStart(){
                this.a_mapstore(['set', 'tracking', true]);
                this.switchLayer('map');
                this.a_index(['storyModal','toggle',true]);
            },

            switchLayer(mode) {
                let info_overlay = this.$refs.info_overlay;
                let play_overlay = this.$refs.play_overlay;
                //let net_overlay = this.$refs.net_overlay;
                this.mode = mode;
                switch (mode) {
                    case 'info':
                        this.a_mapstore(['set', 'tracking', false]);
                        info_overlay.style.visibility = 'visible';
                        info_overlay.style.zIndex = 401;
                        play_overlay.style.zIndex = -1;
                       // net_overlay.style.zIndex = -1;

                        break;

                    case 'play_map':
                        this.a_mapstore(['set','projBoundary',false]);
                        info_overlay.style.visibility = 'hidden';
                        play_overlay.style.zIndex = 1001;
                        //net_overlay.style.zIndex = -1;
                        break;

                    case 'play_imagemap':
                        this.a_mapstore(['set','projBoundary',true]);
                        info_overlay.style.visibility = 'hidden';
                        play_overlay.style.zIndex = 1001;
                        //net_overlay.style.zIndex = -1;

                        break;
                    // case 'net':
                    //     info_overlay.style.visibility = 'hidden';
                    //     play_overlay.style.zIndex = -1;
                    //     net_overlay.style.zIndex = 401;
                    //     break;
                    case 'map':
                        info_overlay.style.visibility = 'hidden';
                        info_overlay.style.zIndex = -1;
                        play_overlay.style.zIndex = -1;
                       // net_overlay.style.zIndex = -1;
                        break;

                    case 'toggle_project':
                        this.a_mapstore(['set','projBoundary','toggle']);
                        break;
                }
            },
        }
    }
</script>
