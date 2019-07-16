<template>
    <div class="player">
        <div class="square" :style="{height:Math.floor(volume)+'px', visibility:playing ? 'visible' : 'hidden'}"></div>
        <div class="player-controls">
            <div>
                <a v-on:click.prevent="togglePlay" title="Play/Pause" href="#">
                    <svg width="16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path v-if="!playing" fill="currentColor" d="M15,10.001c0,0.299-0.305,0.514-0.305,0.514l-8.561,5.303C5.51,16.227,5,15.924,5,15.149V4.852c0-0.777,0.51-1.078,1.135-0.67l8.561,5.305C14.695,9.487,15,9.702,15,10.001z"/>
                        <path v-else fill="currentColor" d="M15,3h-2c-0.553,0-1,0.048-1,0.6v12.8c0,0.552,0.447,0.6,1,0.6h2c0.553,0,1-0.048,1-0.6V3.6C16,3.048,15.553,3,15,3z M7,3H5C4.447,3,4,3.048,4,3.6v12.8C4,16.952,4.447,17,5,17h2c0.553,0,1-0.048,1-0.6V3.6C8,3.048,7.553,3,7,3z"/>
                    </svg>
                </a>
            </div>
            <div>
                <div v-on:click="seek" class="player-progress" title="Time played : Total time">
                    <div :style="{ width: this.percentComplete + '%' }" class="player-seeker"></div>
                </div>
                <div class="player-time">
                    <div class="player-time-current">{{ currentTime }}</div>
                    <div class="player-time-total">{{ durationTime }}</div>
                </div>
            </div>
        </div>
        <audio :loop="innerLoop" ref="audiofile" :src="file" preload="auto" style="display: none;"></audio>
    </div>
</template>

<script>
    const convertTimeHHMMSS = (val) => {
        let hhmmss = new Date(val * 1000).toISOString().substr(11, 8);
        return hhmmss.indexOf("00:") === 0 ? hhmmss.substr(3) : hhmmss;
    };

    export default {
        name: "AudioPlayer",

        props:['id'],

        data: () => ({
            timout_volume:null,
            audio: undefined,
            currentSeconds: 0,
            durationSeconds: 0,
            innerLoop: false,
            loaded: false,
            previousVolume: 35,
            showVolume: false,
            file:'',
            loop:false,
            volume:0,
            playing:false,
            autoPlay:false
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

        methods: {
            togglePlay(){
                this.playing = !this.playing;
                this.setPlaying(this.playing);
            },

            load() {
                if (this.audio.readyState >= 2) {
                    this.loaded = true;
                    this.durationSeconds = parseInt(this.audio.duration);
                    return this.autoPlay;
                }

                console.log("load,file",this.file);

                throw new Error('Failed to load sound file.');
            },
            seek(e) {
                if (!this.playing || e.target.tagName === 'SPAN') {
                    return;
                }
                const el = e.target.getBoundingClientRect();
                const seekPos = (e.clientX - el.left) / el.width;
                this.audio.currentTime = parseInt(this.audio.duration * seekPos);
            },
            stop() {
                this.playing = false;
                this.setPlaying(this.playing);
                this.audio.currentTime = 0;
            },
            update(e) {
                this.currentSeconds = parseInt(this.audio.currentTime);
            },

            fadeVolume(volume){
                for(let j=1;j<5;j++){

                    this.timout_volume = setTimeout(()=>{
                        if(volume > this.volume){
                            this.setVolume(this.volume + (volume - this.volume)*0.05);
                        }else if(volume < this.volume){
                            this.setVolume(this.volume + (this.volume - volume)*0.05);
                        }
                    },j*100);
                }
                setTimeout(()=>this.setVolume(volume) ,500);
                clearTimeout(this.timout_volume);
                this.timout_volume = null;
            },

            /*set funcs */
            setVolume(val){
                //console.log("[AudioPlayer #"+this.id+"] @setVolume",val);
                this.volume = val;
                this.showVolume   = true;
                this.audio.volume = Math.min(this.volume / 100, 1);
            },
            setPlaying(val) {
                this.playing = val;
                if (val) {
                    if(this.audio && this.file !=='' && this.file) setTimeout(()=> this.audio.play(),200);
                }else{
                    this.audio.pause();
                    this.audio.currentTime = 0;
                }

            },

            setParams(file,volume,playing){
                //console.log("[AudioPlayer #"+this.id+"] @setParams",file,volume,playing);
                this.file     = file;

                if(Math.abs(this.volume - volume)>0.1){
                    this.fadeVolume(volume);
                    setTimeout(() => this.setPlaying(playing), 200);
                }else{
                    this.setVolume(volume);
                    setTimeout(() => this.setPlaying(playing), 200);
                }
            }
        },

        created() {
           // this.innerLoop = this.loop;
        },

        mounted() {
            this.audio = this.$el.querySelectorAll('audio')[0];
            this.audio.addEventListener('timeupdate', this.update);
            this.audio.addEventListener('loadeddata', this.load);
            this.audio.addEventListener('pause', () => this.playing = false);
            this.audio.addEventListener('play',  () => this.playing = true);
        }
    }
</script>

<style scoped lang="scss">
    /*@import url('https://fonts.googleapis.com/css?family=Nunito:400,700');*/

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
        bottom:18px;
        left:0;
        background-color: rgba(0, 11, 15, 0.94);
        border-top: thin solid #4a4a4a;
        border-right:thin solid #4a4a4a;
        border-left:thin solid #4a4a4a;
        border-bottom:thin solid #4a4a4a;
    }

</style>
