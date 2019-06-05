import * as THREE from 'three'
import anime from 'animejs';

export default class Boxes {

    constructor(scene,camera,shaders,cb) {

        this.shaders = shaders
        this.scene = scene
        this.camera = camera
        this.randFrom = [
            'first',
            'last',
            'center'
        ];

        this.cb = cb;

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

        this.createBoxes(this.scene,this.camera)
        this.beginAnimationLoop()

        console.log("camera");
        console.log(this.camera);
    }



    createBoxes(scene,camera) {

        let clickPosition = (event)=>{
            let x = event.clientX;
            let y = event.clientY;
            let mouse = new THREE.Vector2();
            mouse.x =  ( x / window.innerWidth ) * 2 - 1;
            mouse.y = -( y / window.innerHeight ) * 2 + 1;
            let raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, this.camera);
            let intersects = raycaster.intersectObjects(this.scene.children);
            if(intersects.length>0) this.cb(intersects[0]);
        }

        //document.addEventListener( 'mousedown', clickPosition, false );

        this.geometry = new THREE.BoxBufferGeometry(2, 9, 2);

        let material1 = new THREE.MeshPhongMaterial( {  color: 0x00FF7F, ambient:0x990000,specular:0xffff00,shininess:30 } );

        let vertexShader = this.shaders.vertexShader;
        let fragmentShader = this.shaders.fragmentShader;
        let material2 = new THREE.ShaderMaterial({uniforms: {thickness: {value: 1.5}},
            vertexShader,
            fragmentShader
        });


        let cube1 = new THREE.Mesh( this.geometry, material1 );

        let cube2 = new THREE.Mesh( this.geometry, material2 );

        cube2.link="link1";
        cube2.link="link2";


        let links = [
            "",
            "link1",
            "link2",
            "link3",
            "link4",
            "link5",
            "link6",
            "link7",
            "link8",
            "link9"
        ]

        let boxdata = [
            [0,0,1,0,0,0,0,0,0,0,9,0],
            [0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,2,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,3,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0],
            [0,8,0,0,0,0,4,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,6,0,0],
            [0,0,0,0,5,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,7,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0]
        ]


        let offset = 2.25;
        this.nRows = 12;
        this.nCols = 12;

        // let offset = 2;
        // this.nRows = 12;
        // this.nCols = 12;

        this.staggerArray = [];

        for(let column = 0; column < this.nCols; column++) {
            for(let row = 0; row < this.nRows; row++) {

                let obj = boxdata[column][row] ? cube1.clone() : cube2.clone();
                if(!!boxdata[column][row]) obj.name =links[boxdata[column][row]];

                obj.position.x = (row * offset) - ((this.nRows*0.5) + (this.geometry.parameters.width*0.5));
                obj.position.y = -(this.geometry.parameters.height*0.5);
                obj.position.z = (column * offset) - ((this.nCols*0.5) + (this.geometry.parameters.width*0.5));
                this.staggerArray.push(obj.position);
                //this.boxes.push(obj);
                this.scene.add(obj);
            }
        }
    }


    beginAnimationLoop() {
        // random from array
        let randFrom     = this.randFrom[Math.floor(Math.random()*this.randFrom.length)];
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
    }
}
