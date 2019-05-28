import * as THREE from 'three'

export default class Camera{
    constructor(type) {
        this.type  = type;
        this.camera = this.loadCamera();
    }

    loadCamera(){
        const camera      = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
        //camera.position.z = 5
        camera.position.x = 0;
        camera.position.y = 15;
        camera.position.z = -25;
        camera.lookAt(new THREE.Vector3(0, 0, 0)) //常に中心を見る
        return camera
    }
}

