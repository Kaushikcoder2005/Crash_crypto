"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { useGame } from "@/contexts/game-context";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

export function ProvablyFairDialog() {
  const { lastRound, clientSeed, setClientSeed } = useGame();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span className="hidden sm:inline">Provably Fair</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Provably Fair</DialogTitle>
          <DialogDescription>
            Our game uses a transparent and verifiable algorithm to determine the crash point. The result is calculated before the round starts using a combination of a server seed, a client seed, and the round number.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <p>
            You can change your client seed to influence the outcome. The server seed for the next round is revealed after the current round ends.
          </p>
          <div className="space-y-2">
            <Label htmlFor="client-seed">Your Client Seed</Label>
            <Input id="client-seed" value={clientSeed} onChange={(e) => setClientSeed(e.target.value)} />
          </div>
          <Separator />
          <h3 className="font-semibold">Last Round Details</h3>
          {lastRound ? (
            <div className="space-y-2 p-3 bg-muted rounded-md break-all">
                <p><strong>Round:</strong> {lastRound.round}</p>
                <p><strong>Server Seed:</strong> {lastRound.serverSeed}</p>
                <p><strong>Client Seed:</strong> {lastRound.clientSeed}</p>
                <p><strong>Final Crash Point:</strong> {lastRound.crashPoint.toFixed(2)}x</p>
            </div>
          ) : (
            <p className="text-muted-foreground">Play a round to see the details.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
