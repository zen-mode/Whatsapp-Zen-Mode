/**
 * @description: Sets innerText a DOM element.
 * @exampleInput:  <div />, 'Hello Mars!'
 * @exampleOutput: <div>Hello Mars!</div>
 * @sideEffects: DOM mutation.
 * @hasTests: No.
 */

export function set_el_text<T>(el: T, text: string): T {
  // Explain: By design. That's why this fn exists in the 1st place - not to have to ..
  // write this explain over and over again.
  // eslint-disable-next-line functional/immutable-data,no-param-reassign
  el.innerText = text;
  return el;
}
