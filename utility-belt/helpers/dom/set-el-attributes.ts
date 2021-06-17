/**
 * @description: Sets attributes of DOM element.
 * @exampleInput:  <input />, {type: 'password', disabled: ''}
 * @exampleOutput: <input type='password', disabled />
 * @sideEffects: DOM mutation
 * @hasTests: Yes
 */

export function set_el_attributes<T>(
  el: T,
  attributes: Record<string, string[] | number | string>,
): T {
  Object.entries(attributes).forEach((entry) => {
    // Explain: TS has incorrect typings for .setAttribute.
    // @ts-ignore
    el.setAttribute(...entry);
  });

  return el;
}
