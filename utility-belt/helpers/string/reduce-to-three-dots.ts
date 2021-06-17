/**
 * @description: Cuts off the string at a given length and replaces cut off part with 3 dots.
 * @exampleInput:  "I'm a string!yo", 12 | "I'm a string!yo", 20
 * @exampleOutput: "I'm a string..."     | "I'm a string!yo"
 * @sideEffects: no
 * @hasTests: false
 */
export function replace_string_end_with_dots(string: string, maxLen: number): string {
  if (string.length <= maxLen) return string;

  const dotsCount = 3;

  return string.substring(0, maxLen - dotsCount).padEnd(maxLen, ".");
}
