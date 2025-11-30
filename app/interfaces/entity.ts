export interface entity{
    id: number,
    species: string, 
    genome: number[],
    location : entityLocation,
    
    species_averages: number[],
    species_std: number[],
    

    derivedStats:{
        health: number,
        speed: number,
        strength: number,
        fertility: number,
        size: number,
        energy: number,
        sight: number, 
        locality_preferance: number,
    }
}



export interface entityLocation {
    position: {x: number, y: number, z: number},
    facing: {x: number, y: number, z: number},
}