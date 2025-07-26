// A simple hashing function (not cryptographically secure, for simulation only)
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Generates a crash point based on seeds.
export const generateCrashPoint = (serverSeed: string, clientSeed: string, round: number): number => {
  const combinedSeed = `${serverSeed}-${clientSeed}-${round}`;
  const hash = simpleHash(combinedSeed);
  
  // Use the hash to generate a number between 0 and 1
  const determinant = (hash % 10000) / 10000;

  // This formula ensures most results are low, with a small chance of high multipliers.
  // Using a probability distribution that favors smaller numbers.
  // 95% of outcomes will be < 20x, with a long tail for higher values.
  const e = 10000; // Affects max payout
  const houseEdge = 0.99; // 1% house edge
  if (determinant === 1) return e;

  const crashPoint = Math.floor(houseEdge * e / (e - (determinant * e))) / 100 * 100;
  
  return Math.max(1, parseFloat(crashPoint.toFixed(2)));
};
