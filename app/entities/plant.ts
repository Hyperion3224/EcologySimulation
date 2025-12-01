import { EntityBase } from "./entity.base";
import Stat, { stat } from "../interfaces/stat";
import { entityLocation } from "../interfaces";
import { World } from "../world";

export type PlantStatKey =
    | "growth_rate"
    | "reproduction_rate"
    | "spread_radius"
    | "reproduction_radius"
    | "mortality"
    | "palatability";

export type PlantStatConfig = Record<PlantStatKey, stat>;

export class Plant extends EntityBase {

    age = 0;
    biomass = 0;
    stats: Record<PlantStatKey, Stat>;

    constructor(
        id: number,
        location: entityLocation,
        statConfig: PlantStatConfig
    ) {
        super({ id, species: "plant", location });

        this.stats = Object.fromEntries(
            Object.entries(statConfig).map(([k, v]) => [k, new Stat(v)])
        ) as Record<PlantStatKey, Stat>;
    }

    get growthRate()            { return this.stats.growth_rate.value; }
    get reproductionRate()      { return this.stats.reproduction_rate.value; }
    get spreadRadius()          { return this.stats.spread_radius.value; }
    get reproductionRadius()    { return this.stats.reproduction_radius.value; }
    get mortality()             { return this.stats.mortality.value; }
    get palatibility()          { return this.stats.palatability.value; }

    static createPlant(_id: number, _location: entityLocation, psc: PlantStatConfig): Plant {
        return new Plant(_id, _location, psc);
    }

    tick(world: World): number{
        return this.tryReproduce(world) > 0 ? 1: -1;
    }

    tryReproduce(world: World): number {
        // const EntitiesNearby = gb.entitiesWithinRadius(this.getLocation(), this.reproductionRadius);
        // if (EntitiesNearby == null){
        //     return -1;
        // } else if(typeof EntitiesNearby == EntityBase)
        return -1
    }
}
