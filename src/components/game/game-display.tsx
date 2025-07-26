"use client";

import { useGame, type Bet } from "@/contexts/game-context";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { User, Bot } from "lucide-react";

export function GameDisplay() {
  const { gameState, multiplier, countdown, bets, cryptoPrices } = useGame();

  const getMultiplierColor = () => {
    if (gameState === "CRASHED") return "text-destructive";
    if (multiplier < 2) return "text-primary";
    if (multiplier < 5) return "text-green-500";
    if (multiplier < 10) return "text-yellow-500";
    return "text-orange-500";
  };
  
  const getPotentialWinnings = (bet: Bet) => {
    if (bet.cashOutMultiplier) {
      return bet.payout?.toFixed(2);
    }
    const winnings = bet.amount * multiplier;
    return winnings.toFixed(2);
  };

  const renderContent = () => {
    if (gameState === "BETTING") {
      return (
        <div className="text-center">
          <p className="text-2xl text-muted-foreground font-light">Next round in</p>
          <p className="text-7xl font-bold font-headline">
            {countdown.toFixed(1)}s
          </p>
        </div>
      );
    }

    return (
      <div className="text-center">
        {gameState === "CRASHED" && (
            <p className="text-2xl text-destructive font-light font-headline">CRASHED @</p>
        )}
        <p className={cn(
            "text-8xl font-bold font-headline transition-colors duration-300",
            getMultiplierColor()
          )}>
          {multiplier.toFixed(2)}x
        </p>
      </div>
    );
  };

  return (
    <Card className="flex flex-col h-full min-h-[400px] lg:min-h-[500px]">
      <div className="relative flex-1 flex items-center justify-center p-6 bg-card-foreground/5 dark:bg-card-foreground/10 rounded-t-lg">
        {renderContent()}
      </div>
      <Separator />
      <CardContent className="p-0 flex-grow">
        <ScrollArea className="h-[250px]">
          <div className="p-4 space-y-2">
            <div className="grid grid-cols-3 gap-4 text-sm font-semibold text-muted-foreground px-2">
              <div>Player</div>
              <div className="text-right">Bet (USD)</div>
              <div className="text-right">Payout</div>
            </div>
            {bets.map((bet) => (
              <div
                key={bet.player.id}
                className={cn(
                  "grid grid-cols-3 gap-4 p-2 rounded-md transition-colors",
                  bet.cashOutMultiplier ? "bg-accent/50" : "bg-transparent",
                  bet.player.id === 'user' && 'font-bold'
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  {bet.player.isBot ? <Bot className="w-4 h-4 text-muted-foreground" /> : <User className="w-4 h-4 text-primary" />}
                  <span className="truncate">{bet.player.name}</span>
                </div>
                <div className="text-right">
                  ${bet.amount.toFixed(2)}
                </div>
                <div className="text-right">
                  {bet.cashOutMultiplier
                    ? `${bet.cashOutMultiplier.toFixed(2)}x`
                    : gameState === "RUNNING"
                    ? `$${(bet.amount * multiplier).toFixed(2)}`
                    : "-"}
                </div>
              </div>
            ))}
            {bets.length === 0 && (
                <div className="text-center text-muted-foreground py-10">
                    No bets placed for this round.
                </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
