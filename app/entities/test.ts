import { entity, entityLocation } from "../interfaces";
import { EntityBase } from "./entity.base";

export class Test extends EntityBase {
    

    constructor(location: entityLocation){  
        super(
            {
                id: 0,
                species: "test", 
                genome: [0,0,0,0,0,0,0,0],
                location : {position: {x:0,y:0,z:0},facing: {x:0,y:0,z:0}},
                
                species_averages: [0,0,0,0,0,0,0,0],
                species_std: [0,0,0,0,0,0,0,0],
                
                derivedStats:{
                    health: 0,
                    speed: 0,
                    strength: 0,
                    fertility: 0,
                    size: 0,
                    energy: 0,
                    sight: 0, 
                    locality_preferance: 0,
                }
            }, location);
    }
}