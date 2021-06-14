/**
 * @description: Gets text content from a given element; omits text in its children.
 * @exampleInput:  <label>Hello <span><i>world!</i></span></label> | <div></div>
 * @exampleOutput: "Hello"                                         | ""
 * @sideEffects: no
 * @hasTests: false
 */
export function get_text_content_only_from_the_element_itself(el: HTMLElement): string {
  if (!el.childNodes[0]) return "";

  return el.childNodes[0].nodeValue
    ? el.childNodes[0].nodeValue.trim()
    : el.innerText.trim();
}
