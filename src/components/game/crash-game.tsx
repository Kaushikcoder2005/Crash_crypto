"use client";

import { GameControls } from "./game-controls";
import { GameDisplay } from "./game-display";
import { GameHistory } from "./game-history";
import { GameHeader } from "./game-header";

export function CrashGame() {
  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-4 sm:gap-6">
      <GameHeader />
      <GameHistory />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 xl:col-span-3">
          <GameControls />
        </div>
        <div className="col-span-12 lg:col-span-8 xl:col-span-9">
          <GameDisplay />
        </div>
      </div>
    </div>
  );
}
