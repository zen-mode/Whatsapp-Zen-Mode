/**
 * @description: Inserts an item into array at position.
 * @exampleInput:  'foo', ['bar', 'baz']
 * @exampleOutput: ['foo', 'bar', 'baz']
 * @sideEffects: no
 * @hasTests: no
 */
export function insert_into_array<T>(item: T, array: T[], position: number): T[] {
  const newArray = [...array];
  // Explain: Inside a pure fn - is ok.
  // eslint-disable-next-line functional/immutable-data
  newArray.splice(position, 0, item);

  return newArray;
}

export function insert<T>(
  item: T,
): {into: (array: T[]) => {at_pos: (position: number) => T[]}} {
  return {
    into: (array: T[]) => ({
      at_pos: (position: number) => insert_into_array(item, array, position),
    }),
  };
}
