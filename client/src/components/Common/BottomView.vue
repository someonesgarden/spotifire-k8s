<template>
    <mu-flex justify-content="center" align-items="center">
        <mu-flex justify-content="center"  direction="column" class="inner">

            <mu-flex justify-content="center" class="param_area">
                <bottom-slider></bottom-slider>
            </mu-flex>

            <mu-flex v-if="spotify.devices" style="width:100%;">
                <mu-select :value="spotify.device" full-width class="devices_list" icon="speaker" @change="deviceSelected">
                    <mu-option v-for="(device,index) in spotify.devices" :key="'device'+index" :label="device.name" :value="device.id"></mu-option>
                </mu-select>
            </mu-flex>

            <mu-flex  justify-content="center" align-items="center" style="width:100%;min-height:48px;overflow-x:scroll !important;" v-if="mapstore.mainuser && mapstore.markerDists && $route.name ==='Map'">

                   <div v-for="(mkr,inx) in mapstore.markerDists" @click="bottomAvatarClick(mkr)" class="bottom_avatar" v-if="mkr.dist<0.05">
                       <my-avatar :id="mkr.id" :dist="mkr.dist" :key="'md'+inx"/>
                   </div>

            </mu-flex>

            <!-- TRACK PLAYER -->
            <mu-flex justify-content="center" class="player_area" v-if="!!spotify.player.track">
                <mu-chip class="demo-chip" color="black">
                    <mu-avatar :size="32" v-if="spotify.player.track.album.images">
                        <img :src="spotify.player.track.album.images[0].url">
                    </mu-avatar>
                    <span class="status">{{spotify.player.playing ? "now playing" : "stopped"}}</span>
                    <div>
                        <span class="artist" @click="clickAction('artist',spotify.player.track.artists[0].id)"><mu-icon value="mic"></mu-icon>{{spotify.player.track.artists[0].name}}</span>
                        <span class="track" @click="clickAction('track',spotify.player.track.id)"><mu-icon value="music_note"></mu-icon>{{spotify.player.track.name}}</span>
                        <span class="album" @click="clickAction('album',spotify.player.track.album.id)"><mu-icon value="album"></mu-icon>{{spotify.player.track.album.name}}</span>
                    </div>

                    <mu-icon value="pause_circle_outline" v-if="spotify.player.playing" @click="a_spotify(['player','stop',null])"></mu-icon>
                    <mu-icon value="play_circle_outline" v-else @click="a_spotify(['player','play',{id:spotify.player.track.id,type:'track'}])"></mu-icon>

                    <mu-icon value="equalizer" @click="Analyse(spotify.player.track.id)"></mu-icon>
                </mu-chip>
            </mu-flex>
            <!-- / TRACK PLAYER-->
        </mu-flex>
    </mu-flex>
</template>

<script>
    import spotifyMixin from '../../mixins/spotify/index';
    import mapMixin from '../../mixins/map/index';
    import {mapGetters,mapActions} from 'vuex';
    import BottomSlider from './BottomSlider';
    import MyAvatar from '../Map/MyAvatar';
    import AudioPlayer from '../Mp3/AudioPlayer';
    export default {
        name: "BottomView",
        mixins: [spotifyMixin, mapMixin],
        components: {
            BottomSlider,
            MyAvatar,
            AudioPlayer
        },

        computed: mapGetters(['spotify','mapstore','mp3']),



        mounted(){
            // this.a_mp3(['pod',0,'playing', false]);
            // this.a_mp3(['pod',1,'playing', false]);
            // this.a_mp3(['pod',2,'playing', false]);
        },
        methods:{
            ...mapActions(['a_spotify','a_mp3']),

            mp3Action(val){
                //mp3プレイヤーからのアクション
              console.log("mp3Action");
              console.log(val);
            },

            deviceSelected(val){
                this.c_transferplayback(val,(res)=>{  })
            },

            Analyse(trackid){
                if(!!this.spotify.analysing_track && this.spotify.analysing_track===trackid){
                    this.$router.push('/analysis');
                }else{
                    this.c_audioAnalyse(trackid);
                    this.a_spotify(['set','analysingTrack',trackid]);
                }
            },
            clickAction(type,val){
                this.a_spotify(['set',type+'ID', val]);
                this.a_spotify(['update','item',type]);
            },

            bottomAvatarClick(mkr){
                this.a_mapstore(['set','tracking',false]);
                let marker = this.mapstore.markers[mkr.id];
                if(marker) this.a_mapstore(['center','map',this.mapstore.markers[mkr.id].center]);
            }
        }
    }
</script>

<style scoped lang="scss">
    .mp3_players{
        width:100%;
        text-align:center;
        margin:12px auto;
        background-color: rgba(210, 222, 217, 0.3);
        padding:4px 0 2px 0;
    }
</style>
