<template>
    <mu-container class="flex_v">
        <div>
            <mu-flex class="flex-wrapper" justify-content="center" align-items="center" direction="column">
                <h3 style="font-weight:bold;color:#00b46d;">deviceorientation</h3>
                <br>
                <p v-if="compassNeedsCalibration">compassNeedsCalibration</p>
                <div class="ui grid home">
                    <div class="five wide column" style="text-align:center;">
                        <img id="compass_h" ref="compass_h" src="/static/img/spotify_logo.png" style="width:65px;height:65px;border-radius:50%;"/><br/>
                        Angle(h)<br/>{{sensor.angleH | dicimal2}}
                        <hr>
                        (x,y,z)<br/>{{sensor.hx | dicimal2}}<br/>{{sensor.hy | dicimal2}}<br/>{{sensor.hz | dicimal2}}
                    </div>

                    <div class="six wide column" style="text-align:center;">
                        <img id="compass" ref="compass" src="/static/img/compass.jpg" style="width:65px;height:65px;border-radius:50%;"/><br/>
                        Heading<br/>{{sensor.heading}}<br/>
                        Alpha<br/>{{sensor.alpha | dicimal2}}<br/>
                        Beta<br/>{{sensor.beta | dicimal2}}<br/>
                        Gamma<br/>{{sensor.gamma | dicimal2}}
                    </div>

                    <div class="five wide column" style="text-align:center;">
                        <img id="compass_v" ref="compass_v" src="/static/img/spotify_logo.png" style="width:65px;height:65px;border-radius:50%;"/><br/>
                        Angle(v)<br/>{{sensor.angleV | dicimal3}}
                        <hr>
                        (x,y,z)<br/>{{sensor.vx | dicimal2}}<br/>{{sensor.vy | dicimal2}}<br/>{{sensor.vz | dicimal2}}
                    </div>
                </div>
            </mu-flex>

        </div>
    </mu-container>
</template>
<script>
    import {mapActions,mapGetters} from 'vuex';

    export default {
        name: 'home',
        components:{

        },

        data(){
            return{
                compassNeedsCalibration:false,
                orienting: window.DeviceOrientationEvent,
                rotating: window.DeviceMotionEvent,
                sensor:{
                    angleH:0.000000000000000,
                    hx:0.000000000000000,
                    hy:0.000000000000000,
                    hz:0.000000000000000,
                    angleV:0.000000000000000,
                    vx:0.000000000000000,
                    vy:0.000000000000000,
                    vz:0.000000000000000,
                    heading:"",
                    alpha:0.000000000000000,
                    beta:0.000000000000000,
                    gamma:0.000000000000000
                }
            }
        },


        mounted () {

            this.$nextTick(() => {
                window.addEventListener('deviceorientation', this.deviceOrientation, false);

                // if (this.orienting) {
                //
                // }
                // else if (this.rotating) {
                //     window.addEventListener('devicemove', this.rotate, false)
                // }
                // else {
                //     document.addEventListener('mousemove', this.move)
                // }

                window.addEventListener("compassneedscalibration", this.compassNeedsCalibration, true);
            })
        },

        beforeDestroy() {
            window.removeEventListener("deviceorientation",  this.deviceOrientation, false);
            window.removeEventListener("compassneedscalibration", this.compassNeedsCalibration, true);
        },

        methods:{

            compassNeedsCalibration(e){
                this.compassNeedsCalibration = true;
            },

            deviceOrientation(e){
                if (navigator.geolocation) navigator.geolocation.getCurrentPosition(position =>  this.sensor.heading = position.coords.heading || "No geo_heading");

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

                this.$refs.compass.style.transform = "rotate(" +  (angleH) + "deg)";
                this.$refs.compass_h.style.transform = "rotate(" + (angleH) + "deg)";


                this.sensor.angleH = angleH;
                this.sensor.hx = (axisY.x).toFixed(4);
                this.sensor.hy = (axisY.y).toFixed(4);
                this.sensor.hz = (axisY.z).toFixed(4);

                // ------------------------------------------------------------
                // デバイスを垂直に立てて閲覧している場合
                // ------------------------------------------------------------
                let angleV = Math.atan2(axisZ.x,-axisZ.y) * (180.0 / Math.PI);

                this.$refs.compass_v.style.transform = "perspective(300px) rotateX(65deg) rotateZ(" + (angleV).toFixed(10) + "deg)";
                this.sensor.angleV = angleV;
                this.sensor.vx = (-axisZ.x).toFixed(4);
                this.sensor.vy = (-axisZ.y).toFixed(4);
                this.sensor.vz = (-axisZ.z).toFixed(4);
            }
        },

        watch: {

        }
    }
</script>

<style scoped lang="scss">

    .home{
        font-size:0.6rem;
    }

    img#compass_v, img#compass_h{
        margin:0 auto;
    }

</style>
