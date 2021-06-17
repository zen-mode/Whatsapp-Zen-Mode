/* eslint-disable no-shadow */
import {async_forEach_in_sequence} from "./for-each";

export const async_map_sequentially_over = async_map_sequentially;
export const async_map_in_parallel_over = async_map_in_parallel;

/**
 * @description: Runs an async function over an iterable.
 * Each new iteration waits for the prev one to finish.
 * Retuns an array of results of each execution.
 * @exampleInput: [1, 2, 3], (item,idx, arr) => {await sleep(1000); console.log( item + idx); return 10}
 * @exampleOutput:
 * 1000ms waiting
 * console.log(1)
 * 1000ms waiting
 * console.log(3)
 * 1000ms waiting
 * console.log(5)
 * result = [10, 10, 10]
 * @sideEffects: no; callback fn: potentially any
 * @hasTests: false
 */
export async function async_map_sequentially<T>(
  iterable: readonly T[],
  fn: Function,
): Promise<T[]> {
  // eslint-disable-next-line prefer-const,fp/no-let
  let results = [];
  await async_forEach_in_sequence(iterable, async (iteratee, idx, iterable) => {
    const result = await fn(iteratee, idx, iterable);
    // eslint-disable-next-line fp/no-mutating-methods
    results.push(result);
  });
  return results;
  // TODO: indicate whether function is pure and has tests; delete this line
}

/**
 * @description: Runs an async function over an iterable.
 * All iterations run in parallel. Result is delivered when ALL of the iterations have finished execution.
 * Retuns an array of results of each execution.
 * @exampleInput: [1, 2, 3], (item,idx, arr)=>{await sleep(1000); console.log( item + idx); return 10}
 * @exampleOutput:
 * console.log(1)
 * console.log(3)
 * console.log(5)
 * 1005ms waiting (5ms - is a cerca exemplary time to switch bw execution cycles)
 * result = [10, 10, 10]
 * @sideEffects: no; callback fn: potentially any
 * @hasTests: false
 */

// eslint-disable-next-line require-await
export async function async_map_in_parallel<T>(
  iterable: readonly T[],
  fn: Function,
): Promise<any> {
  return Promise.all(
    iterable.map((iteratee, idx, iterable) => fn(iteratee, idx, iterable)),
  );
}
