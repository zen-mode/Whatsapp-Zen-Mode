import {StringObject} from "../../types/generic-types";

/**
 * @description: Sorts a string array alphabetically. Sorts an array of objects with string values, by key name.
 *               Returns a new array.
 * @exampleInput:  ['Z', 'b', 'a',] | [{name: 'Z'}, {name: 'b'}, {name: 'a'},], 'name'
 * @exampleOutput: ['a', 'b', 'Z',] | [{name: 'a'}, {name: 'b'}, {name: 'Z'},]
 * @sideEffects: no.
 * @hasTests: no.
 */

// todo-team: type this correctly.
export function sort_alphabetically<T>(array: T[]): T[];
export function sort_alphabetically(
  array: StringObject[],
  objectKeyToSort: string,
): StringObject[] {
  if (array.length === 0) return array;

  if (typeof array[0] === "string")
    return [...array].sort((itemA, itemB) => itemA.localeCompare(itemB));

  return [...(array as StringObject[])].sort((itemA, itemB) =>
    itemA[objectKeyToSort].localeCompare(itemB[objectKeyToSort]),
  );
}
