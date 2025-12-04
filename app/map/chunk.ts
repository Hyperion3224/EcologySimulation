import { Heightmap } from "../interfaces";
import { ChunkManager } from "./chunkManager";

export default class Chunk{
    chunkSize = 10;
    xOffset: number;
    zOffset: number;
    heightmap: Heightmap;
    constructor(private manager: ChunkManager, xStart: number, zStart: number, chunkSize: number, height_function: (x: number,y: number) => number){
        this.heightmap = {
            coords: [],
            height_function: height_function,
            size: {x: 10, z: 10}
        }
        this.chunkSize = (chunkSize > 10) ? chunkSize : 10;
        this.xOffset = xStart;
        this.zOffset = zStart;
    }

    fillCoords(){
        for(let x = 0 ; x < this.chunkSize; x++){
            for(let z= 0; z < this.chunkSize; z++){
                this.heightmap.coords[x][z] = this.heightmap.height_function(x + this.xOffset,z + this.zOffset);
            }
        }
    }

    randomPos = ()=>{
        const X: number = Math.floor(Math.random() * this.heightmap.size.x + this.xOffset);
        const Z: number = Math.floor(Math.random() * this.heightmap.size.z + this.zOffset);
        const Y: number = this.heightmap.coords[X][Z];
        
        return {x: X, y: Y, z: Z};
    }
}