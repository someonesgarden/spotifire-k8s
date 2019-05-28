import * as THREE from 'three'

export default class Light{
    constructor(type) {
        this.type  = type;
        this.light = this.loadLight();
    }

    loadLight(){
        return  new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 2.0, (0, 1, 0));
    }
}

