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
    import anime from 'animejs';

    import * as THREE from 'three'
    //import TrackballControls from 'three-trackballcontrols'
    import OrbitControls from 'three-orbitcontrols';
    import Camera  from '../three/Camera';
    import Light   from '../three/Light';
    import Boxes   from '../three/Boxes';

    export default {
        name: 'top',
        components:{

        },
        data: function () {
            const scene       = new THREE.Scene()
            const renderer    = new THREE.WebGLRenderer( { alpha: true } )
            const camera      = new Camera().camera;
            const light       = new Light().light;
            const boxesAnime  = new Boxes(scene);

            return {
                scene:      scene,
                renderer:   renderer,
                camera:     camera,
                light:      light,
                boxesAnime: boxesAnime,
                //trackball:  null,
                orbit:      null
            }
        },

        computed:mapGetters(['g_three']),

        created () {
            // === sceneにmodel,light, cameraを追加 ===
            this.scene.add(this.camera)
            this.scene.add(this.light)

            this.boxesAnime.createBoxes()
            this.boxesAnime.beginAnimationLoop()
        },

        mounted () {
            this.$refs.stage.appendChild(this.renderer.domElement)
            window.addEventListener('resize', this.resize)
            this.resize()

            // === TrackBall ===
            // this.trackball = new TrackballControls(this.camera, this.renderer.domElement)
            // this.trackball.noZoom = true
            // this.trackball.noPan = true
            // this.trackball.rotateSpeed = 1.0

            // === Orbit ===
            this.orbit = new THREE.OrbitControls(this.camera,this.renderer.domElement);
            this.orbit.autoRotate = true;
            this.orbit.enabled = false;

            this.animate()
        },

        beforeDestroy() {
            console.log("Before Destroy");
            this.orbit.enabled = false;
            //this.orbit = null;
            window.removeEventListener('resize', this.resize)
        },


        methods: {
            ...mapActions(['a_three']),

            mouseOver(evt){
                console.log("mouseOver!")
                this.orbit.enabled = true;
            },

            mouseOut(evt){
                console.log("mouseOut!")
                this.orbit.enabled = false;
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
                //this.trackball.update()
                this.orbit.update()
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
