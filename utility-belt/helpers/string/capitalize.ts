/**
 * @description: Reduces string to lower case and capitalizes the 1st letter.
 * @exampleInput: "SOME WORDS"
 * @exampleOutput: "Some words"
 * @sideEffects: no
 * @hasTests: false
 */
export function capitalize(string: string): string {
  const lowerCaseString = string.toLowerCase();
  return lowerCaseString.charAt(0).toUpperCase() + lowerCaseString.slice(1);
}
