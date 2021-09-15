// Explain: Because we use obj method shorthands instead of fns - we cannot insert an empty line bw them.
/* eslint-disable lines-around-comment */

import {wait_for_fn_to_return_true} from "../async/wait";
import {is_el_visible} from "./is-el-visible";
import {set_el_attributes} from "./set-el-attributes";

import {StringObject} from "../../types/generic-types";

export const DOM = {
  /**
   * @description: Similar to document.body.querySelector; accepts parentEl arg.
   * @exampleInput:  "input" | "foo" | "foo", <someDiv/>
   * @exampleOutput: <input> | null | <span>foo</span>
   * @sideEffects: DOM traversal
   * @hasTests: no
   */
  create_el({
    attributes,
    html,
    tag,
    text,
  }: {
    attributes?: StringObject;
    html?: string;
    tag: string;
    text?: string;
  }): HTMLElement {
    const element = document.createElement(tag);

    // Explain: Reassignment by design. Don't want null assert here. Dangerously set inner HTML by design.
    /* eslint-disable functional/immutable-data,@typescript-eslint/non-nullable-type-assertion-style*/
    // eslint-disable-next-line no-unsanitized/property
    if (Boolean(html)) element.innerHTML = html as string;
    if (Boolean(text)) element.innerText = text as string;
    /* eslint-enable functional/immutable-data,@typescript-eslint/non-nullable-type-assertion-style*/

    if (attributes) set_el_attributes(element, attributes);

    return element;
  },

  /**
   * @description: Similar to document.body.querySelector; accepts parentEl arg.
   * @exampleInput:  "input" | "foo" | "foo", <someDiv/>
   * @exampleOutput: <input> | null | <span>foo</span>
   * @sideEffects: DOM traversal
   * @hasTests: no
   */
  get_el(selector: string, parentEl = document.body): HTMLElement | null {
    return parentEl.querySelector(selector);
  },
  /**
   * @description: Similar to document.body.querySelectorAll; unless onlyVisible flag is set; accepts parentEl arg.
   * @exampleInput:  "input"                                  | "input", <someDiv/> | "input", <someDiv/>, true .
   * @exampleOutput: [<input>, <input style="display: none">] | [<input>]           | [] .
   * @sideEffects: DOM traversal.
   * @hasTests: no.
   */
  get_els(
    selector: string,
    parentEl: Element = document.body,
    onlyVisible = false,
  ): HTMLElement[] {
    const elArray = [...parentEl.querySelectorAll(selector)] as HTMLElement[];
    return onlyVisible ? elArray.filter(is_el_visible) : elArray;
  },
  /**
   * @description: Similar to document.body.querySelectorAll; unless onlyVisible flag is set; accepts parentEl arg.
   * @exampleInput:  "input"                                  | "input", <someDiv/> | "input", <someDiv/>, true .
   * @exampleOutput: [<input>, <input style="display: none">] | [<input>]           | [] .
   * @sideEffects: DOM traversal.
   * @hasTests: no.
   */
   get_input_els(
    selector: string,
    parentEl: Element = document.body,
    onlyVisible = false,
  ): HTMLInputElement[] {
    const elArray = [...parentEl.querySelectorAll(selector)] as HTMLInputElement[];
    return onlyVisible ? elArray.filter(is_el_visible) : elArray;
  },
  /**
   * @description: Checks if page has a given text string.
   * @exampleInput:  "foo"
   * @exampleOutput: true
   * @sideEffects: DOM traversal
   * @hasTests: no
   */
  includes_text(text: string): boolean {
    return document.body.innerText.includes(text);
  },
  /**
   * @description: Removes an El from DOM; returns true or false
   * @exampleInput:  "#element" (found in DOM) | "#element" (not found in DOM)
   * @exampleOutput: true                      | false
   * @sideEffects: DOM manipulation
   * @hasTests: no
   */
  remove_el(selector: string): boolean {
    const el = DOM.get_el(selector);
    if (el) {
      el.remove();
      return true;
    }

    return false;
  },
  /**
   * @description: Looks for a selector in document body every {pollMs}; does this for ...
   *               {waitMs}. If within {waitMs} Element is found - returns Element; ...
   *               otherwise returns null.
   * @exampleInput:  ".foo"                  | '#non-existent'
   * @exampleOutput: <div class="foo"></div> | null
   * @sideEffects: DOM traversal
   * @hasTests: no
   */
  async wait_and_get_el(
    selector: string,
    waitMs = 3000,
    pollMs = 100,
  ): Promise<HTMLElement | null> {
    return new Promise((resolve) => {
      // Explain: This interval timer checks for the presence of Element every 100ms;
      // if found - resolves the promise with Element and clears overall timer.
      const intervalHandle = setInterval(() => {
        const el = DOM.get_el(selector);
        if (el) {
          clearInterval(intervalHandle);
          clearTimeout(timeoutHandle);
          resolve(el);
        }
      }, pollMs);

      // Explain: This overall timer waits for 3000ms; if by that time Element is not ...
      // found - resolves the promise with null and clears interval timer.
      const timeoutHandle = setTimeout(() => {
        clearInterval(intervalHandle);
        resolve(null);
      }, waitMs);
    });
  },
  async wait_to_include_text(
    text: string,
    waitMs?: number,
    pollMs?: number,
  ): Promise<true | null> {
    return wait_for_fn_to_return_true(DOM.includes_text, [text], waitMs, pollMs);
  },
};
