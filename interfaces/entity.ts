export interface entity{
    id: number,
    health: number,
    species: string, 
    genome: number[],

    species_averages: number[],
    variance: number,

    speed: number,
    strength: number,
    fertility: number,
    size: number,
    energy: number,
    sight: number, 
    locality_preferance: {x: number, y: number, z: number},
}