/**todo-2: update descr & examples
 * @description: Returns DOM nodes that contain given text; can use strict or loose text search;
 *               can filter by selector.
 * @exampleInput:   !OUTDATED! Given: (<span>Hello world</span>):
 *                  "Hello", false, "span"      | "Hello", true
 * @exampleOutput:  [<span>Hello world</spand>] | [ ]
 * @sideEffects: no
 * @hasTests: false
 */
import {have_contents} from "../array/has-contents";
import {is_el_visible} from "./is-el-visible";

export function find_nodes_containing({
  caseInsensitive,
  includeInvisible,
  // Explain: If traversed document is an in-memory document.
  DOMisMemoryOnly,
  DOMtoUse = document,
  // Explain: If true - nodes that contain only that text; if false - nodes, containing this and other text as well.
  strictComparison,
  selector,
  text,
}: {
  caseInsensitive?: true;
  DOMisMemoryOnly?: true;
  DOMtoUse?: Document;
  includeInvisible?: true;
  selector?: string;
  strictComparison?: true;
  text: string;
}): HTMLElement[] {
  const elements = ([
    ...DOMtoUse.body.querySelectorAll(selector ?? "*"),
  ] as HTMLElement[]).filter((el) =>
    DOMisMemoryOnly || includeInvisible ? true : is_el_visible(el),
  );

  return have_contents(elements)
    ? elements.filter((element) => {
        // prettier-ignore
        const elText
          =  element.childNodes[0]
          && element.childNodes[0].nodeValue
          && element.childNodes[0].nodeValue.trim();
        if (!elText) return false;

        if (caseInsensitive) {
          const elTextLower = elText.toLocaleLowerCase();
          const textLower = text.toLocaleLowerCase();

          return strictComparison
            ? elTextLower === textLower
            : elTextLower.includes(textLower);
        }
        return strictComparison ? elText === text : elText.includes(text);
      })
    : [];
}

export const find_nodes_containing_text = (text: string): HTMLElement[] =>
  find_nodes_containing({text});
