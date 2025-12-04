import * as THREE from "three";
import { entity, entityLocation } from "../interfaces";
import { World } from "../world";

export class EntityBase {
    MOVEMENT_INCREMENT = 0.1;
    base: entity;
    meshAlt: THREE.Mesh | null;
    constructor(private base_class: entity){
        this.base = base_class;
        this.meshAlt = null;
    }

    get species()       {return this.base.species};
    get position()      {return this.base.location.position};
    get facing()        {return this.base.location.facing};
    get id()            {return this.base.id};
    get mesh()          {return this.meshAlt};

    tick(world: World): number{ return -1 };
    tryReproduce(world: World): number{ return -1 };

    goTowards(position:{x: number, y: number, z:number}){
        const dx = position.x - this.position.x;
        const dy = position.y - this.position.y;
        const dz = position.z - this.position.z;

        const len = Math.hypot(dx,dy,dz);

        if(len > 0){
            const movX = dx/len
            const movY = dy/len
            const movZ = dz/len

            this.base.location.position = {
                x: this.position.x + movX * this.MOVEMENT_INCREMENT,
                y: this.position.y + movY * this.MOVEMENT_INCREMENT,
                z: this.position.z + movZ * this.MOVEMENT_INCREMENT
            }
        }
    }
    destroyEntityMesh() {
        if (this.mesh) {
            const geo = this.mesh.geometry as THREE.BufferGeometry;
            geo.dispose();

            const mat = this.mesh.material;
            if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
            else mat.dispose();
        } 
    }

}



