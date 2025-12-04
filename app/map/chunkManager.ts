import Chunk from "./chunk";

export class ChunkManager {
    chunks: Chunk[] = [];
    maxSideLength: number;
    chunkSize: number;
    height_function: any;

    constructor(sideLen: number, chunkSize: number, height_function: (x:number, y:number) => number){
        this.maxSideLength = sideLen;
        this.chunkSize = chunkSize;
        this.height_function = height_function;

        this.generateChunks();
    }

    generateChunks(){
        const midPoint = this.chunkSize/2;
        this.chunks.push(new Chunk(this,0,0,this.chunkSize,this.height_function));
        for(let len = 0; len < this.chunkSize; len+=2){
            for(let i = 0; i <= len; i++){
                const csLen = this.chunkSize * len;
                const csI = this.chunkSize * i;

                const dCSILen = csI - csLen;

                this.chunks.push(new Chunk(this,dCSILen,csLen,this.chunkSize,this.height_function));
                this.chunks.push(new Chunk(this,csLen,-dCSILen,this.chunkSize,this.height_function));
                this.chunks.push(new Chunk(this,-csLen,dCSILen,this.chunkSize,this.height_function));
                this.chunks.push(new Chunk(this,-dCSILen,csLen,this.chunkSize,this.height_function));
            }
        }
    }

    randomPos():{

    }
}