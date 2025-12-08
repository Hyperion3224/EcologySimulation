import Chunk from "./chunk";
import { Queue } from '../utilities'

export class ChunkManager {
    chunks: Chunk[] = [];
    chunkLoadQueue = new Queue<Chunk>()
    maxSideLength: number;
    chunkSize: number;
    height_function: any;

    constructor(sideLen: number, chunkSize: number, height_function: (x:number, z:number) => number){
        this.maxSideLength = sideLen;
        this.chunkSize = chunkSize;
        this.height_function = height_function;

        this.generateChunks();
    }

    async generateChunks(){
        const centerChunk = new Chunk(this,0,0,this.chunkSize,this.height_function);
        this.chunks.push(centerChunk);
        this.chunkLoadQueue.push(centerChunk);
        
        if(this.maxSideLength == 1){return};

        for(let len = 0; len < (this.maxSideLength)/2; len++){
            for(let i = 0; i < 2*len; i++){
                const csLen = this.chunkSize * len;
                const dCSILen = this.chunkSize * i - csLen;

                const IChunk = new Chunk(this,dCSILen,csLen,this.chunkSize,this.height_function);
                const IIChunk = new Chunk(this,csLen,-dCSILen,this.chunkSize,this.height_function);
                const IIIChunk = new Chunk(this,-csLen,dCSILen,this.chunkSize,this.height_function);
                const IVChunk = new Chunk(this,-dCSILen,-csLen,this.chunkSize,this.height_function);

                this.chunks.push(IChunk);
                this.chunks.push(IIChunk);
                this.chunks.push(IIIChunk);
                this.chunks.push(IVChunk);

                this.chunkLoadQueue.push(IChunk);
                this.chunkLoadQueue.push(IIChunk);
                this.chunkLoadQueue.push(IIIChunk);
                this.chunkLoadQueue.push(IVChunk);
            }
        }

        console.log(this.chunks.length);
    }

    randomPos(): {x: number, y: number, z: number} {
        const xSign = (Math.random() > .5)? -1: 1;
        const zSign = (Math.random() > .5)? -1: 1;
        const X = Math.random()*((1/2)*this.maxSideLength*this.chunkSize*xSign);
        const Z = Math.random()*((1/2)*this.maxSideLength*this.chunkSize*zSign);
        const pos = {
            x: X, 
            y: this.height_function(X,Z), 
            z: Z
        }

        return pos;
    }
}