/**
 * @description: Keep only unique values in an array.
 * @exampleInput: [1,2,3,2,3]
 * @exampleOutput: [1,2,3]
 * @sideEffects: no
 * @hasTests: false
 */
export function keep_unique_values<T>(array: readonly T[]): T[] {
  return [...new Set(array)];
}

export const extract_unique_values_from = keep_unique_values;
