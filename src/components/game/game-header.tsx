"use client";

import { useGame } from "@/contexts/game-context";
import { Button } from "@/components/ui/button";
import { ProvablyFairDialog } from "./provably-fair-dialog";
import { Logo } from "../icons/logo";
import { Wallet } from "lucide-react";

export function GameHeader() {
  const { balance } = useGame();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-3">
        <Logo className="w-10 h-10 text-primary" />
        <h1 className="text-2xl sm:text-3xl font-bold font-headline text-foreground">
          Crash Crypto
        </h1>
      </div>
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="flex-1 sm:flex-none flex items-center gap-2 p-2 px-4 rounded-lg bg-card border">
          <Wallet className="w-5 h-5 text-muted-foreground" />
          <span className="text-lg font-semibold tabular-nums">
            ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <ProvablyFairDialog />
      </div>
    </div>
  );
}
