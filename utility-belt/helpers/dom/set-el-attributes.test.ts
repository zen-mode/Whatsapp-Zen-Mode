/* eslint-disable no-magic-numbers */

import "@testing-library/jest-dom";

import {set_el_attributes} from "./set-el-attributes";

describe("set_el_attributes set_el_attributes()", () => {
  it("can set attributes of div element", () => {
    expect.assertions(3);
    const el = document.createElement("div");
    set_el_attributes(el, {id: "foo", class: "bar", "data-id": "baz"});
    expect(el).toHaveAttribute("id", "foo");
    expect(el).toHaveAttribute("class", "bar");
    expect(el).toHaveAttribute("data-id", "baz");
  });
  it("can set attributes of input element", () => {
    expect.assertions(2);
    const el = document.createElement("input");
    set_el_attributes(el, {type: "password", disabled: ""});
    expect(el).toHaveAttribute("type", "password");
    // Explain: We're testing for specific attribute here.
    // eslint-disable-next-line jest-dom/prefer-enabled-disabled
    expect(el).toHaveAttribute("disabled", undefined);
  });
});
