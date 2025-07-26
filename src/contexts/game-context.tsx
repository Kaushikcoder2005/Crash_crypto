"use client";

import React, { createContext, useContext, useState, useEffect, useReducer, ReactNode, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { generateCrashPoint } from '@/lib/game-logic';

// --- TYPES ---
export type GameState = "BETTING" | "RUNNING" | "CRASHED";
export type CryptoCurrency = "BTC" | "ETH";

export interface Player {
  id: string;
  name: string;
  isBot: boolean;
}

export interface Bet {
  player: Player;
  amount: number;
  cryptoAmount: number;
  cryptoCurrency: CryptoCurrency;
  cashOutMultiplier?: number;
  payout?: number;
}

export interface GameRound {
  round: number;
  serverSeed: string;
  clientSeed: string;
  crashPoint: number;
}

interface AppState {
  gameState: GameState;
  round: number;
  bets: Bet[];
  history: GameRound[];
  lastRound: GameRound | null;
  countdown: number;
  multiplier: number;
  crashPoint: number;
  serverSeed: string;
  nextServerSeed: string;
}

// --- INITIAL STATE ---
const USER: Player = { id: 'user', name: 'You', isBot: false };
const BOTS: Player[] = [
  { id: 'bot1', name: 'CryptoWhale', isBot: true },
  { id: 'bot2', name: 'Satoshi', isBot: true },
  { id: 'bot3', name: 'ToTheMoon', isBot: true },
  { id: 'bot4', name: 'DiamondHands', isBot: true },
];

const generateSeed = () => Math.random().toString(36).substring(2);

const initialState: AppState = {
  gameState: "BETTING",
  round: 1,
  bets: [],
  history: [],
  lastRound: null,
  countdown: 7,
  multiplier: 1.00,
  crashPoint: 0,
  serverSeed: generateSeed(),
  nextServerSeed: generateSeed(),
};

// --- REDUCER ---
type Action =
  | { type: 'TICK'; payload: { bots: Player[], clientSeed: string, cryptoPrices: Record<CryptoCurrency, number> } }
  | { type: 'PLACE_BET'; payload: { player: Player; amount: number; cryptoAmount: number; cryptoCurrency: CryptoCurrency; } }
  | { type: 'CANCEL_BET' }
  | { type: 'CASH_OUT'; payload: { playerId: string } };

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'TICK': {
      const { bots, clientSeed, cryptoPrices } = action.payload;

      // State transition logic
      if (state.gameState === 'BETTING') {
        const newCountdown = state.countdown - 0.1;
        if (newCountdown <= 0) {
          const crashPoint = generateCrashPoint(state.serverSeed, clientSeed, state.round);
          return { ...state, gameState: 'RUNNING', countdown: 0, crashPoint, multiplier: 1.00 };
        }
        return { ...state, countdown: newCountdown };
      }
      
      if (state.gameState === 'RUNNING') {
        const newMultiplier = state.multiplier * 1.0006;
        if (newMultiplier >= state.crashPoint) {
          // CRASH
          const finalRound: GameRound = { round: state.round, serverSeed: state.serverSeed, clientSeed, crashPoint: state.crashPoint };
          return { ...initialState, gameState: 'CRASHED', round: state.round + 1, lastRound: finalRound, serverSeed: state.nextServerSeed, nextServerSeed: generateSeed(), history: [finalRound, ...state.history].slice(0, 20), bets: state.bets };
        }

        // Bot cash out logic
        const newBets = state.bets.map(bet => {
            if (bet.player.isBot && !bet.cashOutMultiplier) {
                const cashOutChance = Math.random();
                if (cashOutChance < 0.01) { // 1% chance per tick to cash out
                    const payout = bet.amount * newMultiplier;
                    return { ...bet, cashOutMultiplier: newMultiplier, payout };
                }
            }
            return bet;
        });

        return { ...state, multiplier: newMultiplier, bets: newBets };
      }

      if (state.gameState === 'CRASHED') {
        const newCountdown = state.countdown + 0.1;
        if (newCountdown >= 4) { // 4 second crashed state
          // START NEW ROUND
          let newBets = bots.filter(() => Math.random() < 0.5).map(bot => {
            const amount = Math.floor(Math.random() * 50) + 5;
            const cryptoCurrency = Math.random() < 0.5 ? "BTC" : "ETH";
            return {
                player: bot,
                amount,
                cryptoAmount: amount / cryptoPrices[cryptoCurrency],
                cryptoCurrency,
            }
          });
          return { ...initialState, bets: newBets };
        }
        return { ...state, countdown: newCountdown, multiplier: state.crashPoint };
      }

      return state;
    }
    case 'PLACE_BET':
      return { ...state, bets: [...state.bets, action.payload] };
    case 'CANCEL_BET':
      return { ...state, bets: state.bets.filter(b => b.player.id !== USER.id) };
    case 'CASH_OUT': {
        const bet = state.bets.find(b => b.player.id === action.payload.playerId);
        if (!bet) return state;
        const payout = bet.amount * state.multiplier;
        const newBets = state.bets.map(b => b.player.id === action.payload.playerId ? { ...b, cashOutMultiplier: state.multiplier, payout } : b);
        return { ...state, bets: newBets };
    }
    default:
      return state;
  }
};

