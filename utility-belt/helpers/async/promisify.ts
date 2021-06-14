import {GenericFn} from "../../types/generic-types";

/**
 * @description: Transforms a fn requiring a callback into a Promise.
 * @exampleInput: fs.readFile .
 * @exampleOutput: Promise .
 * @sideEffects: No.
 * @hasTests: false.
 */
// https://javascript.info/promisify
export function promisify(fn: GenericFn, manyArgs = false) {
  return async function (...args: unknown[]): Promise<unknown> {
    // return a wrapper-function (*)
    return new Promise((resolve, reject) => {
      function callback(err: Error | undefined, results: unknown[]) {
        // our custom callback for f (**)
        if (err) {
          reject(err);
        } else {
          resolve(manyArgs ? results : results[0]);
        }
      }

      // eslint-disable-next-line functional/immutable-data
      args.push(callback); // append our custom callback to the end of f arguments

      fn.call(this, ...args); // call the original function
    });
  };
}
