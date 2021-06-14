import React from "react";

import {StringObject} from "../../types/generic-types";

/**
 * @description: .
 * @exampleInput:
 * @exampleOutput:
 * @sideEffects:
 * @hasTests:
 */
export function create_blank_component_called(
  ComponentName: string,
  wrapperElStyle?: StringObject,
): React.ElementType {
  const registry = {
    [ComponentName]: ({children}: {children: React.ElementType[]}) => (
      <div style={wrapperElStyle}>{children}</div>
    ),
  };

  return registry[ComponentName];
  // TODO: indicate whether function is pure and has tests; delete this line
}
