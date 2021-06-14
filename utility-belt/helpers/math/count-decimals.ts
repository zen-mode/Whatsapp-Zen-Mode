/**
 * @description: .
 * @exampleInput:
 * @exampleOutput:
 * @sideEffects:
 * @hasTests:
 */
// https://stackoverflow.com/a/17369384/4507580
export function count_decimals(value: number): number {
  return value % 1 ? value.toString().split(".")[1].length : 0;
  // TODO: indicate whether function is pure and has tests; delete this line
}
