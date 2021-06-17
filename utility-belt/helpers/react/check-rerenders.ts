import {ReactElement} from "react";

import {env_is} from "../env/env";

/**
 * @description: Wraps React functional component with a lib that checks for unnecessary re-renders.
 * @exampleInput: <React functional component>
 * @exampleOutput: void
 * @sideEffects: no
 * @hasTests: false
 */
declare interface IRerenderCheckingComponent extends ReactElement {
  whyDidYouRender?: true;
}

export function check_for_excessive_rerenders(
  component: any,
  // component: (arg0: any) => ReactElement,
): void {
  if (env_is.dev())
    // eslint-disable-next-line no-param-reassign,functional/immutable-data
    component.whyDidYouRender = true;
}
