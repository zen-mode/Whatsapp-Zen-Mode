/**
 * @description: Sets style attributes of DOM element.
 * @exampleInput:  <div />, {display: 'flex'}
 * @exampleOutput: <div style='display: flex;'></div>
 * @sideEffects: DOM mutation
 * @hasTests: false
 */

export function set_el_style<T>(el: T, styleObj: Record<string, string>): T {
  Object.entries(styleObj).forEach((entry) => el.style.setProperty(...entry));
  return el;
}
