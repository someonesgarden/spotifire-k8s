<template>
    <mu-container class="flex_v">
        <div>

            <mu-flex class="flex-wrapper" justify-content="center" align-items="center" direction="column">

                <h3 style="font-weight:bold;color:#0de254;">deviceorientation</h3>
                <hr>

                <div class="ui grid">

                    <div class="eight wide column" style="text-align:center;">
                        <img id="compass_h" ref="compass_h" src="/static/img/spotify_logo.png" style="width:100px;height:100px;border-radius:50%;"/><br/>
                        Angle(h):{{sensor.angleH}}<br/>
                        (x,y,z):({{sensor.hx}},{{sensor.hy}},{{sensor.hz}})
                    </div>

                    <div class="eight wide column" style="text-align:center;">
                        <img id="compass_v" ref="compass_v" src="/static/img/spotify_logo.png" style="width:100px;height:100px;border-radius:50%;"/><br/>
                        Angle(v):{{sensor.angleV}}<br/>
                        (x,y,z):({{sensor.vx}},{{sensor.vy}},{{sensor.vz}})
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
                sensor:{
                    angleH:0,
                    hx:0,
                    hy:0,
                    hz:0,
                    angleV:0,
                    vx:0,
                    vy:0,
                    vz:0,
                    absolute:0,
                    alpha:0,
                    beta:0,
                    gamma:0
                }
            }
        },

        mounted () {
            window.addEventListener("deviceorientation", this.deviceOrientation, true);
        },

        beforeDestroy() {
            window.removeEventListener("deviceorientation",  this.deviceOrientation, true);
        },

        methods:{
            deviceOrientation(e){

                this.sensor.absolute = e.absolute;
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

                this.$ref.compass_h.style.transform = "rotate(" + (angleH) + "deg)";


                this.sensor.angleH = angleH;
                this.sensor.hx = (axisY.x).toFixed(4);
                this.sensor.hy = (axisY.y).toFixed(4);
                this.sensor.hz = (axisY.z).toFixed(4);

                // ------------------------------------------------------------
                // デバイスを垂直に立てて閲覧している場合
                // ------------------------------------------------------------
                let angleV = Math.atan2(axisZ.x,-axisZ.y) * (180.0 / Math.PI);

                this.$ref.compass_v.style.transform = "perspective(300px) rotateX(65deg) rotateZ(" + (angleV).toFixed(10) + "deg)";
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

    /*img#compass_h{*/
    /*    transform: rotateX(165deg) rotateZ(10deg);*/
    /*}*/

    /*img#compass_v{*/
    /*    transform: perspective(300px) rotateX(65deg) rotateZ(20deg);*/
    /*}*/
</style>
