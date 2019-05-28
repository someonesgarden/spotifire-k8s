import * as THREE from 'three'

export default class Models {

    constructor(type) {
        this.type  = type;
        this.model = null;

        switch(this.type){
            case 'cube':
                this.model = this.cube();
                break;
            case 'grid':
                this.model = this.grid();
                break;
        }
    }

    cube(){
        // === cube ===
        const geometry    = new THREE.BoxGeometry(1,1,1)
        const material    = [
            new THREE.MeshStandardMaterial({ color: 0xFFFFFF }),
            new THREE.MeshStandardMaterial({ color: 0xF4D06F }),
            new THREE.MeshStandardMaterial({ color: 0xFF8811 }),
            new THREE.MeshStandardMaterial({ color: 0x9DD9D2 }),
            new THREE.MeshStandardMaterial({ color: 0xFFA8F0 }),
            new THREE.MeshStandardMaterial({ color: 0x392F5A })
        ]

        let cube = new THREE.Mesh(geometry, material);

        cube.position.x = -13;
        cube.position.y = 0.76;
        cube.position.z = 16;


        return cube;
    }

    grid(){
        // === grid ===
        const grid        = new THREE.GridHelper(6, 10, 0x888888, 0x888888)
        grid.position.y   = -0.6
        return grid;
    }
}

