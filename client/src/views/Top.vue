<template>
    <mu-container class="flex_v">
        <div id="anime_area0" class="base" style="padding:0;">
            <div class="area" id="stage" ref="stage" @mouseover="mouseOver" @mouseout="mouseOut">
            </div>
        </div>
    </mu-container>
</template>
<script>
    import {mapActions,mapGetters} from 'vuex';

    import * as THREE from 'three'
    import TrackballControls from 'three-trackballcontrols'
    import OrbitControls from 'three-orbitcontrols';
    import Camera  from '../three/Camera';
    import Light   from '../three/Light';
    import Boxes   from '../three/Boxes';

    export default {
        name: 'top',
        components:{

        },
        data: function () {
            const scene         = new THREE.Scene()
            const renderer      = new THREE.WebGLRenderer( { alpha: true } )
            const camera        = new Camera().camera;
            const ambientLight  = new Light().light;
            const directLight   = new Light('direct').light;
            const boxesAnime    = null;
            const control       = null;
            return {scene, renderer, camera, ambientLight,directLight, boxesAnime, control}
        },

        computed:mapGetters(['g_three']),

        mounted () {
            this.boxesAnime    = new Boxes(this.scene, this.camera, this.g_three.shaders,(val)=>{
                if(val.object.name!=='') this.threeClickAction(val.object.name);
            });

            this.control       = this.setControl();
            this.$refs.stage.appendChild(this.renderer.domElement);
            window.addEventListener('resize', this.resize)
            this.resize();

            this.scene.add(this.camera);
            this.scene.add(this.ambientLight);
            this.scene.add(this.directLight);
            this.animate();
        },

        beforeDestroy() {
            this.control.enabled = false;
            this.control = null;
            window.removeEventListener('resize', this.resize)

        },

        methods: {
            ...mapActions(['a_three']),

            threeClickAction(val){

                const reducers = {

                    link1: () => {
                        this.$router.push("/news");
                        return true;
                    },
                    link2: () => {
                        this.$router.push("/map");
                        return true;
                    },
                    link3: () => {
                        this.$router.push("/anime2");
                        return true;
                    },
                    link4: () => {
                        this.$router.push("/news");
                        return true;
                    },
                    link5: () => {
                        this.$router.push("/map");
                        return true;
                    },
                    link6: () => {
                        this.$router.push("/anime2");
                        return true;
                    },
                    link7: () => {
                        this.$router.push("/news");
                        return true;
                    },
                    link8: () => {
                        this.$router.push("/map");
                        return true;
                    },
                    link9: () => {
                        this.$router.push("/anime2");
                        return true;
                    },


                };
                if(!reducers[val]) return false;

                return reducers[val]();



            },

            setControl(mode='orbit'){
                let control = null;

                if(mode==='orbit'){
                    // === Orbit ===
                    control = new OrbitControls(this.camera, this.renderer.domElement);
                    control.autoRotate = true;
                    control.enabled = false;
                }else{
                    // === TrackBall ===
                    control = new TrackballControls(this.camera, this.renderer.domElement)
                    control.noZoom = true
                    control.noPan = true
                    control.rotateSpeed = 1.0
                }
                return control;
            },

            mouseOver(evt){
                console.log("mouseOver!")
                this.control.enabled = true;
            },

            mouseOut(evt){
                console.log("mouseOut!")
                this.control.enabled = false;
            },

            resetCamera(c){
                this.camera.fov     = c.param.fov.val
                this.camera.aspect  = c.param.aspect.val
                this.camera.near    = c.param.near.val
                this.camera.far     = c.param.far.val
                this.camera.updateProjectionMatrix()
                this.resetCameraPosition();
            },

            resetCameraPosition(theta=20,phi=60,radious=20){
                this.camera.position.x = radious * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
                this.camera.position.y = radious * Math.sin( phi * Math.PI / 360 );
                this.camera.position.z = radious * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
                this.camera.updateMatrix();
            },

            resize(){
                let stage = document.getElementById('stage')
                this.renderer.setSize(stage.offsetWidth, stage.offsetHeight)
                let aspect = (stage.offsetWidth) / stage.offsetHeight
                this.a_three({obj:'camera', type:'param', key:'aspect', val:aspect})
                this.resetCamera(this.g_three.camera)
            },

            animate () {
                requestAnimationFrame(this.animate)

                this.quaternion()
                this.renderer.render(this.scene, this.camera)
                if(this.control) this.control.update()
            },

            quaternion () {
                if(!!this.qua){
                    if (typeof this.qua[0] === 'undefined') return
                    let q = new THREE.Quaternion(this.qua[2], this.qua[3], this.qua[1], this.qua[0])
                    this.cube.quaternion.copy(q)
                }
            }
        },

        watch: {
            'qua': ()=>{
                this.quaternion()
                this.renderer.render(this.scene, this.camera)
            },

            'g_three.camera':{
                handler(newCamera){
                    this.resetCameraPosition(10,10)
                    this.resetCamera(newCamera)
                },
                deep:true
            }
        }
    }
</script>

<style scoped lang="scss">
</style>
