/**
 * @description: Returns last item of an array.
 * @exampleInput:   [1,2,3] | []
 * @exampleOutput:  3       | undefined
 * @sideEffects: no
 * @hasTests: false
 */
export function get_last_item<T>(array: ReadonlyArray<T>): T | undefined {
  return array[array.length - 1];
}

export function get_last_item_of<T>(array: ReadonlyArray<T>): T | undefined {
  return get_last_item(array);
}
