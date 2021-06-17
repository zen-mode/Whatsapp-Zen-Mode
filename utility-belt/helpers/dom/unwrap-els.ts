/**
 * @description: Unwraps elements off their tags.
 * @exampleInput: 'span', '.text' . (<body><div class="text">Foo <span>bar</span></div></body>)
 * @exampleOutput: true . (<body><div class="text">Foo bar</div></body>)
 * @isPure: No; DOM manipulation.
 * @hasTests: No.
 */
export function unwrap_tags_for(elTag: string, containerElSelector = "body"): boolean {
  const elsToUnwrap = document
    .querySelector(containerElSelector)
    ?.querySelectorAll(elTag);
  if (!elsToUnwrap || elsToUnwrap.length === 0) return false;

  elsToUnwrap.forEach((el) => void el.replaceWith(...el.childNodes));

  return true;
}
