import { useDeferredInput } from "./useDeferredInput";
import type { Config } from "../interfaces";
import { useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

type configuratorProps = {
  config: Config;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
}

export default function Configurator({ config }: configuratorProps) {
  const seed = useDeferredInput(config.seed);
  const worldHeight = useDeferredInput(String(config.worldHeight));
  const worldRadius = useDeferredInput(String(config.worldRadius));
  const chunkSize = useDeferredInput(String(config.chunkSize));

  const [isHidden, setIsHidden] = useState(false);

  const toggleHidden = () => {
    setIsHidden(!isHidden);
  }

  function commitAll() {
    if (
      seed.inputValue === config.seed &&
      Number(worldHeight.inputValue) === config.worldHeight &&
      Number(worldRadius.inputValue) === config.worldRadius
    ) {
      return;
    }

    const params = new URLSearchParams({
      seed: seed.inputValue,
      height: worldHeight.inputValue,
      diameter: worldRadius.inputValue,
    });

    window.location.assign(`/?${params.toString()}`);
  }

  return (
    <div className="absolute left-5 top-5">
      <div hidden={isHidden} className="flex flex-col bg-neutral-700/20 p-3 rounded-xl">
        <h1 className="text-2xl">Eco Sim <span className="text-sky-400">v0.0.14</span></h1>

        <div className="flex gap-2">
          <span>Seed:</span>
          <input {...seed.inputProps} onBlur={commitAll} onKeyDown={seed.onEnter()} className="flex-1 border-b border-dotted focus:outline-none focus:ring-0 focus:border-dotted"/>
        </div>

        <div className="flex gap-2">
          <span>World Height:</span>
          <input {...worldHeight.inputProps} onBlur={commitAll} onKeyDown={worldHeight.onEnter()} className="flex-1 border-b border-dotted focus:outline-none focus:ring-0 focus:border-dotted"/>
        </div>

        <div className="flex gap-2">
          <span>World Diameter:</span>
          <input {...worldRadius.inputProps} onBlur={commitAll} onKeyDown={worldRadius.onEnter()} className="flex-1 border-b border-dotted focus:outline-none focus:ring-0 focus:border-dotted"/>
        </div>

        <div className="flex gap-2">
          <span>Chunk Size:</span>
          <input {...chunkSize.inputProps} onBlur={commitAll} onKeyDown={chunkSize.onEnter()} className="flex-1 border-b border-dotted focus:outline-none focus:ring-0 focus:border-dotted"/>
        </div>
      </div>
      <div>
        <div className="border border-white h-px w-full" />
        <button onClick={toggleHidden}>
          {isHidden ? <FaArrowDown /> : <FaArrowUp />}
        </button>
      </div>
    </div>
  );
}
