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
                                <mu-icon value="portable_wifi_off" :size="15"></mu-icon>OFF
                            </mu-button>
                            <mu-button full-width color="pink500" @click="trackToggle" v-else>
                                <mu-icon value="settings_input_antenna" :size="15"></mu-icon>ON
                            </mu-button>
                        </div>
                    </div>

                    <div class="ui">
                        <div class="sixteen wide">
                            <mu-button full-width color="indigo500" @click="connectToSocket" v-if="!ws.you.connected">
                                <mu-icon value="device_hub" :size="15"></mu-icon>ON
                            </mu-button>
                            <mu-button full-width color="red500" @click="socketDisconnect" v-else>
                                <mu-icon value="settings_input_composite" :size="15"></mu-icon>OFF
                            </mu-button>
                        </div>
                    </div>
                </mu-form>
                <mu-list class="users_list">
                    <map-user-item :user="user" v-for="(user,key,index) in ws.users" :key="'user'+key+index" @mapPanTo="mapPanTo"/>
                </mu-list>
            </div>
        </mu-flex>

        <mu-flex justify-content="center" class="maparea" fill>
            <map-view id="map" ref="emorymap" @switchLayer="switchLayer"></map-view>

            <mu-flex justify-content="center" direction="column" align-items="center" class="info_overlay overlay" ref="info_overlay" @click="overlayClick">

                <mu-flex class="info_menu"  justify-content="center" align-items="center">
                    <mu-flex class="info_box" justify-content="center" align-items="center" fill>ABOUT</mu-flex>
                </mu-flex>

                <mu-flex  class="info_menu" justify-content="center" align-items="center">
                    <mu-flex class="info_box" justify-content="center" align-items="center" fill>AREA</mu-flex>
                    <mu-flex class="info_box" justify-content="center" align-items="center" fill>STORY</mu-flex>
                    <mu-flex class="info_box" justify-content="center" align-items="center" fill>POINTS</mu-flex>
                </mu-flex>

            </mu-flex>

            <div class="user_overlay overlay" ref="user_overlay" @click="overlayClick">

            </div>
            <div class="net_overlay overlay"  ref="net_overlay" @click="overlayClick">

            </div>
        </mu-flex>


    </mu-flex>

</template>
<script>

    import {mapGetters,mapActions} from 'vuex';
    import spotifyMixin from '../mixins/spotify/index';
    import mapMixin from '../mixins/map/index';
    import wsMixin from '../mixins/ws/index';
    import {ruleEmpty} from '../store/rules';

    import MapView from './Map/MapView';
    import MapUserItem from './Map/MapUserItem';
    export default {
        name: 'mymap',
        mixins:[
            spotifyMixin,
            mapMixin,
            wsMixin
        ],
        components:{
            MapView,
            MapUserItem
        },

        data(){
          return{
              socket:null,
              blankRules: [ruleEmpty],
                mapform:{
                    username:''
                }
          }
        },
        computed:mapGetters(['spotify','mapstore','ws']),

        mounted(){
            this.filter = this.spotify.filter;
            this.socketInit();
            this.connectToSocket();
            // this.a_mapstore(['set','tracking',true]);
        },

        beforeDestroy(){
            this.socketDisconnect();
            this.a_mapstore(['set','tracking',false]);
        },

        watch:{

        },

        methods: {
            ...mapActions([
                'a_spotify',
                'a_mapstore',
                'a_ws']),

            mapPanTo(lat,lng){
                console.log("setMapCenter",lat,lng);

                this.$refs.emorymap.mapPanTo(lat,lng);
            },

            connectToSocket() {

                if (this.spotify.me && this.spotify.me.id){
                    let your_pos_and_data = {
                        name:       this.spotify.me.id,
                        lat:        this.$refs.emorymap.lat,
                        lng:        this.$refs.emorymap.lng,
                        pid:        this.spotify.playlist ? this.spotify.playlist.id : null,
                        tid:        this.spotify.track ? this.spotify.track.id : null
                    };
                    this.socketConnect(your_pos_and_data);
                }

            },

            switchLayer(mode){

                let info_overlay = this.$refs.info_overlay;
                let user_overlay = this.$refs.user_overlay;
                let net_overlay = this.$refs.net_overlay;

              switch(mode){
                  case 'info':
                      info_overlay.style.zIndex = 10;
                      user_overlay.style.zIndex = -1;
                      net_overlay.style.zIndex = -1;
                      break;
                  case 'user':
                      info_overlay.style.zIndex = -1;
                      user_overlay.style.zIndex = 10;
                      net_overlay.style.zIndex = -1;
                      break;
                  case 'net':
                      info_overlay.style.zIndex = -1;
                      user_overlay.style.zIndex = -1;
                      net_overlay.style.zIndex = 10;
                      break;
                  case 'map':
                      info_overlay.style.zIndex = -1;
                      user_overlay.style.zIndex = -1;
                      net_overlay.style.zIndex = -1;
                      break;
              }
            },

            overlayClick(){
                this.switchLayer('map');
            }
        }
    }
</script>


<style lang="scss">

    .overlay{
        position:absolute;
        width:calc(100%);
        height:calc(100%);
        /*mix-blend-mode: hard-light;*/
        margin:0;
        left:0;
        top:0;

        &.info_overlay{
            z-index:3;
            /*background-color:rgba(20,20,20,0.80);*/
            background-color: rgba(41,119,132,0.75);
            mix-blend-mode: hard-light;

            .info_menu{
                margin:10px;
                background-color: rgba(255, 17, 110, 0.39);
                min-width:300px;
            }
            .info_box{
                margin:10px;
                min-height:80px;

                font-size:1.8rem;
                font-weight:bold;
                color:#fff;
                border-bottom:thin solid #fff;
                background-color: rgba(255, 31, 73, 0.96);

            }
        }

        &.user_overlay{
            z-index:-1;
            /*background-color:rgba(20,20,20,0.80);*/
            background-color: rgba(5, 189, 108, 0.59);
        }

        &.net_overlay{
            z-index:-1;
            /*background-color:rgba(20,20,20,0.80);*/
            background-color: rgba(147, 50, 212, 0.6);
        }

    }


</style>
