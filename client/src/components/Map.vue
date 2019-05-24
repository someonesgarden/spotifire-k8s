<template>
    <mu-container class="reset">
        <mu-row gutter>
            <mu-col span="3" class="controlarea">
                <div class="grid-cell">

                    <mu-container>
                        <mu-row gutter>
                            <mu-col span="12">
                               <h2 class="title">emory.</h2>
                            </mu-col>
                        </mu-row>


                        <mu-form :model="mapform" ref="mapform" label-position="left" label-width="50">
                            <mu-row gutter>
                                <mu-col span="1" sm="1" md="1" lg="1" xl="1">
<!--                                    <mu-radio v-model="id_or_term" value="id"></mu-radio>-->
                                </mu-col>

                                <mu-col span="7" sm="8" md="8" lg="8" xl="8">
                                    <mu-form-item prop="textarea" label="any ID" class="range">
                                        <mu-text-field v-model="mapform.text1"></mu-text-field>
                                    </mu-form-item>
                                </mu-col>

                            </mu-row>


                            <mu-row gutter class="range">
                                <mu-col span="12" sm="12" md="12" lg="12">
                                    <mu-button full-width color="indigo400">
                                        <mu-icon value="low_priority"></mu-icon>
                                    </mu-button>
                                </mu-col>

                            </mu-row>
                            <mu-divider></mu-divider>
                        </mu-form>
                    </mu-container>


                </div>
            </mu-col>
            <mu-col span="9" class="maparea">

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
        methods:mapActions(['a_spotify','a_mapstore']),
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
        margin: 64px 0 0 0;

        h2.title{
            padding-top:20px;
            color:white;

        }

        .col{

            &.controlarea{
                padding-right:0;
                text-align:center;
            }

            &.maparea{
                padding-left:0;
            }

            .grid-cell{
                background-color:rgba(34,12,111,0.3);
                height:calc(100vh - 64px);
            }
        }

    }

</style>