// --- CONTEXT ---
interface GameContextType {
  gameState: GameState;
  balance: number;
  setBalance: (balance: number) => void;
  countdown: number;
  multiplier: number;
  bets: Bet[];
  history: GameRound[];
  lastRound: GameRound | null;
  userBet: Bet | undefined;
  cryptoPrices: Record<CryptoCurrency, number>;
  crypto: CryptoCurrency;
  setCrypto: (c: CryptoCurrency) => void;
  betAmount: string;
  setBetAmount: (a: string) => void;
  clientSeed: string;
  setClientSeed: (s: string) => void;
  placeBet: (amount: number, currency: CryptoCurrency) => void;
  cancelBet: () => void;
  cashOut: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// --- PROVIDER ---
export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState("10.00");
  const [crypto, setCrypto] = useState<CryptoCurrency>("BTC");
  const [clientSeed, setClientSeed] = useState(generateSeed());
  const { toast } = useToast();

  const cryptoPrices: Record<CryptoCurrency, number> = { BTC: 60000, ETH: 3000 };

  useEffect(() => {
    const gameTick = setInterval(() => {
      dispatch({ type: 'TICK', payload: { bots: BOTS, clientSeed, cryptoPrices } });
    }, 100);
    return () => clearInterval(gameTick);
  }, [clientSeed, cryptoPrices]);
  
  const placeBet = useCallback((amount: number, currency: CryptoCurrency) => {
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      const cryptoAmount = amount / cryptoPrices[currency];
      dispatch({ type: 'PLACE_BET', payload: { player: USER, amount, cryptoAmount, cryptoCurrency: currency } });
    } else {
      toast({ variant: "destructive", title: "Insufficient funds" });
    }
  }, [balance, cryptoPrices, toast]);

  const cancelBet = useCallback(() => {
    const bet = state.bets.find(b => b.player.id === USER.id);
    if(bet) {
      setBalance(prev => prev + bet.amount);
      dispatch({ type: 'CANCEL_BET' });
    }
  }, [state.bets]);
  
  const cashOut = useCallback(() => {
    const bet = state.bets.find(b => b.player.id === USER.id && !b.cashOutMultiplier);
    if(bet) {
      const payout = bet.amount * state.multiplier;
      setBalance(prev => prev + payout);
      dispatch({ type: 'CASH_OUT', payload: { playerId: USER.id } });
      toast({
        title: "Success!",
        description: `You cashed out at ${state.multiplier.toFixed(2)}x for $${payout.toFixed(2)}.`,
      });
    }
  }, [state.bets, state.multiplier, toast]);
  
  const userBet = state.bets.find(b => b.player.id === 'user');

  const value = {
    ...state,
    balance, setBalance,
    userBet,
    cryptoPrices,
    crypto, setCrypto,
    betAmount, setBetAmount,
    clientSeed, setClientSeed,
    placeBet,
    cancelBet,
    cashOut,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// --- HOOK ---
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
