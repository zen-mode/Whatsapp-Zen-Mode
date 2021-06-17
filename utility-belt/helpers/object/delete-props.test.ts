import {delete_props_from} from "./delete-props";

describe("Removes props from an object (by value); returns new object.", () => {
  it("Works for non-empty object", () => {
    expect.assertions(2);
    expect(delete_props_from({foo: 1, bar: 2}, "foo")).toStrictEqual({bar: 2});
    expect(delete_props_from({foo: 1, bar: 2, baz: 3}, ["foo", "bar"])).toStrictEqual({
      baz: 3,
    });
  });

  it("Works for empty object", () => {
    expect.assertions(1);
    expect(delete_props_from({}, "foo")).toStrictEqual({});
  });
});
