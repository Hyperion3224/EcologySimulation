import { entity, entityLocation } from "../interfaces";
import { EntityBase } from "./entity.base";

export class Test extends EntityBase {
    

    constructor(_location: entityLocation){  
        super({
                id: 0,
                species: "test", 
                location : _location,
            });
    }
}