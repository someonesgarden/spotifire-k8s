<template>
    <div>
        <mu-stepper :active-step="vactiveStep" orientation="vertical">

            <mu-step v-for="(step,index) in steps" :key="'step'+index">
                <mu-step-label>
                    {{step.title}}
                </mu-step-label>
                <mu-step-content>
                    <p v-html="step.desc"></p>
                    <widget-player v-if="step.spotify" :type="step.spotify.type" :id="step.spotify.id"></widget-player>
                    <mu-button class="step-button" @click="vhandleNext" color="primary">次へ</mu-button>
                    <mu-button class="step-button" @click="vhandlePrev" color="amber500" v-if="index>0">戻る</mu-button>
                </mu-step-content>
            </mu-step>

        </mu-stepper>
        <p v-if="vfinished" style="text-align:center;">
            <mu-button round small fulll color="purple600" @click="vreset" style="margin:8px auto;">スタート地点に到着！ゲームスタート</mu-button>
        </p>
    </div>
</template>

<script>
    import WidgetPlayer from '../Spotify/Player/WidgetPlayer';
    export default {
        name: "SubscribeLeftView",
        props:['steps'],
        components:{
            WidgetPlayer
        },
        data () {
            return {
                vactiveStep: 0
            };
        },
        computed: {
            vfinished () {
                return this.vactiveStep > 2;
            }
        },
        methods: {
            vhandleNext () {
                this.vactiveStep++;
            },
            vhandlePrev () {
                this.vactiveStep--;
            },
            vreset () {
                this.vactiveStep = 0;
            }
        }
    }
</script>

<style scoped lang="scss">


</style>
