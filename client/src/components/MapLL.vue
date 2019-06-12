<template>
    <mu-flex class="mapflex" align-items="center">
        <mu-flex justify-content="center" class="maparea" fill>
            <map-view id="map" ref="emorymap" :markersRef="markersRef" @switchLayer="switchLayer" @mapClick="mapClick" @mClick="mClick" @pClick="pClick"/>

            <!-- INFO_OVERLAY(MENU) -->
            <mu-flex justify-content="center" direction="column" align-items="center" class="info_overlay overlay" ref="info_overlay">

                <bounce-loader class="bounce-loader" v-if="mapstore.tracking"></bounce-loader>

                <mu-flex class="info_menu" justify-content="center" align-items="center">
                    <mu-flex class="info_box how" justify-content="center" align-items="center" direction="column" fill>
                        <img src="/static/img/emory/emory_logo_w.png" style="width:180px;height:auto;">
                        <mu-button full-width color="cyan400" @click="trackToggle" v-if="mapstore.tracking">
                            <mu-icon value="portable_wifi_off" :size="15"></mu-icon>
                            GEO is [ON] > click to [OFF]
                        </mu-button>
                        <mu-button full-width color="pink500" @click="trackToggle" v-else>
                            <mu-icon value="settings_input_antenna" :size="15"></mu-icon>
                            GEO is [OFF] > click to [ON]
                        </mu-button>
                    </mu-flex>
                </mu-flex>

                <mu-flex class="info_menu" justify-content="center" align-items="center">
                    <mu-flex class="info_box address" fill>
                    <mu-form :model="newMarker" class="range">
                        <mu-form-item prop="project" class="range">
                            <mu-select  prop="project" :value="mapstore.emory.project" @change="onProjectSelected">
                                <mu-option v-for="(p,key,inx) in mapstore.emory.projects" :key="'proj'+key" :label="p.title" :value="key" v-if="key !== mapstore.emory.all"></mu-option>
                            </mu-select>
                        </mu-form-item>
                    </mu-form>
                    </mu-flex>
                </mu-flex>

                <mu-flex class="info_menu" justify-content="center" align-items="center">
                    <mu-flex class="info_box play" justify-content="center" align-items="center" direction="column" fill @click="switchLayer('play')">
                        <mu-icon value="pets" :size="20"></mu-icon>play.
                    </mu-flex>

                    <mu-flex class="info_box edit" justify-content="center" align-items="center" direction="column" fill @click="switchLayer('edit')">
                        <mu-icon value="build" :size="20"></mu-icon>edit.
                    </mu-flex>
                </mu-flex>

                <mu-flex class="info_menu" justify-content="center" align-items="center">
                    <mu-flex class="info_box map" justify-content="center" align-items="center" direction="column" fill @click="switchLayer('map')">
                        <span><mu-icon value="map" :size="14"></mu-icon>&nbsp;map</span>
                    </mu-flex>
                </mu-flex>
            </mu-flex>
            <!--/  INFO_OVERLAY(MENU)-->

            <!-- PLAY OVERLAY-->
            <div class="play_overlay overlay" ref="play_overlay" :class="{hide:!mapstore.mainuser}">
                <mu-flex class="info_box"　justify-content="center" align-items="center" direction="column" style="height:100%;">
                    <mu-flex justify-content="center" align-items="center" direction="column" style="width:100%;height:100%;padding:20px;">
                        <mu-flex justify-content="center" align-items="center" direction="column" class="inner" style="background-color:rgba(31, 6, 6, 0.19);height:100%;width:100%;border-radius:6px;padding:15px 22px;">


                            <div gutter style="width:100%;" v-if="mapstore.emory.project">

                                <mu-col class="info_col" span="12" sm="12" md="12" lg="12" xl="12" style="float:left;" v-if="mapstore.emory.projects[mapstore.emory.project]">
                                    <mu-card style="width: 100%; margin: 0 auto; background-color:rgba(3,3,3,0.36);">

                                        <div class="play_card_img">
                                                <img :src="mapstore.emory.projects[mapstore.emory.project].thumb">
                                        </div>
                                        <mu-card-title style="color:white;" :title="mapstore.emory.projects[mapstore.emory.project].title"></mu-card-title>
                                        <mu-card-text style="color:white;">
                                            {{mapstore.emory.projects[mapstore.emory.project].desc}}
                                        </mu-card-text>

                                        <mu-card-header style="white-space: inherit;padding:4px;" v-if="mapstore.mainuser">
                                            <my-avatar :marker="marker" :id="marker.id" v-for="(marker,id) in sortedMarkers" :key="'mv'+id"></my-avatar>
                                        </mu-card-header>
                                    </mu-card>
                                </mu-col>

                                <mu-col span="12" sm="12" md="12" lg="12" xl="12" style="width:100%;text-align:center;" v-else>
                                    <h1 style="margin:4px auto;">プロジェクトを選択してください。</h1>
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
            <!--/ PLAY OVERLAY-->

            <!-- NET OVERLAY -->
            <div class="net_overlay overlay" ref="net_overlay"  :class="{hide:!mapstore.mainuser}">

                <mu-flex class="info_box"　justify-content="center" align-items="center" direction="column" style="height:100%;">

                    <h1>
                        <mu-icon value="network_check" :size="20"></mu-icon>
                        socket.io.
                    </h1>
                    <h2>WebSocketを経由してリアルタイムにつながったユーザーを確認します。</h2>

                    <mu-list style="width:inherit;">
                        <map-user-item :user="user" v-for="(user,key,index) in ws.users" :key="'user'+key+index"/>
                    </mu-list>

                    <mu-flex justify-content="center" align-items="center" direction="row">

                        <mu-button color="indigo500" @click="connectToSocket" v-if="!ws.you.connected">
                            <mu-icon value="device_hub" :size="15"></mu-icon>
                            CONNECT
                        </mu-button>
                        <mu-button  color="red500" @click="socketDisconnect" v-else>
                            <mu-icon value="settings_input_composite" :size="15"></mu-icon>
                            DISCONNECT
                        </mu-button>

                        <mu-button color="primary"  class="smallbtn" @click="backToInfo">終了</mu-button>
                    </mu-flex>

                </mu-flex>
            </div>
            <!--/NET OVERLAY -->

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
                        <mu-form-item prop="project" label="プロジェクトを選択" :rules="blankRules">
                            <mu-select  prop="project" v-model="newMarker.project">
                                <mu-option v-for="(p,key,inx) in mapstore.emory.projects" :key="'proj'+key" :label="p.title" :value="key"></mu-option>
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
        name: 'mymapLL',
        mixins: [
            spotifyMixin,
            mapMixin,
            wsMixin
        ],
        components: {
            MapView,
            MapUserItem,
            MyAvatar,
            BounceLoader
        },
        data() {
            return {
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
                    project:    "",
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
                    console.log("[watch] me handler");
                    if(!!newMe){
                        if(!this.spotify.me.bookmark_num) {
                            this.a_index(['alert', 'set', "Spotifyユーザーデータを調べています"]);
                            this.a_index(['alert', 'open']);
                        }

                        //ユーザーのbookmarkデータがなくてもとりあえず初期化する
                        this.createOrFindMainuser(this.spotify.me.id);
                        //FireBaseのイベントリスナー
                        this.markersRef.on('value', (snapshot)=> this.a_mapstore(['set','markers',snapshot.val()]));
                        this.projsRef.on('value',   (snapshot)=> this.a_mapstore(['emory','setprojects',snapshot.val()]));

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
        computed:mapGetters(['spotify', 'mapstore', 'ws']),
        created() {
            this.markersRef = firebase.database().ref('markers');
            this.projsRef   = firebase.database().ref('projects');
        },
        mounted() {
            this.switchLayer('info');
            if(!this.spotify.me){
                this.a_index(['alert','set',"Spotifyにログインが必要です。"]);
                this.a_index(['alert','open']);
                this.a_index(['alert','action','login']);
            }
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

            createOrFindMainuser(meid){
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
                    this.setNewCenter(val.latlng,val.containerPoint);
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
                    let dist = this.distKmofCenters(mainuser.center, val.center);

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
                        this.a_index(['bottom','open']);
                        setTimeout(()=> this.a_mp3(['pod',0,'file',val.mp3]),100);
                        setTimeout(()=> this.a_mp3(['pod',0,'volume',6]),100);
                        setTimeout(()=> this.a_mp3(['pod',0,'playing', true]),100);
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

            playStart(){
              this.a_mapstore(['set', 'tracking', true]);
                this.switchLayer('map');
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
                        if (!this.newMarker.center) { return; }
                        new M(this.newMarker).updateOrNew(this.markersRef);
                        this.newMarker = new M({}).marker;  // フォームの初期化
                        this.cancelEditMode();
                    }
                });
            },
            saveNewProject(){
                this.$refs.newprojectform.validate().then(valid => {
                    if (valid) {
                        if (!this.newProject.center) { return; }
                        this.newProject.zoom = 20;
                        new P(this.newProject).updateOrNew(this.projsRef);
                        this.newProject = new P({}).project; // フォームの初期化
                        this.cancelEditMode();
                    }
                });
            },
            switchLayer(mode) {
                let info_overlay = this.$refs.info_overlay;
                let play_overlay = this.$refs.play_overlay;
                let net_overlay = this.$refs.net_overlay;
                let edit_overlay = this.$refs.edit_overlay;
                this.mode = mode;
                switch (mode) {
                    case 'info':
                        info_overlay.style.visibility = 'visible';
                        info_overlay.style.zIndex = 401;
                        play_overlay.style.zIndex = -1;
                        net_overlay.style.zIndex = -1;
                        edit_overlay.style.zIndex = -1;
                        break;
                    case 'play':
                        info_overlay.style.visibility = 'hidden';
                        play_overlay.style.zIndex = 401;
                        net_overlay.style.zIndex = -1;
                        edit_overlay.style.zIndex = -1;
                        break;
                    case 'net':
                        info_overlay.style.visibility = 'hidden';
                        play_overlay.style.zIndex = -1;
                        net_overlay.style.zIndex = 401;
                        edit_overlay.style.zIndex = -1;
                        break;
                    case 'edit':
                        this.editing.status = true;
                        info_overlay.style.visibility = 'hidden';
                        info_overlay.style.zIndex = -1;
                        play_overlay.style.zIndex = -1;
                        net_overlay.style.zIndex = -1;
                        edit_overlay.style.zIndex = 401;
                        break;
                    case 'map':
                        info_overlay.style.visibility = 'hidden';
                        info_overlay.style.zIndex = -1;
                        play_overlay.style.zIndex = -1;
                        net_overlay.style.zIndex = -1;
                        edit_overlay.style.zIndex = -1;
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

    .play_card_img{

       width:100%;
        text-align:center;
        padding:10px;

        img {
            border: 6px solid #18a91d;
            border-radius: 18px;
            width: 150px;
            height: 150px;
            margin: 0 auto;

            @media all and (max-width: 767px) {
                width: 70px;
                height: 70px;
                border-radius: 50%;
            }
        }
    }

    .info_col {
        .mu-card-title-container{
            padding:8px;
        }

        .mu-card-title {
            color: #0affed;
        }

        .mu-avatar {
            width: 25px;
            height: 25px;
        }
    }
</style>
