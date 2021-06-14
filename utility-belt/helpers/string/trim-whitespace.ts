import {nonSingleWhitespace} from "../regex/string";

/**
 * @description: Removes all whitespace longer than one inside string and trims start and end.
 * @exampleInput: " foo   is not   bar   "
 * @exampleOutput: "foo is not bar"
 * @sideEffects: no
 * @hasTests: false
 */
export function trim_whitespace_from(string: string): string {
  return string.replace(nonSingleWhitespace, " ").trim();
}
export const trim_whitespace = trim_whitespace_from;
