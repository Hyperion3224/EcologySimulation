export interface entity{
    id: number,
    species: string, 
    location : entityLocation,
}

export interface entityLocation {
    position: {x: number, y: number, z: number},
    facing: {x: number, y: number, z: number},
}