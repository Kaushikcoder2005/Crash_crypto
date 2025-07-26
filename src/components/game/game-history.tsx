"use client";

import { useGame } from "@/contexts/game-context";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function GameHistory() {
  const { history } = useGame();

  const getHistoryColor = (multiplier: number) => {
    if (multiplier < 1.1) return "bg-destructive/20 text-destructive hover:bg-destructive/30";
    if (multiplier < 2) return "bg-primary/20 text-primary hover:bg-primary/30";
    return "bg-green-500/20 text-green-500 hover:bg-green-500/30";
  };

  return (
    <div className="w-full">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {history.map((item, index) => (
          <Badge
            key={index}
            variant="outline"
            className={cn(
              "px-3 py-1 text-sm font-semibold border-0",
              getHistoryColor(item.crashPoint)
            )}
          >
            {item.crashPoint.toFixed(2)}x
          </Badge>
        ))}
        {history.length === 0 && <p className="text-sm text-muted-foreground">Game history will appear here.</p>}
      </div>
    </div>
  );
}
