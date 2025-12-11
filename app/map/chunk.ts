import { EntityBase } from "../entities/entity.base";
import { Heightmap } from "../interfaces";
import { ChunkManager } from "./chunkManager";

export default class Chunk{
    chunkSize = 10;
    xOffset: number;
    zOffset: number;
    heightmap: Heightmap;
    entities: EntityBase[] = [];
    chunkPosition: {x: number, z: number};

    constructor(private manager: ChunkManager, xStart: number, zStart: number, chunkSize: number, height_function: (x: number,y: number) => number){
        this.heightmap = {
            coords: [],
            height_function: height_function,
            size: {x: 10, z: 10}
        }
        this.chunkSize = (chunkSize > 10) ? chunkSize : 10;
        this.xOffset = xStart;
        this.zOffset = zStart;
        this.chunkPosition = {x: this.xOffset, z: this.zOffset};
    }

    private async initialize(): Promise<Chunk>{
        this.heightmap.coords = Array.from({ length: this.chunkSize }, () =>
            Array(this.chunkSize).fill(0)
        );

        for(let x = 0 ; x < this.chunkSize; x++){
            for(let z= 0; z < this.chunkSize; z++){
                this.heightmap.coords[x][z] = this.heightmap.height_function(x + this.xOffset,z + this.zOffset);
            }
        }

        return this;
    }

    static async create(manager: ChunkManager, xStart: number, zStart: number, chunkSize: number, height_function: (x: number,y: number) => number){
        const chunk = new Chunk(manager, xStart, zStart, chunkSize, height_function);
        await chunk.initialize();
        return chunk;
    }

    get sideLength():number         {return this.chunkSize}

}