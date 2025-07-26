import { CrashGame } from "@/components/game/crash-game";
import { GameProvider } from "@/contexts/game-context";

export default function Home() {
  return (
    <GameProvider>
      <main className="flex min-h-screen flex-col items-center justify-center p-2 sm:p-4 lg:p-6">
        <CrashGame />
      </main>
    </GameProvider>
  );
}
