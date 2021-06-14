/**
 * @description: Checks if element 1 is below element 2 in the DOM; if el1 is a child of
 * el2 - it is considered below.
 * @exampleInput:  document.body, document.head | document.head, document.documentElement
 * @exampleOutput: true                         | true
 * @sideEffects: no
 * @hasTests: false
 */
export function check_if_el1_is_below_el2_in_DOM(
  el1: HTMLElement,
  el2: HTMLElement,
): boolean {
  // https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
  const DOCUMENT_POSITION_PRECEDING = 2;
  const IS_PARENT = 10;
  const comparisonResult = el1.compareDocumentPosition(el2);
  return (
    comparisonResult === DOCUMENT_POSITION_PRECEDING || comparisonResult === IS_PARENT
  );
}
