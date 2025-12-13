import { EntityBase } from "./entities/entity.base"
import { Plant } from "./entities/plant";
import { Test } from "./entities/test";
import { ChunkManager } from "./map/chunkManager";
import { makeRecord } from "./utilities";

export class World {
    entities: Record<string, EntityBase[]>;
    chunkManager: ChunkManager;
    height: number;

    constructor(chunkManager: ChunkManager, worldHeight: number){
        this.height = worldHeight * 2;
        this.chunkManager = chunkManager;

        const all_entity_types = [
            "test",
            "herb",
            "omni",
            "carn",
            "plant"
        ]

        this.entities = makeRecord(all_entity_types, () => [])
    }

    private async chunkManagerInit(sideLen: number, chunkSize: number, heightFn: (x:number, z:number) => number){
        this.chunkManager = await ChunkManager.create(sideLen, chunkSize,heightFn)
    }

    getEntitiesInRadiusOf(target: {x:number, y:number, z:number}, radius: number): EntityBase[]{
        return this.allEntities.filter((entity) => {
            const location = entity.position;
            const dx = location.x - target.x;
            const dy = location.y - target.y;
            const dz = location.z - target.z;

            if(Math.sqrt(dx*dx + dy*dy + dz*dz) <= radius){
                return entity;
            }
        })
    }

    tick():void {
        this.allEntities.map((entity) => {
            entity.tick(this);
        })
    }

    addTest(num:number){
        const lastIndex = this.tests.length;
        for(let i = 0; i < num; i++){
            this.tests.push(Test.createTest((lastIndex+i), {position: this.randomPos, facing: this.randomPos}))
        }
    }

    get plants()    { return this.entities.plant}
    get herbs()     { return this.entities.herb}
    get omnis()     { return this.entities.omni}
    get carns()     { return this.entities.carn}
    get tests()     { return this.entities.test}
    get size()      { return (this.chunkManager)? this.chunkManager.maxSideLength * this.chunkManager.chunkSize : 0};
    get xCenter()   { return this.size/2};
    get zCenter()   { return this.size/2};
    get randomPos() { return (this.chunkManager)? this.chunkManager.randomPos() : {x: 0, y: 0, z: 0}}
    get allEntities()  { return ([] as EntityBase[]).concat(
        this.plants, this.herbs, this.omnis, this.carns, this.tests)}
}