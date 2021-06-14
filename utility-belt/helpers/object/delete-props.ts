/**
 * @description: Removes props from an object (by value); returns new object.
 * @exampleInput:  {foo:1, bar:2}, 'foo' | {foo:1, bar:2, baz:3}, ['foo', 'bar'].
 * @exampleOutput: {bar: 2}              | {baz: 3}.
 * @isPure: Yes.
 * @hasTests: Yes.
 */
// https://stackoverflow.com/a/58249788/4507580 .
export function delete_props_from(
  obj: Record<string, unknown>,
  props: string | string[],
): Record<string, unknown> {
  // eslint-disable-next-line no-param-reassign
  if (!Array.isArray(props)) props = [props];
  return Object.keys(obj).reduce((newObj, prop) => {
    if (!props.includes(prop)) {
      // eslint-disable-next-line functional/immutable-data,no-param-reassign
      newObj[prop] = obj[prop];
    }
    return newObj;
  }, {});
}
