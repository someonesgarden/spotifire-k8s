<template>

    <mu-flex class="mapflex" align-items="center">
        <mu-flex justify-content="center" class="controlarea">
            <div>
                <div class="ui">
                    <h4 class="title">emory.</h4>
                </div>
                <mu-form :model="mapform" ref="mapform" label-position="left" label-width="0" class="userform">
                    <div class="ui">
                        <div class="sixteen wide">
                            <mu-button full-width color="cyan400" @click="trackToggle" v-if="mapstore.tracking">
                                <mu-icon value="portable_wifi_off" :size="15"></mu-icon>
                                OFF
                            </mu-button>
                            <mu-button full-width color="pink500" @click="trackToggle" v-else>
                                <mu-icon value="settings_input_antenna" :size="15"></mu-icon>
                                ON
                            </mu-button>
                        </div>
                    </div>

                    <div class="ui">
                        <div class="sixteen wide">
                            <mu-button full-width color="indigo500" @click="connectToSocket" v-if="!ws.you.connected">
                                <mu-icon value="device_hub" :size="15"></mu-icon>
                                ON
                            </mu-button>
                            <mu-button full-width color="red500" @click="socketDisconnect" v-else>
                                <mu-icon value="settings_input_composite" :size="15"></mu-icon>
                                OFF
                            </mu-button>
                        </div>
                    </div>
                </mu-form>
                <mu-list class="users_list">
                    <map-user-item :user="user" v-for="(user,key,index) in ws.users" :key="'user'+key+index"
                                   @mapPanTo="mapPanTo"/>
                </mu-list>
            </div>
        </mu-flex>

        <mu-flex justify-content="center" class="maparea" fill>

            <map-view id="map" ref="emorymap" @switchLayer="switchLayer" @mapClick="mapClick"/>

            <!-- MENU -->
            <mu-flex justify-content="center" direction="column" align-items="center" class="info_overlay overlay"
                     ref="info_overlay">
                <mu-flex class="info_menu" justify-content="center" align-items="center">
                    <mu-flex class="info_box how" justify-content="center" align-items="center" direction="column" fill>
                        <img src="/static/img/emory/emory_logo_w.png" style="width:180px;height:auto;">
                    </mu-flex>
                </mu-flex>
                <mu-flex class="info_menu" justify-content="center" align-items="center">
                    <mu-flex class="info_box area" justify-content="center" align-items="center" direction="column" fill
                             @click="switchLayer('map')">
                        <mu-icon value="pets" :size="20"></mu-icon>
                        area.
                    </mu-flex>
                    <mu-flex class="info_box story" justify-content="center" align-items="center" direction="column"
                             fill>
                        <mu-icon value="book" :size="20"></mu-icon>
                        story.
                    </mu-flex>
                    <mu-flex class="info_box edit" justify-content="center" align-items="center" direction="column" fill
                             @click="switchLayer('edit')">
                        <mu-icon value="build" :size="20"></mu-icon>
                        edit.
                    </mu-flex>
                </mu-flex>
            </mu-flex>
            <!--/ MENU-->



            <!-- USER OVERLAY-->
            <div class="user_overlay overlay" ref="user_overlay" @click="overlayClick">
            </div>
            <!--/ USRE OVERLAY-->

            <!-- NET OVERLAY -->
            <div class="net_overlay overlay" ref="net_overlay" @click="overlayClick">
            </div>
            <!--/NET OVERLAY -->


            <!--EDIT OVERLAY-->
            <div class="edit_overlay overlay" ref="edit_overlay" @click="editOverlayClick">

                <mu-flex class="edit_info_box" justify-content="center" align-items="center" direction="column" style="height:100%;">

                    <h1>
                        <mu-icon value="build" :size="20"></mu-icon>
                        edit.
                    </h1>
                    <h2 v-if="!newMarker">地図上をクリックすると座標が選択されます。</h2>
                    <h2 v-else>このポイントを保存する場合は「保存」を押してください。</h2>

                    <mu-form :model="newMarker" ref="newmarkerform" :label-position="'top'" label-width="100" v-if="newMarker.center" class="range edit_form">
                        <img src="/static/img/covers/p3.jpg">

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
                            <mu-button color="info"     class="smallbtn" @click="saveNewMarker" v-if="newMarker.center">保存</mu-button>
                            <mu-button color="warning"  class="smallbtn" @click="cancelNewMarker" v-if="newMarker.center">キャンセル</mu-button>
                            <mu-button color="primary"  class="smallbtn" @click="editEnd">終了</mu-button>
                        </mu-flex>
                    </mu-form>
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
                database: null,
                markersRef:null,
                newMarker: {
                    center: null,
                    title: "",
                    desc:"",
                    type: 'other',
                    spotifyid: "",
                    project: "",
                    public: 'open',
                    thumb:null
                },
                editing: false,
                mode: 'info',
                socket: null,
                blankRules: [ruleEmpty],
                mapform: {
                    username: ''
                }
            }
        },
        computed: mapGetters(['spotify', 'mapstore', 'ws']),

        created() {
            this.database = firebase.database();
            this.markersRef = this.database.ref('markers');
            this.markersRef.on('value', (snapshot)=>{
                console.log(snapshot)
                console.log(snapshot.val())
            });

        },
        mounted() {
            this.filter = this.spotify.filter;
            this.socketInit();
            this.connectToSocket();
            // this.a_mapstore(['set','tracking',true]);

            this.switchLayer('info');
        },

        beforeDestroy() {
            this.socketDisconnect();
            this.a_mapstore(['set', 'tracking', false]);
        },

        watch: {},

        methods: {
            ...mapActions([
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
                this.newMarker.center = null;
                this.editOverlayClick();
            },

            saveNewMarker() {

                this.$refs.newmarkerform.validate().then(valid => {
                    if (valid) {
                        if (!this.newMarker.center) { return; }
                        this.markersRef.push(this.newMarker);
                        this.newMarker.center = null;
                    }
                });
            },

            editEnd() {
                console.log("editend");
                this.newMarker.center = null;
                this.editing = false;
                this.mode = "info";
                this.switchLayer('info');
                this.$refs.selectedPoint.style.top = -300+'px';
            },

            switchLayer(mode) {
                console.log("switchLayer", mode);
                let info_overlay = this.$refs.info_overlay;
                let user_overlay = this.$refs.user_overlay;
                let net_overlay = this.$refs.net_overlay;
                let edit_overlay = this.$refs.edit_overlay;
                this.mode = mode;

                switch (mode) {
                    case 'info':
                        info_overlay.style.zIndex = 401;
                        user_overlay.style.zIndex = -1;
                        net_overlay.style.zIndex = -1;
                        edit_overlay.style.zIndex = -1;
                        break;
                    case 'user':
                        info_overlay.style.zIndex = -1;
                        user_overlay.style.zIndex = 401;
                        net_overlay.style.zIndex = -1;
                        edit_overlay.style.zIndex = -1;
                        break;
                    case 'net':
                        info_overlay.style.zIndex = -1;
                        user_overlay.style.zIndex = -1;
                        net_overlay.style.zIndex = 401;
                        edit_overlay.style.zIndex = -1;
                        break;
                    case 'edit':
                        this.editing = true;
                        info_overlay.style.zIndex = -1;
                        user_overlay.style.zIndex = -1;
                        net_overlay.style.zIndex = -1;
                        edit_overlay.style.zIndex = 401;
                        break;
                    case 'map':
                        info_overlay.style.zIndex = -1;
                        user_overlay.style.zIndex = -1;
                        net_overlay.style.zIndex = -1;
                        edit_overlay.style.zIndex = -1;
                        break;
                }
            },

            editOverlayClick(val) {
                if (this.editing && !this.newMarker.center) this.switchLayer('map');
            },

            overlayClick(val) {
                console.log("overlay from");
                console.log(val);
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
