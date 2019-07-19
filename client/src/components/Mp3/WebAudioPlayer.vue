<template>
    <div class="player">
        <div class="square" :style="{height:Math.floor(volume)+'px', visibility:playing ? 'visible' : 'hidden'}"></div>
        <div class="player-controls">
            <div>
                <a  v-if="playing" @click.prevent="stopClick" title="Play/Pause" href="#">
                    <svg width="16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path fill="currentColor" d="M15,3h-2c-0.553,0-1,0.048-1,0.6v12.8c0,0.552,0.447,0.6,1,0.6h2c0.553,0,1-0.048,1-0.6V3.6C16,3.048,15.553,3,15,3z M7,3H5C4.447,3,4,3.048,4,3.6v12.8C4,16.952,4.447,17,5,17h2c0.553,0,1-0.048,1-0.6V3.6C8,3.048,7.553,3,7,3z"/>
                    </svg>
                </a>
                <a v-else @click.prevent="playClick" title="Play/Pause" href="#">
                    <svg width="16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path fill="currentColor" d="M15,10.001c0,0.299-0.305,0.514-0.305,0.514l-8.561,5.303C5.51,16.227,5,15.924,5,15.149V4.852c0-0.777,0.51-1.078,1.135-0.67l8.561,5.305C14.695,9.487,15,9.702,15,10.001z"/>
                    </svg>
                </a>
            </div>
            <div>
                <div class="player-progress" title="Time played : Total time">
                    <div :style="{ width: this.percentComplete + '%' }" class="player-seeker"></div>
                </div>
                <div class="player-time">
                    <div class="player-time-current">{{ currentTime }}</div>
                    <div class="player-time-total">{{ durationTime }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    const convertTimeHHMMSS = (val) => {
        let hhmmss = new Date(val * 1000).toISOString().substr(11, 8);
        return hhmmss.indexOf("00:") === 0 ? hhmmss.substr(3) : hhmmss;
    };

    import WebAudioPlayer from '../../class/audio/WebAudio';
    export default {
        name: "WebAudioPlayer",

        props:['id'],

        data:()=>({
        loop:            true,
        playing:         false,
        loaded:          false,
        showVolume:      true,
        interval:        null,
        player:          null,
        volume:          0,
        vol_interval:    null,
        file:            '',
        currentSeconds:  0,
        durationSeconds: 0,
        loop_gap:        2000
        }),

        computed: {
            currentTime() {
                return convertTimeHHMMSS(this.currentSeconds);
            },
            durationTime() {
                return convertTimeHHMMSS(this.durationSeconds);
            },
            percentComplete() {
                return parseInt(this.currentSeconds / this.durationSeconds * 100);
            }
        },

        mounted() {
            this.player = new WebAudioPlayer();
            this.file = "https://someonesgarden.org/emory/drum1.mp3";
            this.vol_interval = setInterval(()=> this.volume = this.player.gainNode.gain.value*100, 200);

            this.player.loadSound(this.file, buffer => {
                this.loaded = true;
                this.durationSeconds = parseInt(buffer.duration);
                this.player.source.onended = () => this.ended();
            });
        },

        beforeDestroy(){
            this.timerOFF();
            this.player = null;
            if(this.vol_interval) clearInterval(this.vol_interval);
            this.vol_interval = null;
        },

        methods:{
            setVolume(val,duration=null){
                this.player.volume = val;
                if(duration){
                    this.player.volFadeTo(val,duration); //duration=1
                }else{
                    this.player.volTo(val); //フェードなし
                }
            },

            toggle(val) {
                if(val){
                    this.play();
                } else{
                    this.stop();
                }
            },

            setParams(file,volume,playing){
                console.log("WebAudioPlayer",file,volume,playing);
                this.setVolume(volume);

                this.file = file;
                if(this.file!==this.player.file){
                    console.log("change!");
                    this.player.halt();
                    this.loaded = false;
                }

                this.toggle(playing);
            },

            playClick(){
              this.play();
            },

            stopClick(){
              this.stop();
            },

            play(){
                if(this.btnTimeout) clearTimeout(this.btnTimeout);

                if(this.loaded){
                    this.playing = true;
                    this.player.fadeStart(this.volume);
                    this.timerON();
                }
                else{
                    this.playing = true;
                    this.player.loadSound(this.file, buffer => {
                        this.loaded  = true;
                        this.durationSeconds = parseInt(buffer.duration);
                        this.player.source.onended = () => this.ended();
                        this.player.fadeStart(this.volume);
                        this.timerON();
                    });
                }
            },

            stop(){
                this.player.fadeStop();
                if(this.btnTimeout) clearTimeout(this.btnTimeout);
                this.btnTimeout = setTimeout(()=>{
                    this.playing = false;
                    this.timerOFF();
                },1000)

            },

            ended(){
                this.loaded         = false;
                this.player.playing = false;
                this.volume         = 0;
                this.timerOFF();
                if(this.end_timeout) clearTimeout(this.end_timeout);
                this.end_timeout = setTimeout(()=>{
                    this.volume         = 0;
                    this.currentSeconds = 0;
                    if (this.loop && this.playing) this.play();
                },this.loop_gap);
            },

            timerON(){
                if(!this.interval) this.interval = setInterval(()=> {
                    if(this.currentSeconds<this.durationSeconds) this.currentSeconds++;
                },1000);
            },

            timerOFF(){
                this.currentSeconds = 0;
                if(this.interval) clearInterval(this.interval);
                this.interval = null;
            }
        }
    }
</script>

<style scoped lang="scss">
    body {
        /*font-family: 'Nunito', sans-serif;*/
        -moz-osx-font-smoothing: grayscale;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
    }

    $player-bg: #fff;
    $player-border-color: darken($player-bg, 12%);
    $player-link-color: darken($player-bg, 75%);
    $player-progress-color: $player-border-color;
    $player-seeker-color: $player-link-color;
    $player-text-color: $player-link-color;


    .player {
        background-color: $player-bg;
        border: 1px solid $player-border-color;
        border-radius: 2px;
        box-shadow: 0 1px 1px rgba(0,0,0,0.15);
        color: $player-text-color;
        display: inline-block;
        line-height: 1.0;
        position:relative;
    }

    .player-controls {
        display: flex;

        > div {
            border-right: 1px solid $player-border-color;

            &:last-child {
                border-right: none;
            }

            a {
                font-size:0.1rem;
                color: $player-link-color;
                display: block;
                line-height: 0;
                padding: 0.3em;
                text-decoration: none;

                input{
                    max-width:65px;
                }
            }
        }
    }

    .player-progress {
        background-color: $player-progress-color;
        cursor: pointer;
        height: 50%;
        min-width: 52px;
        position: relative;

        .player-seeker {
            background-color: $player-seeker-color;
            bottom: 0;
            left: 0;
            position: absolute;
            top: 0;
        }
    }

    .player-time {
        display: flex;
        font-size: 0.2rem;
        justify-content: space-between;

        .player-time-current {
            font-weight: 600;
            padding-left: 2px;
        }

        .player-time-total {
            opacity: 0.5;
            padding-right: 2px;
        }
    }

    .square{
        z-index: -1;
        position:absolute;
        width:12px;
        height:20px;
        bottom:20px;
        left:0;
        background-color: rgba(0, 11, 15, 0.94);
        border-top: thin solid #4a4a4a;
        border-right:thin solid #4a4a4a;
        border-left:thin solid #4a4a4a;
        border-bottom:thin solid #4a4a4a;
    }

</style>
