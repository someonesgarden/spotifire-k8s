<template>

    <mu-flex class="mapflex" align-items="center">

        <mu-flex justify-content="center" class="maparea" fill>

            <map-view id="map" ref="emorymap" @switchLayer="switchLayer" @mapClick="mapClick" @mClick="mClick" @pClick="pClick"/>

            <!-- MENU -->
            <mu-flex justify-content="center" direction="column" align-items="center" class="info_overlay overlay"
                     ref="info_overlay">
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
                    <mu-flex class="info_box area" justify-content="center" align-items="center" direction="column" fill @click="switchLayer('map')">
                        <mu-icon value="pets" :size="20"></mu-icon>area.
                    </mu-flex>
                    <mu-flex class="info_box story" justify-content="center" align-items="center" direction="column" fill @click="switchLayer('net')">
                        <mu-icon value="network_check" :size="20"></mu-icon>socket.
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
                        <map-user-item :user="user" v-for="(user,key,index) in ws.users" :key="'user'+key+index" @mapPanTo="mapPanTo"/>
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
                    </h1>
                    <h2 v-if="!newMarker.center">地図上をクリックすると座標が選択されます。</h2>
                    <h2 v-else>このポイントを保存する場合は「保存」を押してください。</h2>


                    <mu-form :model="newMarker" ref="newmarkerform" :label-position="'top'" label-width="100" v-if="newMarker.center" class="range edit_form">
                        <img :src="newMarker.thumb" v-if="newMarker.thumb">
                        <mu-form-item prop="title" :rules="blankRules">
                            <mu-text-field prop="title" placeholder="タイトル" v-model="newMarker.title"/>
                        </mu-form-item>
                        <mu-form-item prop="desc" :rules="blankRules">
                            <mu-text-field prop="desc" placeholder="20文字メモ" v-model="newMarker.desc"/>
                        </mu-form-item>
                        <mu-form-item prop="spotifyid" :rules="blankRules">
                            <mu-text-field prop="spotifyid" placeholder="Spotify ID" v-model="newMarker.spotifyid"/>
                        </mu-form-item>
                        <mu-form-item prop="type">
                            <mu-select prop="type" color="primary" v-model="newMarker.type">
                                <mu-option  label="スポット" value="spot"></mu-option>
                                <mu-option  label="ユーザー" value="user"></mu-option>
                                <mu-option  label="その他" value="other"></mu-option>
                            </mu-select>
                        </mu-form-item>
                        <mu-form-item prop="project" label="プロジェクトを選択">
                            <mu-select  prop="project" v-model="newMarker.project">
                                <mu-option  label="全て" value="all"></mu-option>
                                <mu-option  label="箱根001" value="hakone001"></mu-option>
                                <mu-option  label="東京001" value="tokyo001"></mu-option>
                            </mu-select>
                        </mu-form-item>

                        <mu-form-item prop="radio" label="公開">
                            <mu-radio v-model="newMarker.public" value="open" label="公開"></mu-radio>
                            <mu-radio v-model="newMarker.public" value="close" label="非公開"></mu-radio>
                        </mu-form-item>

                        <mu-flex justify-content="center" align-items="center" direction="row">
                            <mu-button color="red"      class="smallbtn" @click="delMarker" v-if="newMarker.id"><mu-icon value="delete_forever" :size="20"></mu-icon></mu-button>
                            <mu-button color="info"     class="smallbtn" @click="saveNewMarker"     v-if="newMarker.center">保存</mu-button>
                            <mu-button color="warning"  class="smallbtn" @click="cancelNewMarker"   v-if="newMarker.center">キャンセル</mu-button>
                            <mu-button color="primary"  class="smallbtn" @click="editEnd">終了</mu-button>
                        </mu-flex>
                    </mu-form>

                    <mu-flex justify-content="center" align-items="center" direction="row" v-else>
                        <mu-button color="warning"  class="smallbtn" @click="cancelNewMarker">編集・新規作成へ</mu-button>
                        <mu-button color="primary"  class="smallbtn" @click="editEnd">終了</mu-button>
                    </mu-flex>

                    <div ref="selectedPoint" class="selectedPoint"></div>
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
                mapform: {
                    username: ''
                },
                socket: null,
                blankRules: [ruleEmpty],
                database: null,
                markersRef:null,
                newMarker0:{
                    center: null,
                    title: "",
                    desc:"",
                    type: 'other',
                    spotifyid: "",
                    project: "",
                    public: 'open',
                    thumb:null,
                    w:35,
                    h:35
                },
                newMarker: {
                    center: null,
                    title: "",
                    desc:"",
                    type: 'other',
                    spotifyid: "",
                    project: "",
                    public: 'open',
                    thumb:null,
                    w:35,
                    h:35
                },
                editing: false,
                mode: 'info'
            }
        },
        computed: mapGetters(['spotify', 'mapstore', 'ws']),

        created() {
            this.database = firebase.database();
            this.markersRef = this.database.ref('markers');

        },
        mounted() {
            this.markersRef.on('value', (snapshot)=> {
                this.a_mapstore(['set','markers',snapshot.val()])
            });

            this.filter = this.spotify.filter;
            this.socketInit();
            this.connectToSocket();
            // this.a_mapstore(['set','tracking',true]);
            this.switchLayer('info');
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

            mapClick(val) {
                if (this.editing) {
                    this.addNewMarker(val.latlng,val.containerPoint);
                    this.switchLayer('edit');
                } else {
                    this.switchLayer('info');
                }
            },

            mClick(val,id){
                if (this.editing){
                    this.switchLayer('edit');
                    this.newMarker = val;
                    if(id) this.newMarker.id =id;
                }
            },

            pClick(val,id){
                if(this.editing){
                    this.switchLayer('edit');
                    this.newMarker = val;
                    if(id) this.newMarker.id =id;
                }else{
                    this.switchLayer('user');
                }
            },

            mapPanTo(lat, lng) {
                this.$refs.emorymap.mapPanTo(lat, lng);
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

            addNewMarker(latlng,mouseXY) {
                this.newMarker.center = latlng;
                this.$refs.selectedPoint.style.top = mouseXY.y-10+'px';
                this.$refs.selectedPoint.style.left = mouseXY.x-10+'px';
            },

            cancelNewMarker() {
                this.newMarker = this.newMarker0;
                this.resetNewMarker();
                this.switchLayer('map');
            },

            netEnd(){
                this.switchLayer('info');
            },


            editEnd() {
                this.editing = false;
                this.switchLayer('info');
                this.newMarker = this.newMarker0;
                this.resetNewMarker();
                this.mode = "info";
                this.$refs.selectedPoint.style.top = -300+'px';
            },

            delMarker(){
                this.markersRef.child(this.newMarker.id).remove();
                this.cancelNewMarker();
            },

            resetNewMarker(){
                this.newMarker = this.newMarker0;
                this.newMarker.center = null;
                this.newMarker.thumb = null;
                this.newMarker.spotifyid = "";
                this.newMarker.title ="";
                this.newMarker.desc = "";
            },

            saveNewMarker() {
                this.$refs.newmarkerform.validate().then(valid => {
                    if (valid) {
                        if (!this.newMarker.center) { return; }

                        if(this.newMarker.id){
                            console.log("idがあるので編集モード");
                            let updates = {};
                            updates[this.newMarker.id] = this.newMarker;
                            this.markersRef.update(updates);
                            this.resetNewMarker();

                        }else{

                            this.c_anyid(this.newMarker.spotifyid, (res)=>{
                                console.log("c_anyid");
                                console.log(res);

                                if(res.data===""){
                                    console.log("IDが違う");
                                    this.a_index(['alert','set','IDが間違えています。入力し直してください。']);
                                    this.a_index(['alert','open']);
                                }else{
                                    if(res.data.body.type==='track'){
                                        this.newMarker.thumb = res.data.body.album.images[0].url;
                                        this.newMarker.spotifytype = 'track';
                                        this.newMarker.desc = res.data.body.name;
                                    }

                                    let icons = this.mapstore.icons[this.newMarker.type];
                                    this.newMarker.icon = icons[this.newMarker.title.charCodeAt(0) % icons.length];

                                    this.markersRef.push(this.newMarker);
                                    this.resetNewMarker();

                                }

                            });

                        }




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
                        this.editing = true;
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
        background-color:red;
    }

</style>
