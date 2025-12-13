'use client';

import Scene from "./scene";
import Configurator from "./Configurator";
import TGEN from "./map/terraingen";
import { World } from "./world";
import { ChunkManager } from "./map/chunkManager";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const [config, setConfig] = useState({
    seed: "JaxonDurken",
    worldHeight: 250,
    worldRadius: 73,
    chunkSize: 40,
  });

  const tgen = useMemo(() => new TGEN(config.seed), [config.seed]);

  const [chunkManager, setChunkManager] = useState<ChunkManager | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const cm = await ChunkManager.create(
        config.worldRadius,
        config.chunkSize,
        (x, z) =>
          tgen.blendTerrains(
            tgen.simplexBiomeMap,
            tgen.plains,
            tgen.hills,
            tgen.mountainous
          )(x, z) * config.worldHeight
      );

      if (!cancelled) setChunkManager(cm);
    })();

    return () => {
      cancelled = true;
    };
  }, [tgen, config.worldRadius, config.chunkSize, config.worldHeight]);

  const world = useMemo(() => {
    if (!chunkManager) return null;
    return new World(chunkManager, config.worldHeight);
  }, [chunkManager, config.worldHeight]);

  return (
    <div>
      <Configurator config={config} setConfig={setConfig} />
      {world && <Scene world={world} />}
    </div>
  );
}
