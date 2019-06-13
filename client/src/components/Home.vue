<template>
    <mu-container class="flex_v">
        <div>

            <mu-flex class="flex-wrapper" justify-content="center" align-items="center" direction="column">

                <h1>deviceorientation</h1>
                <hr>

                <mu-form ref="sensorform" :model="sensor" class="mu-demo-form" label-position="top" label-width="50">

                    <div class="ui grid">
                        <div class="four wide column">
                            <mu-form-item prop="angle" label="Angle" class="range">
                                <mu-text-field prop="angle" v-model="sensor.angleH"></mu-text-field>
                            </mu-form-item>
                        </div>

                        <div class="four wide column">
                            <mu-form-item prop="x" label="x" class="range">
                                <mu-text-field prop="x"  v-model="sensor.hx"></mu-text-field>
                            </mu-form-item>
                        </div>

                        <div class="four wide column">
                            <mu-form-item prop="y" label="x" class="range">
                                <mu-text-field prop="y"  v-model="sensor.hy"></mu-text-field>
                            </mu-form-item>
                        </div>

                        <div class="four wide column">
                            <mu-form-item prop="z" label="x" class="range">
                                <mu-text-field prop="z"  v-model="sensor.hz"></mu-text-field>
                            </mu-form-item>
                        </div>
                    </div>

                    <div class="ui grid">
                        <div class="four wide column">
                            <mu-form-item prop="angle" label="Angle" class="range">
                                <mu-text-field prop="angle" v-model="sensor.angleV"></mu-text-field>
                            </mu-form-item>
                        </div>

                        <div class="four wide column">
                            <mu-form-item prop="x" label="x" class="range">
                                <mu-text-field prop="x"  v-model="sensor.vx"></mu-text-field>
                            </mu-form-item>
                        </div>

                        <div class="four wide column">
                            <mu-form-item prop="y" label="x" class="range">
                                <mu-text-field prop="y"  v-model="sensor.vy"></mu-text-field>
                            </mu-form-item>
                        </div>

                        <div class="four wide column">
                            <mu-form-item prop="z" label="x" class="range">
                                <mu-text-field prop="z"  v-model="sensor.vz"></mu-text-field>
                            </mu-form-item>
                        </div>
                    </div>

                    <div class="ui grid">
                        <div class="four wide column">
                            <mu-form-item prop="absolute" label="Angle" class="range">
                                <mu-text-field prop="absolute" v-model="sensor.absolute"></mu-text-field>
                            </mu-form-item>
                        </div>

                        <div class="four wide column">
                            <mu-form-item prop="alpha" label="alpha" class="range">
                                <mu-text-field prop="alpha"  v-model="sensor.alpha"></mu-text-field>
                            </mu-form-item>
                        </div>

                        <div class="four wide column">
                            <mu-form-item prop="beta" label="beta" class="range">
                                <mu-text-field prop="beta"  v-model="sensor.beta"></mu-text-field>
                            </mu-form-item>
                        </div>

                        <div class="four wide column">
                            <mu-form-item prop="gamma" label="gamma" class="range">
                                <mu-text-field prop="gamma"  v-model="sensor.gamma"></mu-text-field>
                            </mu-form-item>
                        </div>
                    </div>
                </mu-form>

<!--                <div>-->
<!--                    <div id="element_05_compass_h" style="margin:10px 0px 10px 100px; width:200px; height:200px; position:relative; line-height:1; background:#fcc; border:10px solid #caa; border-radius:100px;">-->
<!--                        <div style="position:absolute; width:180px; height:180px; font-size:180px; font-weight:bold; top:0; bottom:0; left:0; right:0; margin:auto;">↑</div>-->
<!--                    </div>-->
<!--                    angle<br>-->
<!--                    <input id="input_05_angle_h" style="margin-bottom:5px;"><br>-->
<!--                    +(axisY)<br>-->
<!--                    x:<input id="input_05_axis_y_x" style="width:70px;"> y:<input id="input_05_axis_y_y" style="width:70px;"> z:<input id="input_05_axis_y_z" style=" width:70px; margin-bottom:5px;"><br>-->
<!--                    <hr>-->
<!--                    デバイスを垂直に立てて閲覧している場合-->
<!--                    <div id="element_05_compass_v" style="margin:-50px 0px -30px 100px; width:200px; height:200px; position:relative; line-height:1; background:#ccf; border:10px solid #aac;">-->
<!--                        <div style="position:absolute; width:180px; height:180px; font-size:180px; font-weight:bold; top:0; bottom:0; left:0; right:0; margin:auto;">↑</div>-->
<!--                    </div>-->
<!--                    angle<br>-->
<!--                    <input id="input_05_angle_v" style="margin-bottom:5px;"><br>-->
<!--                    -(axisZ)<br>-->
<!--                    x:<input id="input_05_axis_z_x" style="width:70px;"> y:<input id="input_05_axis_z_y" style="width:70px;"> z:<input id="input_05_axis_z_z" style=" width:70px; margin-bottom:5px;"><br>-->

<!--                </div>-->


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

                //element_compass_h.style.transform = "rotate(" + (angleH) + "deg)";
                this.sensor.angleH = angleH;
                this.sensor.hx = (axisY.x).toFixed(4);
                this.sensor.hy = (axisY.y).toFixed(4);
                this.sensor.hz = (axisY.z).toFixed(4);

                // ------------------------------------------------------------
                // デバイスを垂直に立てて閲覧している場合
                // ------------------------------------------------------------
                let angleV = Math.atan2(axisZ.x,-axisZ.y) * (180.0 / Math.PI);

                //element_compass_v.style.transform = "perspective(300px) rotateX(65deg) rotateZ(" + (angleV).toFixed(10) + "deg)";
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
</style>
