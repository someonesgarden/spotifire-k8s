<template>
    <mu-flex class="mapflex" align-items="center">
        <mu-flex justify-content="center" class="maparea" fill>
            <map-view id="map" ref="emorymap" @switchLayer="switchLayer" @mapClick="mapClick" @mClick="mClick" @pClick="pClick"/>
            <!-- MENU -->
            <mu-flex justify-content="center" direction="column" align-items="center" class="info_overlay overlay" ref="info_overlay">

                <mu-flex class="info_menu" justify-content="center" align-items="center">
                    <mu-flex class="info_box how" justify-content="center" align-items="center" direction="column" fill>
                        <img src="/static/img/emory/emory_logo_w.png" style="width:180px;height:auto;">
                        <mu-button full-width color="cyan400" @click="trackToggle" v-if="mapstore.tracking">
                            <mu-icon value="portable_wifi_off" :size="15"></mu-icon>
                            GEOLOCATION : OFF
                        </mu-button>
                        <mu-button full-width color="pink500" @click="trackToggle" v-else>
                            <mu-icon value="settings_input_antenna" :size="15"></mu-icon>
                            GEOLOCATION : ON
                        </mu-button>
                    </mu-flex>
                </mu-flex>

                <mu-flex class="info_menu" justify-content="center" align-items="center">
                    <mu-flex class="info_box address" fill>
                    <mu-form :model="newMarker" class="range">
                        <mu-form-item prop="project" class="range">

                            <mu-select  prop="project" :value="mapstore.emory.project" @change="onProjectSelected">
                                <mu-option v-for="(p,key,inx) in mapstore.emory.projects" :key="'proj'+key" :label="p.title" :value="key"></mu-option>
                            </mu-select>
                        </mu-form-item>

                    </mu-form>
                    </mu-flex>
                </mu-flex>

                <mu-flex class="info_menu" justify-content="center" align-items="center">
                    <mu-flex class="info_box area" justify-content="center" align-items="center" direction="column" fill @click="switchLayer('map')">
                        <mu-icon value="pets" :size="20"></mu-icon>play.
                    </mu-flex>
                    <mu-flex class="info_box story" justify-content="center" align-items="center" direction="column" fill @click="switchLayer('net')">
                        <mu-icon value="network_check" :size="20"></mu-icon>around.
                    </mu-flex>
                    <mu-flex class="info_box edit" justify-content="center" align-items="center" direction="column" fill @click="switchLayer('edit')">
                        <mu-icon value="build" :size="20"></mu-icon>edit.
                    </mu-flex>
                </mu-flex>

            </mu-flex>
            <!--/ MENU-->


            <!-- USER OVERLAY-->
            <div class="area_overlay overlay" ref="area_overlay" @click="overlayClick">
            </div>
            <!--/ USRE OVERLAY-->


            <!-- NET OVERLAY -->
            <div class="net_overlay overlay" ref="net_overlay">

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

                        <mu-button color="primary"  class="smallbtn" @click="netEnd">終了</mu-button>
                    </mu-flex>

                </mu-flex>
            </div>
            <!--/NET OVERLAY -->


            <!--EDIT OVERLAY-->
            <div class="edit_overlay overlay" ref="edit_overlay">

                <mu-flex class="info_box" justify-content="center" align-items="center" direction="column" style="height:100%;">

                    <h1>
                        <mu-icon value="build" :size="20"></mu-icon>
                        edit.
                        <span v-if="editing.type==='marker'">[ マーカー編集 ] </span>
                        <span v-else>[ プロジェクト編集 ] </span>
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
                        <mu-form-item prop="spotifyid" :rules="blankRules">
                            <mu-text-field prop="spotifyid" placeholder="Spotify ID" v-model="newMarker.spotifyid"/>
                        </mu-form-item>
                        <mu-form-item prop="type">
                            <mu-select prop="type" color="primary" v-model="newMarker.type">
                                <mu-option  label="スポット"  value="spot"></mu-option>
                                <mu-option  label="人"       value="person"></mu-option>
                                <mu-option  label="その他"    value="other"></mu-option>
                            </mu-select>
                        </mu-form-item>
                        <mu-form-item prop="project" label="プロジェクトを選択">
                            <mu-select  prop="project" v-model="newMarker.project">
                                <mu-option v-for="(p,key,inx) in mapstore.emory.projects" :key="'proj'+key" :label="p.title" :value="key"></mu-option>
                            </mu-select>
                        </mu-form-item>

                        <mu-form-item prop="radio" label="公開">
                            <mu-radio v-model="newMarker.public" value="open" label="公開"></mu-radio>
                            <mu-radio v-model="newMarker.public" value="close" label="非公開"></mu-radio>
                        </mu-form-item>

                        <mu-flex justify-content="center" align-items="center" direction="row">
                            <mu-button color="red"      class="smallbtn" @click="delMarker" v-if="newMarker.id"><mu-icon value="delete_forever" :size="20"></mu-icon>&nbsp;削除</mu-button>
                            <mu-button color="info"     class="smallbtn" @click="saveNewMarker"     v-if="newMarker.center"><mu-icon value="save" :size="20"></mu-icon>&nbsp;保存</mu-button>
                        </mu-flex>
                    </mu-form>

                    <mu-form :model="newProject" ref="newprojectform" :label-position="'top'" label-width="100" v-if="newMarker.center && editing.type==='project'" class="range edit_form">
                        <mu-form-item prop="title" :rules="blankRules">
                            <mu-text-field prop="title" placeholder="プロジェクトのタイトル" v-model="newProject.title"/>
                        </mu-form-item>

                        <mu-flex justify-content="center" align-items="center" direction="row">
                            <mu-button color="info" class="smallbtn" @click="saveNewProject" v-if="newMarker.center"><mu-icon value="save" :size="20"></mu-icon>&nbsp;保存</mu-button>
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
    import MapView from './Map/MapViewLL';
    import MapUserItem from './Map/MapUserItem';
    import firebase from 'firebase'

    import M from '../class/map/EMarker';

    export default {
        name: 'mymapLL',
        mixins: [
            spotifyMixin,
            mapMixin,
            wsMixin
        ],
        components: {
            MapView,
            MapUserItem
        },

        data() {
            return {
                mainuser:null,
                socket: null,
                blankRules: [ruleEmpty],
                markersRef:null,
                projsRef:null,

                newMarker: {
                    center: null,
                    title: "",
                    desc:"",
                    type: 'other',
                    spotifyid: "",
                    project: "all",
                    public: 'open',
                    thumb:null,
                    w:35,
                    h:35
                },
                newProject:{
                    center:null,
                    zoom:22,
                    title:""
                },
                editing: {
                    status:false,
                    type:'marker'
                },
                mode: 'info'
            }
        },
        watch:{
          'mapstore.map':{
              handler(newMap){
                  if(this.mapstore.mainuser.id){
                      this.markersRef.child(this.mapstore.mainuser.id).once('value').then(res=>{
                          let mainuser = res.val();
                          mainuser = {...mainuser,center:newMap.center,id:this.mapstore.mainuser.id};
                          new M(mainuser).updateOrNew(this.markersRef);
                      });
                  }
              },deep:true
          }
        },
        computed: mapGetters(['spotify', 'mapstore', 'ws']),
        created() {
            this.markersRef = firebase.database().ref('markers');
            this.projsRef = firebase.database().ref('projects');
        },
        mounted() {
            this.socketInit();
            this.connectToSocket();
            this.switchLayer('info');

            //ユーザーのマーカー
            this.markersRef.orderByChild('userid').equalTo(this.spotify.me.id).on("value",ss=>{

                if(ss.val()){
                    //もしユーザーのマーカーがFirebaseに見つかった時、それを使う
                    let keys = Object.keys(ss.val());
                    this.a_mapstore(['set','mainuser',{id:keys[0]}]);
                }else{
                    //新規作成
                    new M({type:'mainuser'}).updateOrNew(this.markersRef);
                }
            });

            //FireBase
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
                'a_spotify',
                'a_mapstore',
                'a_ws']),


            onProjectSelected(key){

              this.a_mapstore(['emory','setproject',key]);

              let proj = this.mapstore.emory.projects[key];
              this.a_mapstore(['set','tracking',false]);
              this.$refs.emorymap.setView(proj.center,proj.zoom);
              setTimeout(()=> this.$refs.emorymap.setView(proj.center,proj.zoom),2000);
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
                }
            },

            mClick(val,id){
                if (this.editing.status){
                    this.switchLayer('edit');
                    this.newMarker = val;
                    if(id) this.newMarker.id =id;
                }else{
                    this.switchLayer('user');
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
                this.switchLayer('map');
            },

            netEnd(){
                this.switchLayer('info');
            },

            editEnd() {
                this.editing.status = false;
                this.switchLayer('info');
                this.newMarker = new M({}).marker;
                this.mode = "info";
                this.$refs.selectedPoint.style.top = -300+'px';
            },

            delMarker(){
                this.markersRef.child(this.newMarker.id).remove();
                this.cancelEditMode();
            },

            saveNewMarker() {
                this.$refs.newmarkerform.validate().then(valid => {
                    if (valid) {
                        if (!this.newMarker.center) { return; }
                        if(this.newMarker.id){
                            new M(this.newMarker).updateOrNew(this.markersRef);  // 編集モード
                        }else{
                            new M(this.newMarker).updateOrNew(this.markersRef);  // 新規作成モード
                        }
                        this.newMarker = new M({}).marker;                  // フォームの初期化
                        this.cancelEditMode();
                    }
                });
            },

            saveNewProject(){
                this.$refs.newprojectform.validate().then(valid => {
                    if (valid) {
                        if (!this.newMarker.center) { return; }
                        this.newProject.center = this.newMarker.center;
                        this.newProject.zoom = 20;
                        this.projsRef.push(this.newProject);
                        this.newProject.title = "";
                        this.cancelEditMode();
                    }
                });
            },

            switchLayer(mode) {
                let info_overlay = this.$refs.info_overlay;
                let area_overlay = this.$refs.area_overlay;
                let net_overlay = this.$refs.net_overlay;
                let edit_overlay = this.$refs.edit_overlay;
                this.mode = mode;

                switch (mode) {
                    case 'info':
                        info_overlay.style.zIndex = 401;
                        area_overlay.style.zIndex = -1;
                        net_overlay.style.zIndex = -1;
                        edit_overlay.style.zIndex = -1;
                        break;
                    case 'user':
                        info_overlay.style.zIndex = -1;
                        area_overlay.style.zIndex = 401;
                        net_overlay.style.zIndex = -1;
                        edit_overlay.style.zIndex = -1;
                        break;
                    case 'net':
                        info_overlay.style.zIndex = -1;
                        area_overlay.style.zIndex = -1;
                        net_overlay.style.zIndex = 401;
                        edit_overlay.style.zIndex = -1;
                        break;
                    case 'edit':
                        this.editing.status = true;
                        info_overlay.style.zIndex = -1;
                        area_overlay.style.zIndex = -1;
                        net_overlay.style.zIndex = -1;
                        edit_overlay.style.zIndex = 401;
                        break;
                    case 'map':
                        info_overlay.style.zIndex = -1;
                        area_overlay.style.zIndex = -1;
                        net_overlay.style.zIndex = -1;
                        edit_overlay.style.zIndex = -1;
                        break;
                }
            },

            overlayClick(val) {
                this.switchLayer('map');
            }
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
</style>
