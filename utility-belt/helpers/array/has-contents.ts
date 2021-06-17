/**
 * @description: Checks if array is not empty.
 * @exampleInput:  []    | [1,2,'foo']
 * @exampleOutput: false | true
 * @sideEffects: no
 * @hasTests: false
 */
export function has_contents<T>(array: ReadonlyArray<T>): boolean {
  return array.length > 0;
}

// Note: 'Have' word for 'fetchResults have contents'; has - for 'Collection has contents'
export const have_contents = has_contents;

export function has_no_contents<T>(array: ReadonlyArray<T>): boolean {
  return !has_contents(array);
}

export const have_no_contents = has_no_contents;

export const no = has_no_contents;
