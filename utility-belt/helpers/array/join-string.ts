/**
 * @description: Joins string array into one string.
 * @exampleInput:  ['a', 'b', 'c']  | ['a', 'b', 'c'], ","
 * @exampleOutput: 'abc'            | 'a,b,c'
 * @sideEffects: no
 * @hasTests: no
 */
export function join(array: ReadonlyArray<string>, joinChar = ""): string {
  return array.join(joinChar);
}
