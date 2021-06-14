/* eslint-disable id-match,no-magic-numbers,func-style */
/**
 * @description: Emulates wait \ delay functinality by waiting for a Promise to resolve.
 * @exampleInput: 500
 * @exampleOutput: Promise that resolves in 500 ms
 * @sideEffects: no
 * @hasTests: false
 */
export async function wait_for_ms(time: number): Promise<void> {
  // prettier-ignore
  // eslint-disable-next-line promise/avoid-new
  return new Promise((resolve) => setTimeout(resolve, time));
}

export const for_10ms = async (): Promise<void> => wait_for_ms(10);
export const for_100ms = async (): Promise<void> => wait_for_ms(100);
export const for_500ms = async (): Promise<void> => wait_for_ms(500);
export const for_1sec = async (): Promise<void> => wait_for_ms(1000);
export const for_2sec = async (): Promise<void> => wait_for_ms(2000);
export const for_3sec = async (): Promise<void> => wait_for_ms(3000);
export const for_5sec = async (): Promise<void> => wait_for_ms(5000);

/**
 * @description: Runs a given fn every {pollMs}; does this for {waitMs}.
 *               If within {waitMs} the fn returns true - returns true.
 *               Otherwise returns null.
 * @exampleInput:  (n)=> n===1, [1] | (n)=> n===1, [2]
 * @exampleOutput: Promise<true>    | Promise<null>
 * @sideEffects: possible side-effects in fn
 * @hasTests: no
 */
export async function wait_for_fn_to_return_true<T>(
  fn: (...args: T[]) => boolean,
  fnArgs?: T[],
  waitMs = 3000,
  pollMs = 100,
): Promise<true | null> {
  return new Promise((resolve) => {
    // Explain: This interval timer checks for fn to return true every 100ms;
    // if found - resolves the promise with Element and clears overall timer.
    const intervalHandle = setInterval(() => {
      const result = fnArgs ? fn(...fnArgs) : fn();
      if (result) {
        clearInterval(intervalHandle);
        clearTimeout(timeoutHandle);
        resolve(true);
      }
    }, pollMs);

    // Explain: This overall timer waits for 3000ms; if by that time fn has not ...
    // returned true - resolves the promise with null and clears interval timer.
    const timeoutHandle = setTimeout(() => {
      clearInterval(intervalHandle);
      resolve(null);
    }, waitMs);
  });
}
