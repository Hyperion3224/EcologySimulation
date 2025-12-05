import Chunk from "./chunk";

export class ChunkManager {
    chunks: Chunk[] = [];
    maxSideLength: number;
    chunkSize: number;
    height_function: any;

    constructor(sideLen: number, chunkSize: number, height_function: (x:number, z:number) => number){
        this.maxSideLength = sideLen;
        this.chunkSize = chunkSize;
        this.height_function = height_function;

        this.generateChunks();
    }

    generateChunks(){
        this.chunks.push(new Chunk(this,0,0,this.chunkSize,this.height_function));
        for(let len = 0; len < (this.maxSideLength)/2; len++){
            for(let i = 0; i < 2*len; i++){
                const csLen = this.chunkSize * len;
                const dCSILen = this.chunkSize * i - csLen;

                this.chunks.push(new Chunk(this,dCSILen,csLen,this.chunkSize,this.height_function));
                this.chunks.push(new Chunk(this,csLen,-dCSILen,this.chunkSize,this.height_function));
                this.chunks.push(new Chunk(this,-csLen,dCSILen,this.chunkSize,this.height_function));
                this.chunks.push(new Chunk(this,-dCSILen,-csLen,this.chunkSize,this.height_function));
            }
        }

        console.log(this.chunks.length);
    }

    randomPos(){
        const chunk: Chunk = this.chunks[Math.floor(Math.random()*this.chunks.length)];
        return chunk.randomPos();
    }
}