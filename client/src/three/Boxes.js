import * as THREE from 'three'
import anime from 'animejs';
// import Models  from './Models';

export default class Boxes {

    constructor(scene) {
        this.scene = scene

        this.randFrom = [
            'first',
            'last',
            'center'
        ];

        this.easing = [
            'linear',
            'easeInOutQuad',
            'easeInOutCubic',
            'easeInOutQuart',
            'easeInOutQuint',
            'easeInOutSine',
            'easeInOutExpo',
            'easeInOutCirc',
            'easeInOutBack',
            'cubicBezier(.5, .05, .1, .3)',
            'spring(1, 80, 10, 0)',
            'steps(10)'
        ];
    }

    createBoxes() {

        // this.box     = new Models('cube').model;
        // this.scene.add(this.box);

        this.geometry = new THREE.BoxBufferGeometry(1, 12, 1);
        let vertexShader = `
      varying vec2 vUv;
      void main()	{
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
    `;

        let fragmentShader = `
      #extension GL_OES_standard_derivatives : enable

      varying vec2 vUv;
      uniform float thickness;

      float edgeFactor(vec2 p){
        vec2 grid = abs(fract(p - 0.5) - 0.5) / fwidth(p) / thickness;
        return min(grid.x, grid.y);
      }

      void main() {
        float a = edgeFactor(vUv);
        vec3 c = mix(vec3(1), vec3(0), a);
        gl_FragColor = vec4(c, 1.0);
      }
    `;

        let material = new THREE.ShaderMaterial({
            uniforms: {
                thickness: {
                    value: 1.5
                }
            },
            vertexShader,
            fragmentShader
        });

        let cube = new THREE.Mesh( this.geometry, material );

        let offset = 1.25;
        this.nRows = 25;
        this.nCols = 25;
        this.staggerArray = [];

        for(var column = 0; column < this.nCols; column++) {
            for(var row = 0; row < this.nRows; row++) {
                let obj = cube.clone();
                obj.position.x = (row * offset) - ((this.nRows*0.5) + (this.geometry.parameters.width*0.5));
                obj.position.y = -(this.geometry.parameters.height*0.5);
                obj.position.z = (column * offset) - ((this.nCols*0.5) + (this.geometry.parameters.width*0.5));
                this.staggerArray.push(obj.position);
                //this.boxes.push(obj);
                this.scene.add(obj);
            }
        }
    }

    // droneAnimationLoop(){
    //
    //     anime.timeline({loop: true})
    //         .add({
    //             targets: this.box.position,
    //             y: [
    //                 {value: (this.geometry.parameters.height*0.25)+10, duration: 500},
    //                 {value: -(this.geometry.parameters.height*0.25)+10, duration: 2000},
    //             ],
    //             x: [
    //                 {value: anime.random(-50,50), duration: 500},
    //                 {value: anime.random(-30,30), duration: 2000},
    //             ],
    //             delay: 100
    //         })
    // }


    beginAnimationLoop() {

        // random from array
        let randFrom = this.randFrom[Math.floor(Math.random()*this.randFrom.length)];
        let easingString = this.easing[Math.floor(Math.random()*this.easing.length)];

        anime({
            targets: [this.staggerArray],
            y: [
                {value: (this.geometry.parameters.height*0.25), duration: 500},
                {value: -(this.geometry.parameters.height*0.25), duration: 2000},
            ],
            delay: anime.stagger(200, {grid: [this.nRows, this.nCols], from: randFrom}),
            easing: easingString,
            complete: (anim) => this.beginAnimationLoop()
        });

        // anime({
        //         targets: this.box.position,
        //         y: [
        //             {value: (this.geometry.parameters.height*0.25)+10, duration: 500},
        //             {value: -(this.geometry.parameters.height*0.25)+10, duration: 2000},
        //         ],
        //         x: [
        //             {value: anime.random(-15,15), duration: 500},
        //             {value: anime.random(-13,13), duration: 2000},
        //         ],
        //         delay: anime.stagger(200, {grid: [this.nRows, this.nCols], from: randFrom}),
        //         easing: easingString
        //     })


    }
}
