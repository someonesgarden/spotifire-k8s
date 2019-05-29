import * as THREE from 'three'

export default class Light{
    constructor(type='ambient') {
        this.type  = type;
        this.light = this.loadLight(type);
    }

    loadLight(type){
        if(type==='hemi'){
            return  new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 2.0, (0, 1, 0));
        }else if(type==='direct'){
            return new THREE.DirectionalLight(0xFFFFFF, 1);
        }else{
            return  new THREE.AmbientLight(0xFFFFFF, 0.5);
        }

    }
}

