<template>
    <div>
        <h1>センサーチェック</h1>
        <p>端末に内蔵された加速度センサと地磁気センサと、緯度経度を測定するジオロケーション機能を活用しています。</p>

        <div class="ui grid home" v-if="sensors">
            <div class="eight wide column" style="text-align:center;">
                <img id="compass_h" ref="compass_h" src="/static/img/spotify_logo.png" :style="angleHClass"/><br/>
                [水平角度]<br/>{{sensors.sensor.angleH | dicimal3}}
            </div>

            <div class="eight wide column" style="text-align:center;">
                <img id="compass_v" ref="compass_v" src="/static/img/spotify_logo.png" :style="angleVClass"/><br/>
                [垂直角度]<br/>{{sensors.sensor.angleV | dicimal3}}
            </div>
        </div>

        <mu-button color="teal600" full-width @click="a_index(['howModal','set',false])">戻る</mu-button>
    </div>

</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import Sensors from '../../class/Sensors.js';

    export default {
        name: "SensorCheckSlide",
        data(){
            return{
                sensors:null,
            }
        },
        computed:{
            angleHClass(){
                return this.sensors ? {transform:"rotate(" +  (this.sensors.sensor.angleH) + "deg)"} : '';
            },
            angleVClass(){
                return this.sensors ? {transform:"perspective(300px) rotateX(65deg) rotateZ(" + (this.sensors.sensor.angleV).toFixed(10) + "deg)"} : '';
            }
        },

        mounted(){
            this.sensors = new Sensors({});
        },
        methods:mapActions(['a_index'])
    }
</script>

<style scoped lang="scss">
img#compass_h, img#compass_v{
    margin:0 auto;
    width:65px;
    height:65px;
    border-radius:50%;
}
</style>
