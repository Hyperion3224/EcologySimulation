import { entity, entityLocation } from "../interfaces";

export class EntityBase {
    base: entity;
    constructor(private base_class: entity){
        this.base = base_class;
    }

    getSpecies(){
        return this.base.species;
    }

    getLocation(){
        return this.base.location.position;
    }

    tick(): number{ return -1 };
    tryReproduce(): number{ return -1 };
}



