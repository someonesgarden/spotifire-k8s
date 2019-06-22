<template>
    <mu-flex class="mapflex" align-items="center">
        <mu-flex justify-content="center" class="maparea" fill>
            <map-view id="map" ref="emorymap" :markersRef="markersRef" @switchLayer="switchLayer" @mapClick="mapClick" @mClick="mClick" @pClick="pClick"/>

            <!-- INFO_OVERLAY(MENU) -->
            <mu-flex justify-content="center" direction="column" align-items="center" class="info_overlay overlay" ref="info_overlay">

                <bounce-loader class="bounce-loader" v-if="mapstore.tracking"></bounce-loader>

                <mu-flex class="info_menu" justify-content="center" align-items="center">
                    <mu-flex class="info_box how" justify-content="center" align-items="center" direction="column" fill style="background-color:rgba(20,30,23,0.69);">
                        <img src="/static/img/emory_logo1_admin.png" style="width:180px;height:auto;">

                        <mu-icon value="play_circle_outline" :size="20" color="white" style="position:absolute;bottom:10px;left:10px;" @click="goMap(false,'/map')"></mu-icon>

                        <div class="geo_status">
                            <mu-button full-width color="pink700" @click="trackOnce">
                                <mu-icon value="settings_input_antenna" :size="15"></mu-icon>&nbsp;now
                            </mu-button>
                        </div>

