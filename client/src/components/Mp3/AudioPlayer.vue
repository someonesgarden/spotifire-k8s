<template>
    <div class="player">
        <div class="player-controls">
            <div>
                <a v-on:click.prevent="playing = !playing" title="Play/Pause" href="#">
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

            <div>
                <a v-on:click.prevent="innerLoop = !innerLoop" href="#">
                    <svg width="16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path v-if="!innerLoop" fill="currentColor" d="M1,12V5h3v6h10V8l5,4.5L14,17v-3H3C1.895,14,1,13.104,1,12z"/>
                        <path v-else fill="currentColor" d="M20,7v7c0,1.103-0.896,2-2,2H2c-1.104,0-2-0.897-2-2V7c0-1.104,0.896-2,2-2h7V3l4,3.5L9,10V8H3v5h14V8h-3V5h4C19.104,5,20,5.896,20,7z"/>
                    </svg>
                </a>
            </div>
            <div>
                <a v-on:click.prevent="" v-on:mouseenter="showVolume = true" title="Volume" href="#">
                    <svg width="16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path fill="currentColor" d="M19,13.805C19,14.462,18.462,15,17.805,15H1.533c-0.88,0-0.982-0.371-0.229-0.822l16.323-9.055C18.382,4.67,19,5.019,19,5.9V13.805z"/>
                    </svg>
                    <input v-model.lazy.number="volume" v-show="showVolume" type="range" min="0" max="100"/>
                </a>
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
        props:[
            'file',
            'autoPlay',
            'loop'
        ],
        // props: {
        //     file: {
        //         type: String,
        //         default: null
        //     },
        //     autoPlay: {
        //         type: Boolean,
        //         default: false
        //     },
        //     loop: {
        //         type: Boolean,
        //         default: false
        //     }
        // },
        data: () => ({
            audio: undefined,
            currentSeconds: 0,
            durationSeconds: 0,
            innerLoop: false,
            loaded: false,
            playing: false,
            previousVolume: 35,
            showVolume: false,
            volume: 100
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
            },
            muted() {
                return this.volume / 100 === 0;
            }
        },
        watch: {
            playing(value) {
                if (value) { return this.audio.play(); }
                this.audio.pause();
            },
            volume(value) {
                this.showVolume = false;
                this.audio.volume = this.volume / 100;
            }
        },
        methods: {
            load() {
                if (this.audio.readyState >= 2) {
                    this.loaded = true;
                    this.durationSeconds = parseInt(this.audio.duration);
                    return this.playing = this.autoPlay;
                }

                throw new Error('Failed to load sound file.');
            },
            mute() {
                if (this.muted) {
                    return this.volume = this.previousVolume;
                }

                this.previousVolume = this.volume;
                this.volume = 0;
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
                this.audio.currentTime = 0;
            },
            update(e) {
                this.currentSeconds = parseInt(this.audio.currentTime);
            }
        },
        created() {
            this.innerLoop = this.loop;
        },
        mounted() {
            this.audio = this.$el.querySelectorAll('audio')[0];
            this.audio.addEventListener('timeupdate', this.update);
            this.audio.addEventListener('loadeddata', this.load);
            this.audio.addEventListener('pause', () => { this.playing = false; });
            this.audio.addEventListener('play', () => { this.playing = true; });
        }
    }
</script>

<style scoped lang="scss">
    @import url('https://fonts.googleapis.com/css?family=Nunito:400,700');

    body {
        font-family: 'Nunito', sans-serif;
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
    }

    .player-controls {
        display: flex;

        > div {
            border-right: 1px solid $player-border-color;

            &:last-child {
                border-right: none;
            }

            a {
                font-size:0.2rem;
                color: $player-link-color;
                display: block;
                line-height: 0;
                padding: 0.3em;
                text-decoration: none;

                input{
                    max-width:60px;
                }
            }
        }
    }

    .player-progress {
        background-color: $player-progress-color;
        cursor: pointer;
        height: 50%;
        min-width: 56px;
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

</style>