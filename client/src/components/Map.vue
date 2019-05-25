<template>
    <mu-container class="reset">
        <mu-row gutter>
            <mu-col span="4" sm="3" md="3" lg="2" class="controlarea">

                    <div class="ui">
                        <div class="sixteen wide">
                            <h4 class="title">emory.</h4>
                        </div>
                    </div>

                    <mu-form :model="mapform" ref="mapform" label-position="left" label-width="50">

                        <div class="ui">
                            <div class="sixteen wide">
                                <mu-button full-width color="pink500" @click="trackToggle" v-if="!mapstore.tracking" >
                                    <mu-icon value="settings_input_antenna" style="width:20px;"></mu-icon>&nbsp;Start
                                </mu-button>
                                <mu-button full-width color="cyan400" @click="trackToggle" v-else>
                                    <mu-icon value="portable_wifi_off" style="width:20px;"></mu-icon>&nbsp;Stop
                                </mu-button>
                            </div>
                        </div>

                        <div class="ui">
                            <div class="sixteen wide">
                                <mu-button full-width color="indigo500">
                                    <mu-icon value="room" style="width:20px;"></mu-icon>&nbsp;Add
                                </mu-button>
                            </div>
                        </div>
                        <mu-divider></mu-divider>
                    </mu-form>

            </mu-col>
            <mu-col span="8" sm="9" md="9" lg="10" class="maparea">

                <div class="grid-cell">
                    <map-view id="map"></map-view>
                </div>
            </mu-col>
        </mu-row>
    </mu-container>
</template>
<script>


    import io from 'socket.io-client'
    import {mapGetters,mapActions} from 'vuex';
    import MapView from './Map/MapView';
    import spotifyMixin from '../mixins/spotify/index';
    import mapMixin from '../mixins/map/index';
    export default {
        name: 'myfilters',
        mixins:[spotifyMixin,mapMixin],
        components:{
            MapView
        },
        data(){
          return{
                mapform:{
                    text1:""
                }
          }
        },
        computed:mapGetters(['spotify','mapstore']),
        mounted(){
            this.filter = this.spotify.filter;

            this.socket = io({path: '/ws/socket.io'});

            let message = {
                user: "sdfsdf",
                date: new Date(),
                text: "sdfsdfsfsd",
            }
            this.socket.emit('to-server', message);

            this.socket.on('from-server',(msg)=>{
                console.log(msg);
                alert(JSON.stringify(msg));
            });
        },

        beforeDestroy(){

        },


        methods:{
            ...mapActions(['a_spotify','a_mapstore']),
        },
        watch:{
            'spotify.credential':{
                handler(){
                    if(!!this.spotify.credential.expires_in) this.c_getMe();
                },
                deep:true
            }
        }
    }
</script>


<style lang="scss">
    #map {
        height:calc(100%);
        width:100%;
        margin:0;
        padding:0;

        /*@media only screen and (min-width: 768px) {*/
        /*    margin-top:64px;*/
        /*    width: 100vw;*/
        /*    height: calc(80vh - 64px) !important;*/
        /*}*/
    }

    .container.reset{
        width:100%;
        background-color:rgba(12,23,22,0.4);
        max-width:inherit;
        padding:0;
        margin: 54px 0 0 0;

        h4.title{
            font-family: 'Allerta Stencil' !important;
            font-weight:bold;
            padding-top:35px;
            padding-bottom:35px;
            color:white;
        }

        .col{
            &.controlarea{
                padding-right:0;
                text-align:center;
                background-color: #18212e;
            }

            &.maparea{
                padding-left:0;
                width:100%;
                height:100%;
            }

            .grid-cell{
                background-color:rgba(34,12,111,0.3);
                height:calc(100vh - 54px);
            }
        }
    }
</style>