<!--                        <div class="geo_status">-->
<!--                            <mu-button full-width color="cyan400" @click="trackToggle" v-if="mapstore.tracking">-->
<!--                                <mu-icon value="portable_wifi_off" :size="15"></mu-icon>&nbsp;ON-->
<!--                            </mu-button>-->
<!--                            <mu-button full-width color="pink700" @click="trackToggle" v-else>-->
<!--                                <mu-icon value="settings_input_antenna" :size="15"></mu-icon>&nbsp;OFF-->
<!--                            </mu-button>-->
<!--                        </div>-->

                        <div class="map_toggle">
                            <mu-button full-width color="purple800" @click="switchLayer('map')">
                                <mu-icon value="map" :size="15"></mu-icon>&nbsp;MAP
                            </mu-button>
                        </div>

                        <div class="mode_toggle" v-if="mapstore.emory.project">
                            <mu-button full-width color="blue700" @click="switchLayer('toggle_project')" v-if="mapstore.map.projectBoundary">
                                <mu-icon value="swap_calls" :size="15"></mu-icon>&nbsp;img
                            </mu-button>
                            <mu-button full-width color="blue700" @click="switchLayer('toggle_project')" v-else>
                                <mu-icon value="swap_calls" :size="15"></mu-icon>&nbsp;map
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
                    <mu-flex class="info_box marker_edit" justify-content="center" align-items="center" direction="column" fill  @click="switchLayer('edit')">
                        <mu-icon value="build" :size="20"></mu-icon>marker.
                    </mu-flex>
                    <mu-flex class="info_box area_edit" justify-content="center" align-items="center" direction="column" fill @click="$router.push('/maparea')">
                        <mu-icon value="build" :size="20"></mu-icon>area.
                    </mu-flex>
                </mu-flex>

            </mu-flex>
            <!--/  INFO_OVERLAY(MENU)-->

            <!--EDIT OVERLAY-->
            <div class="edit_overlay overlay" ref="edit_overlay"  :class="{hide:!mapstore.mainuser}">
                <mu-flex class="info_box" justify-content="center" align-items="center" direction="column" style="height:100%;">
                    <h1>
                        <mu-icon value="build" :size="20"></mu-icon>
                        edit.
                        <span v-if="editing.type==='marker'"> - マーカー編集  </span>
                        <span v-else> - プロジェクト編集 </span>
                    </h1>
                    <h2 v-if="!newMarker.center">「編集」で表示される地図をクリックすると座標選択できます。</h2>
                    <h2 v-else>このポイントを保存する場合は「保存」を押してください。</h2>
                    <br>

                    <mu-form :model="newMarker" ref="newmarkerform" :label-position="'top'" label-width="100" v-if="newMarker.center && editing.type==='marker'" class="range edit_form">
                        <img :src="newMarker.thumb" v-if="newMarker.thumb">
                        <mu-form-item prop="title" :rules="blankRules">
                            <mu-text-field prop="title" placeholder="マーカーのタイトル" v-model="newMarker.title"/>
                        </mu-form-item>
                        <mu-form-item prop="desc" :rules="blankRules">
                            <mu-text-field prop="desc" placeholder="メモ（20文字以内）" v-model="newMarker.desc"/>
                        </mu-form-item>

                        <mu-form-item prop="isEpisode" :label="newMarker.isEpisode ? 'エピソード' : 'トラック'">
                            <mu-switch v-model="newMarker.isEpisode"></mu-switch>
                        </mu-form-item>

                        <mu-form-item prop="spotifyid" :rules="blankRules">
                            <mu-select prop="spotifyid" color="primary" v-model="newMarker.spotifyid" v-if="newMarker.isEpisode && spotify.episodes">
                                <mu-option  :label="epi.name" :value="epi.id" v-for="(epi,inx) in spotify.episodes.items" :key="'epi'+inx"></mu-option>
                            </mu-select>
                            <mu-text-field prop="spotifyid" placeholder="Track ID" v-model="newMarker.spotifyid" v-else/>

                        </mu-form-item>
                        <mu-form-item prop="type">
                            <mu-select prop="type" color="primary" v-model="newMarker.type">
                                <mu-option  label="スポット"  value="spot"></mu-option>
                                <mu-option  label="人"       value="person"></mu-option>
                                <mu-option  label="その他"    value="other"></mu-option>
                            </mu-select>
                        </mu-form-item>

                        <mu-form-item prop="radio" label="公開">
                            <mu-radio v-model="newMarker.public" value="open" label="公開"></mu-radio>
                            <mu-radio v-model="newMarker.public" value="close" label="非公開"></mu-radio>
                        </mu-form-item>

                        <mu-flex justify-content="center" align-items="center" direction="row">
                            <mu-button color="red"      class="smallbtn" @click="delFirebase(markersRef,newMarker.id)" v-if="newMarker.id"><mu-icon value="delete_forever" :size="20"></mu-icon>&nbsp;削除</mu-button>
                            <mu-button color="info"     class="smallbtn" @click="saveNewMarker"     v-if="newMarker.center"><mu-icon value="save" :size="20"></mu-icon>&nbsp;保存</mu-button>
                        </mu-flex>
                    </mu-form>

                    <mu-form :model="newProject" ref="newprojectform" :label-position="'top'" label-width="100" v-if="newProject.center && editing.type==='project'" class="range edit_form">
                        <img :src="newProject.thumb" v-if="newProject.thumb">
                        <mu-form-item prop="title" :rules="blankRules">
                            <mu-text-field prop="title" placeholder="プロジェクトのタイトル" v-model="newProject.title"/>
                        </mu-form-item>
                        <mu-form-item prop="desc" :rules="blankRules">
                            <mu-text-field prop="desc" placeholder="プロジェクトの概要(100文字程度）" multi-line :rows="2" v-model="newProject.desc"/>
                        </mu-form-item>
                        <mu-form-item prop="spotifyid" :rules="blankRules">
                            <mu-text-field prop="spotifyid" placeholder="Spotify ID" v-model="newProject.spotifyid"/>
                            <mu-select prop="spotifyid" color="primary" v-model="newProject.spotifyid" v-if="spotify.playlists">
                                <mu-option  :label="pro.name" :value="pro.id" v-for="(pro,inx) in spotify.playlists.items" :key="'pro'+inx"></mu-option>
                            </mu-select>

                        </mu-form-item>

                        <mu-flex justify-content="center" align-items="center" direction="row">
                            <mu-button color="red"      class="smallbtn" @click="delFirebase(projsRef,newProject.id)" v-if="newProject.id"><mu-icon value="delete_forever" :size="20"></mu-icon>&nbsp;削除</mu-button>
                            <mu-button color="info" class="smallbtn" @click="saveNewProject" v-if="newProject.center"><mu-icon value="save" :size="20"></mu-icon>&nbsp;保存</mu-button>
                        </mu-flex>
                    </mu-form>

                    <mu-flex justify-content="center" align-items="center" direction="row">
                        <mu-button color="indigo400" class="smallbtn" @click="editProject">プロジェクト編集</mu-button>
                        <mu-button color="indigo600" class="smallbtn" @click="editMarker">マーカー編集</mu-button>
                        <mu-button color="indigo800" class="smallbtn" @click="editEnd">終了</mu-button>
                    </mu-flex>

                    <div ref="selectedPoint" class="selectedPoint" :class="{'project':editing.type==='project'}"></div>
                </mu-flex>
            </div>
            <!--/EDIT OVERLAY-->
        </mu-flex>

    </mu-flex>

