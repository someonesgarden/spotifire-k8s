<template>
    <div>
        <img src="/static/img/design/circle4.jpg" class="circle">
        <h2>センサーチェック</h2>
        <p>内蔵された加速度＆方角センサとジオロケーションを活用しています。</p>

        <div class="ui grid home">
            <div class="eight wide column" style="text-align:center;">
                <img id="compass_h" ref="compass_h" src="/static/img/compass.jpg" :style="angleHClass"/><br/>
                [水平角度]<br/>{{sensor.angleH | dicimal3}}
            </div>

            <div class="eight wide column" style="text-align:center;">
                <img id="compass_v" ref="compass_v" src="/static/img/compass.jpg" :style="angleVClass"/><br/>
                [垂直角度]<br/>{{sensor.angleV | dicimal3}}
            </div>
        </div>

        <mu-button color="teal600" full-width @click="a_index(['howModal','set',false])">戻る</mu-button>
    </div>

</template>

<script>
    import {mapActions} from 'vuex';

    export default {
        name: "SensorCheckSlide",
        data(){
          return{
              //pwasensors:null,
              compass_calib : false,
              sensor :{
                  heading: null,
                  angleH: 1.000000000000000,
                  hx: 0.000000000000000,
                  hy: 0.000000000000000,
                  hz: 0.000000000000000,
                  angleV: 2.000000000000000,
                  vx: 0.000000000000000,
                  vy: 0.000000000000000,
                  vz: 0.000000000000000,
                  alpha: 0.000000000000000,
                  beta: 0.000000000000000,
                  gamma: 0.000000000000000
              }
          }
        },

        computed:{
            angleHClass(){
                return {transform:"rotate(" +  (this.sensor.angleH) + "deg)"};
                //return this.pwasensors ? {transform:"rotate(" +  (this.sensor.angleH) + "deg)"} : '';
            },

            angleVClass(){
                return {transform:"perspective(300px) rotateX(65deg) rotateZ(" + (this.sensor.angleV).toFixed(10) + "deg)"};
                //return this.pwasensors ? {transform:"perspective(300px) rotateX(65deg) rotateZ(" + (this.sensor.angleV).toFixed(10) + "deg)"} : '';
            }
        },

        mounted(){
            window.addEventListener('deviceorientation', this.deviceOrientation, false);
        },

        methods:{
            ...mapActions(['a_index']),

            deviceOrientation(e){
                //if (navigator.geolocation) navigator.geolocation.getCurrentPosition(position =>  this.sensor.heading = position.coords.heading);
                this.sensor.alpha = e.alpha;
                this.sensor.beta = e.beta;
                this.sensor.gamma = e.gamma;

                let ro = -(window.orientation || 0) * Math.PI / 180;
                let ry =  (e.gamma || 0) * Math.PI / 180;
                let rx =  (e.beta  || 0) * Math.PI / 180;
                let rz =  (e.alpha || 0) * Math.PI / 180;
                let co = Math.cos(ro);
                let so = Math.sin(ro);
                let cy = Math.cos(ry);
                let sy = Math.sin(ry);
                let cx = Math.cos(rx);
                let sx = Math.sin(rx);
                let cz = Math.cos(rz);
                let sz = Math.sin(rz);

                // ローカル x 軸ベクトル
                let axisX = {
                    x: co * cy * cz - co * sy * sx * sz - so * cx * sz,
                    y: co * cy * sz + co * sy * sx * cz + so * cx * cz,
                    z:-co * sy * cx + so * sx
                };

                // ローカル y 軸ベクトル
                let axisY = {
                    x:-so * cy * cz + so * sy * sx * sz - co * cx * sz,
                    y:-so * cy * sz - so * sy * sx * cz + co * cx * cz,
                    z: so * sy * cx + co * sx
                };

                // ローカル z 軸ベクトル
                let axisZ = {
                    x: sy * cz + cy * sx * sz,
                    y: sy * sz - cy * sx * cz,
                    z: cy * cx
                };

                // ------------------------------------------------------------
                // デバイスを水平に寝かせて閲覧している場合
                // ------------------------------------------------------------
                let angleH = Math.atan2(-axisY.x,axisY.y) * (180.0 / Math.PI);
                if(axisZ.z < 0) angleH = -angleH;

                this.sensor.angleH = angleH;
                this.sensor.hx = (axisY.x).toFixed(4);
                this.sensor.hy = (axisY.y).toFixed(4);
                this.sensor.hz = (axisY.z).toFixed(4);

                // ------------------------------------------------------------
                // デバイスを垂直に立てて閲覧している場合
                // ------------------------------------------------------------
                let angleV = Math.atan2(axisZ.x,-axisZ.y) * (180.0 / Math.PI);
                this.sensor.angleV = angleV;
                this.sensor.vx = (-axisZ.x).toFixed(4);
                this.sensor.vy = (-axisZ.y).toFixed(4);
                this.sensor.vz = (-axisZ.z).toFixed(4);
            }
        }
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
