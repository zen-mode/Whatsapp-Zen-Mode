export default function pick_random_NP_from<T>(array: ReadonlyArray<T>): T {
  return pick_random_NP(array);
}

/**
 * @description: Returns a random item from an array.
 * @exampleInput:  ["Hey", "Howdy", "Hello There", "Wotcha", "Alright gov'nor"]
 * @exampleOutput: "Alright gov'nor"
 * @sideEffects: no; still not pure because returns random item.
 * @hasTests: false
 */
export function pick_random_NP<T>(array: ReadonlyArray<T>): T {
  return array[Math.floor(Math.random() * array.length)];
}