</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import spotifyMixin from '../mixins/spotify/index';
    import mapMixin from '../mixins/map/index';
    import utilMixin from '../mixins/util';
    import wsMixin from '../mixins/ws/index';
    import {ruleEmpty} from '../store/rules';
    import firebase from 'firebase';
    import MapView from './Map/MapViewLL';
    import MapUserItem from './Map/MapUserItem';
    import MyAvatar from './Map/MyAvatar';
    import BounceLoader from 'vue-spinner/src/BounceLoader.vue';
    import M from '../class/map/EMarker';
    import P from '../class/map/EProject';
    export default {
        name: 'MapAdmin',
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
            BounceLoader
        },
        data() {
            return {
                //google GeoCoder
                geocoder: {},

                //SOCKET.IO(not in use)
                socket:     null,
                //MODE
                mode:       'info',
                editing: {
                    status:     false,
                    type:       'marker'
                },
                userisready: false,

                //MAIN USER
                mainuser:   null,

                //FIREBASE
                markersRef: null,
                projsRef:   null,

                //FORM
                blankRules: [ruleEmpty],
                newMarker: {
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
            ...mapGetters(['spotify', 'mapstore','loggedIn', 'ws']),

            avatar_thumb(){
                console.log("avatar_thumb!");
                return this.spotify.bookmarks ? this.spotify.bookmarks[0].album.images[0].url : '/static/img/markers/m_mainuser_1.png'
            }
        },
        created() {
            this.markersRef = firebase.database().ref('markers');
            this.projsRef   = firebase.database().ref('projects');
        },
        mounted() {
            this.switchLayer('info');

            if(this.mapstore.emory.project) this.newMarker.project = this.mapstore.emory.project;


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
                            center: {
                                lat:34.722677,
                                lng: 135.492364
                            },
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
                if (this.editing.status) {
                    if(val.containerPoint && val.containerPoint.x > 0) this.setNewCenter(val.latlng,val.containerPoint);
                    this.switchLayer('edit');
                } else {
                    this.switchLayer('info');
                }
            },
            pClick(val,id){
                if (this.editing.status){
                    this.switchLayer('edit');
                    this.newProject = val;
                    if(id) this.newProject.id =id;
                    console.log("project in edit mode");
                }else{
                    console.log("project in play mode");
                    this.a_mapstore(['center','map',val.center]);
                    this.onProjectSelected(id);
                }
            },
            mClick(val,id){
                if (this.editing.status){
                    this.switchLayer('edit');
                    this.newMarker = val;
                    if(id) this.newMarker.id =id;
                }else{
                    //自分とpointの距離を測る
                    let mainuser = this.mapstore.markers[this.mapstore.mainuser.id];

                    if(val.spotifytype==='track'){
                        this.c_getTrack(val.spotifyid,(res)=>{
                            if(!!res.data){
                                this.a_spotify(['player','track',res.data]);
                                this.a_spotify(['player','play',{id:val.spotifyid,type:'track'}]);
                            }
                        });
                        this.a_index(['bottom','open']);

                    }else if(val.spotifytype==='episode'){
                        //ポッドキャストepisodeの場合、mp3プレイヤーを開く
                        //this.a_index(['bottom','open']);
                        this.a_mp3(['pod', 0, 'playing',false]);
                        setTimeout(()=> this.a_mp3(['pod',0,'file',val.mp3]),100);
                        setTimeout(()=> this.a_mp3(['pod',0,'volume',75]),100);
                        setTimeout(()=> this.a_mp3(['pod',0,'playing', true+Math.floor(Math.random() * 3)]),100);
                    }
                }
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
            editProject(){
                this.editing.type='project';
                this.cancelEditMode();
            },
            editMarker(){
                this.editing.type='marker';
                this.cancelEditMode();
            },
            cancelEditMode() {
                this.newMarker = new M({}).marker;
                this.newProject = new P({}).project;
                this.switchLayer('map');
            },
            backToInfo(){
                this.switchLayer('info');
            },

            editEnd() {
                this.editing.status = false;
                this.switchLayer('info');
                this.newMarker = new M({}).marker;
                this.mode = "info";
                this.$refs.selectedPoint.style.top = -300+'px';
            },
            delFirebase(ref,id){
                ref.child(id).remove();
                this.cancelEditMode();
            },
            saveNewMarker() {
                this.$refs.newmarkerform.validate().then(valid => {
                    if (valid) {
                        if (this.newMarker.center) {
                            if (this.newMarker.center.lat !== 34.722677123) { //初期値「大阪のある場所」じゃなければ
                                this.newMarker.project = this.mapstore.emory.project;
                                new M(this.newMarker).updateOrNew(this.markersRef);
                                this.newMarker = new M({}).marker;  // フォームの初期化
                                this.cancelEditMode();
                            }
                        }
                    }
                });
            },
            saveNewProject(){
                this.$refs.newprojectform.validate().then(valid => {
                    if (valid) {
                        if (this.newProject.center) {
                            if (this.newProject.center.lat !== 34.722677123) { //初期値「大阪のある場所」じゃなければ
                                this.newProject.zoom = 20;
                                new P(this.newProject).updateOrNew(this.projsRef);
                                this.newProject = new P({}).project; // フォームの初期化
                                this.cancelEditMode();
                            }
                        }

                    }
                });
            },
            switchLayer(mode) {
                let info_overlay = this.$refs.info_overlay;
                let edit_overlay = this.$refs.edit_overlay;
                this.mode = mode;
                switch (mode) {
                    case 'info':
                        this.a_mapstore(['set', 'tracking', false]);
                        info_overlay.style.visibility = 'visible';
                        info_overlay.style.zIndex = 401;
                        edit_overlay.style.zIndex = -1;
                        break;

                    case 'edit':
                        this.editing.status = true;
                        info_overlay.style.visibility = 'hidden';
                        info_overlay.style.zIndex = -1;
                        edit_overlay.style.zIndex = 401;
                        break;
                    case 'map':
                        info_overlay.style.visibility = 'hidden';
                        info_overlay.style.zIndex = -1;
                        edit_overlay.style.zIndex = -1;
                        break;
                    case 'toggle_project':
                        this.a_mapstore(['set','projBoundary','toggle']);
                        break;
                }
            },
        }
    }
</script>

<style lang="scss">
    .selectedPoint{
        position:absolute;
        top:-300px;
        width:20px;
        height:20px;
        border-radius:50%;
        background-color: rgba(255, 0, 0, 0.75);
        &.project{
            background-color: rgba(0, 128, 0, 0.75);
        }
    }

    .bounce-loader{
        position:absolute;
        width:60px;
        height:60px;
        left:calc(50vw - 30px);
        top:calc(50vh - 60px);
    }

    .play_card_img {

        width: 100%;
        max-width: 200px !important;
        text-align: center;
        padding: 5px;
        margin: 0 auto;

        img {
            width: 100%;
            height: auto;
            margin: 0 auto;
        }
    }

    .info_col {
        .mu-card-title-container {
            padding: 6px;
        }

        .mu-card-title{
            font-size:20px;
            color: #fff;
            line-height:26px;
        }

        .mu-card-sub-title{
            color: #fff;
        }



        .mu-avatar {
            width: 25px;
            height: 25px;
            margin-right:2px;
        }
    }

    .info_box{
        position:relative;

        .geo_status{
            position:absolute;
            left:0;
            top:0;
        }

        .map_toggle{
            position:absolute;
            right:0;
            bottom:0;
        }
    }

</style>
