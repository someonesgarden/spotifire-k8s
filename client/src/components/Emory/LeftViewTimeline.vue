<template>
    <div>
        <mu-stepper :active-step="vactiveStep" orientation="vertical">

            <mu-step v-for="(step,index) in steps" :key="'step'+index">
                <mu-step-label>
                    {{step.title}}
                </mu-step-label>
                <mu-step-content>
                    <p v-html="step.desc"></p>
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
    import {mapGetters} from 'vuex';
    export default {
        name: "SubscribeLeftView",
        props:['steps'],
        data () {
            return {
                vactiveStep: 0
            };
        },
        mounted(){
            this.vactiveStep = 0;
        },
        computed: {
            ...mapGetters(['side']),

            vfinished () {
                return this.vactiveStep >= this.steps.length;
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
        },
        watch:{
            'side.emory.left.open':{
                handler(newState){
                    if(newState)  this.vactiveStep = 0;
                    console.log(" this.vactiveStep is", this.vactiveStep);
                }
            }
        }
    }
</script>

<style scoped lang="scss">


</style>
