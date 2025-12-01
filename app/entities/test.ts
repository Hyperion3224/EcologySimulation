import { entityLocation } from "../interfaces";
import { World } from "../world";
import { EntityBase } from "./entity.base";
import * as THREE from 'three';

export class Test extends EntityBase {
    constructor(_id: number, _location: entityLocation){  
        super({
                id: _id,
                species: "test", 
                location : _location,
            });
        
        this.meshAlt = new THREE.Mesh(
            new THREE.SphereGeometry(1,6,6),
            new THREE.MeshStandardMaterial({ color: 0xffdb11 }))
    }

    static createTest(_id: number, _location: entityLocation){
        return new Test(_id, _location);
    }

    tick(world: World){
        return 1;
    }
}