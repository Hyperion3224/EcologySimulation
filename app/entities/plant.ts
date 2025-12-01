import { EntityBase } from "./entity.base";
import Stat, { stat } from "../interfaces/stat";
import { entityLocation } from "../interfaces";

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

    get growthRate()        { return this.stats.growth_rate; }
    get reproductionRate()  { return this.stats.reproduction_rate; }
    // etc, or skip getters entirely if you prefer stats["growth_rate"]
}
