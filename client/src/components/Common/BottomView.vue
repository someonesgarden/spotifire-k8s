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
                    <mu-icon value="play_circle_outline" v-else @click="a_spotify(['player','play',spotify.player.track.id])"></mu-icon>

                    <mu-icon value="equalizer" @click="Analyse(spotify.player.track.id)"></mu-icon>

                </mu-chip>
            </mu-flex>

        </mu-flex>
    </mu-flex>
</template>

<script>
    import spotifyMixsin from '../../mixins/spotify/index';
    import {mapGetters,mapActions} from 'vuex';
    import BottomSlider from './BottomSlider';
    export default {
        name: "BottomView",
        mixins:[spotifyMixsin],
        components:{
          BottomSlider
        },
        computed:mapGetters(['spotify']),
        methods:{
            ...mapActions(['a_spotify']),

            deviceSelected(val){

                console.log("deviceselected");
                console.log(val);

                this.c_transferplayback(val,(res)=>{
                    console.log("c_transferplayback");
                    console.log(res);
                })
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
            }
        }
    }
</script>

<style scoped lang="scss">



</style>
