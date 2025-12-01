import * as THREE from "three";
import { entity, entityLocation } from "../interfaces";
import { World } from "../world";

export class EntityBase {
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
}



