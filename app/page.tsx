'use client';

import Scene from "./scene";
import Configurator from "./Configurator";
import TGEN from "./map/terraingen";
import { World } from "./world";
import { useState, useMemo } from "react";

export default function Home() {

  const [config, setConfig] = useState({
    seed: "JaxonDurken",
    worldHeight: 250,
    worldRadius: 73,
    chunkSize: 40,
  });

  const tgen = useMemo(() => new TGEN(config.seed), [config.seed]);

  const world = useMemo(
    () =>
      new World(
        config.worldRadius,
        config.chunkSize,
        config.worldHeight,
        (x, z) =>
          tgen.blendTerrains(
            tgen.simplexBiomeMap,
            tgen.plains,
            tgen.hills,
            tgen.mountainous
          )(x, z)
      ),
    [tgen, config.worldRadius, config.worldHeight, config.chunkSize]
  );

  return (
    <div>
      <Configurator
        config={config}
        setConfig={setConfig}
      />
      {world && <Scene world={world} />}
    </div>
  );
}
