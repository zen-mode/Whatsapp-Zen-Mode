/**
 * @description: Creates a number array with specified start, end and increment step
 * @exampleInput: 0, 10, 3
 * @exampleOutput: [0, 3, 6, 9]
 * @hasTests: false
 */
export function create_number_populated_array(
  startValue: number,
  endValue: number,
  step = 1
): ReadonlyArray<number> {
  return Array.from(
    {length: (endValue - startValue) / step + 1},
    (_, i) => startValue + i * step
    /*eslint-enable no-mixed-operators, id-length*/
  );
}
