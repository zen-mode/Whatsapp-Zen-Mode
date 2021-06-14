import {devprint} from "../debug/devprint";

import {GenericFn} from "../../types/generic-types";

export function pipe(valueBeingPiped: unknown, printInterimResults?: true): PipeFn {
  return {
    // eslint-disable-next-line functional/functional-parameters
    thru(...functionsToApplyOnValue: GenericFn[]) {
      // let interimResult = functionsToApplyOnValue[0](valueBeingPiped);

      // eslint-disable-next-line functional/no-let,@typescript-eslint/init-declarations
      let interimResult: unknown;
      if (printInterimResults) {
        devprint(`Piping...`, interimResult);
      }

      functionsToApplyOnValue.forEach((fn, idx) => {
        // To fold return values we have to get 1st interim result first.
        if (idx === 0) {
          interimResult = fn(valueBeingPiped);
        }
        // if (idx === 0) {return void 0;}
        interimResult = pipe(fn(interimResult)).fold();
      });
      return interimResult;
    },

    //хер его знает, че он делает, но без него '.thru' не пашет...
    fold() {
      return valueBeingPiped;
    },
  };
}

type PipeFn = {
  readonly thru: (...args: GenericFn[]) => unknown;
  readonly fold: GenericFn;
};
