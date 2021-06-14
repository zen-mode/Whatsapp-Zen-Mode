/**
 * @description: Async equivalent of Array.forEach.
 *               Waits for each callback execution to finish before starting the next iteration.
 * @exampleInput: [1, 2, 3], (item, idx, arr) => post_data_to_remote_endpoint_one_by_one(item)
 * @exampleOutput: Promise<undefined>
 * @sideEffects: no; callback fn: potentially any
 * @hasTests: false
 */
import {async_map_in_parallel} from "./map";

export async function async_forEach_in_sequence<T>(
  iterable: T[],
  fn: (arg1: T, arg2: number, arg3: T[]) => Promise<unknown>,
): Promise<void> {
  // todo-4: switch to for-of when have tests
  // eslint-disable-next-line functional/no-loop-statement,functional/no-let
  for (let index = 0; index < iterable.length; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    await fn(iterable[index], index, iterable);
  }
}

/*function sequence(array, fn) {
  return array.reduce((p, item) => {
    return p.then(() => {
      return fn(item);
    });
  }, Promise.resolve());
}*/

/**
 * @description: Async equivalent of Array.forEach.
 *               Does not wait for callback execution to finish before starting the next iteration.
 * @exampleInput: [1, 2, 3], (item, idx, arr) => post_data_to_remote_endpoint(item)
 * @exampleOutput: Promise<undefined>
 * @sideEffects: no; callback fn: potentially any
 * @hasTests: false
 */
export async function async_forEach_in_parallel<T>(
  iterable: ReadonlyArray<T>,
  fn: Function,
): Promise<undefined> {
  await async_map_in_parallel(iterable, fn);
  return undefined;
}
