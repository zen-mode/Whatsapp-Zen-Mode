/**
 * @description: Rounds a float number to a given number of decimals
 * @exampleInput: 83.555, 2
 * @exampleOutput: 83.56
 * @hasTests: false
 */
export function round(value: number, decimalPlaces = 0): number {
  const base = 10;
  const multiplier = Math.pow(base, decimalPlaces);

  return Math.round(value * multiplier + Number.EPSILON) / multiplier;
}
