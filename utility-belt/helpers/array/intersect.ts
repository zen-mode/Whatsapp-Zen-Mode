/**
 * @description: Tests wheather two arrays have same members.
 * @exampleInput:  ["a", "b"], ["x", "y", "b"] | ["a", "b"], ["x", "y", "bb"]
 * @exampleOutput: true                        | false
 * @sideEffects: no
 * @hasTests: no
 */
export function intersect(arr1: unknown[], arr2: unknown[]): boolean {
  return Boolean(arr1.filter((element) => arr2.includes(element)).length);
}

// Explain: Didnt implement this because testing for member objects and arrays is non-trivial. Use .filter() .
// /**
//  * @description: Returns intersecting members.
//  * @exampleInput:  ["a", "b"], ["x", "y", "b"] | ["a", "b"], ["x", "y", "bb"]
//  * @exampleOutput: true                        | false
//  * @sideEffects: no
//  * @hasTests: no
//  */
// export function get_intersecting_members(arr1: unknown[], arr2: unknown[]): boolean {
//   return Boolean(arr1.filter((element) => arr2.includes(element)).length);
// }
