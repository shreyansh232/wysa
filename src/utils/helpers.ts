export function generateRandomScore(): number {
  return Math.floor(Math.random() * (100 - 10 + 1)) + 10;
}
