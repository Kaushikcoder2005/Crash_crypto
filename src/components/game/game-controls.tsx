"use client";

import { useGame } from "@/contexts/game-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BitcoinIcon } from "../icons/bitcoin";
import { EthereumIcon } from "../icons/ethereum";
import { cn } from "@/lib/utils";

export function GameControls() {
  const {
    gameState,
    placeBet,
    cancelBet,
    cashOut,
    betAmount,
    setBetAmount,
    crypto,
    setCrypto,
    userBet,
    multiplier,
  } = useGame();

  const handlePlaceBet = () => {
    const amount = parseFloat(betAmount);
    if (!isNaN(amount) && amount > 0) {
      placeBet(amount, crypto);
    }
  };

  const isBettingPhase = gameState === "BETTING";
  const isRunningPhase = gameState === "RUNNING";
  const hasPlacedBet = !!userBet;
  const hasCashedOut = hasPlacedBet && userBet.cashOutMultiplier;

  const getButtonState = () => {
    if (isBettingPhase) {
      return hasPlacedBet
        ? {
            text: "Cancel Bet",
            onClick: cancelBet,
            variant: "outline" as const,
            disabled: false,
          }
        : {
            text: "Place Bet",
            onClick: handlePlaceBet,
            variant: "default" as const,
            disabled: !betAmount || parseFloat(betAmount) <= 0,
          };
    }
    if (isRunningPhase && hasPlacedBet && !hasCashedOut) {
      return {
        text: `Cash Out @ ${multiplier.toFixed(2)}x`,
        onClick: cashOut,
        variant: "accent" as const,
        disabled: false,
      };
    }
    return {
      text: "Waiting for next round...",
      onClick: () => {},
      variant: "secondary" as const,
      disabled: true,
    };
  };

  const { text, onClick, variant, disabled } = getButtonState();

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bet-amount">Bet Amount (USD)</Label>
          <Input
            id="bet-amount"
            type="number"
            placeholder="10.00"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            disabled={!isBettingPhase || hasPlacedBet}
            min="0.01"
            step="0.01"
          />
        </div>
        <div className="space-y-2">
          <Label>Currency</Label>
          <ToggleGroup
            type="single"
            value={crypto}
            onValueChange={(value) => setCrypto(value as "BTC" | "ETH")}
            className="w-full grid grid-cols-2"
            disabled={!isBettingPhase || hasPlacedBet}
          >
            <ToggleGroupItem value="BTC" aria-label="Select Bitcoin" className="h-12 gap-2">
              <BitcoinIcon className="w-6 h-6" />
              <span>BTC</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="ETH" aria-label="Select Ethereum" className="h-12 gap-2">
              <EthereumIcon className="w-6 h-6" />
              <span>ETH</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <Button
          onClick={onClick}
          disabled={disabled}
          className={cn(
            "w-full h-14 text-lg font-bold transition-all duration-200",
            variant === "accent" && "bg-accent text-accent-foreground hover:bg-accent/90"
          )}
        >
          {text}
        </Button>
      </CardContent>
    </Card>
  );
}
