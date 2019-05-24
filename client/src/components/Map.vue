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
                                <mu-button full-width color="indigo400" @click="moveToMe">
                                    <mu-icon value="accessibility_new"></mu-icon>IM
                                </mu-button>
                            </div>
                        </div>

                        <div class="ui">
                            <div class="sixteen wide">
                                <mu-button full-width color="red500" @click="trackStart">
                                    <mu-icon value="settings_input_antenna"></mu-icon>Start
                                </mu-button>
                            </div>

                            <div class="sixteen wide">
                                <mu-button full-width color="cyan400" @click="trackStop">
                                    <mu-icon value="portable_wifi_off"></mu-icon>Stop
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
    import {mapGetters,mapActions} from 'vuex';
    import MapView from './Map/MapView';
    import spotifyMixin from '../mixins/spotify/index';
    export default {
        name: 'myfilters',
        mixins:[spotifyMixin],
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
        methods:{
            ...mapActions(['a_spotify','a_mapstore']),

            moveToMe(){
                console.log("moveToMe");
            },

            trackStart(){
                console.log("trackStart");
            },

            trackStop(){
                console.log("trackStop");
            }
        },
        computed:mapGetters(['spotify','mapstore']),

        mounted(){
            this.filter = this.spotify.filter;
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
                background-color:orange;
            }

            .grid-cell{
                background-color:rgba(34,12,111,0.3);
                height:calc(100vh - 54px);
            }
        }
    }

</style>
