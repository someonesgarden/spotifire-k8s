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
            <map-view id="map" ref="mapref"></map-view>
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
        },

        beforeDestroy(){
            this.socketDisconnect();
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

                this.$refs.mapref.mapPanTo(lat,lng);
            },

            connectToSocket() {

                if (this.spotify.me){
                    let your_pos_and_data = {
                        name:       this.spotify.me.id,
                        lat:        this.$refs.mapref.lat,
                        lng:        this.$refs.mapref.lng,
                        pid:        this.spotify.playlist ? this.spotify.playlist.id : null,
                        tid:        this.spotify.track ? this.spotify.track.id : null
                    };

                    this.socketConnect(your_pos_and_data);
                }

            }
        }
    }
</script>


<style lang="scss">
</style>
