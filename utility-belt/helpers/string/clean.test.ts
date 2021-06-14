/* eslint-disable no-magic-numbers */

import {clean_of_non_std_chars} from "./clean";

describe("clean_of_non_std_chars fn", () => {
  it("Cleans the string of non-standard chars like emogjis, non-printables and the like", () => {
    expect.assertions(2);

    expect(clean_of_non_std_chars("Мы 🐸 бум бам   тест 🇮🇪🇮🇲 hihi")).toBe(
      "Мы  бум бам   тест  hihi",
    );
    expect(clean_of_non_std_chars("דגלים🥕🏁 שחוריםצ[  ]ומת🇮🇪🇮🇲 %$^&*()💕🏴‍☠️")).toBe(
      "דגלים שחוריםצ[  ]ומת %$^&*()",
    );
  });

  it("trims leading\\trailing whitespace", () => {
    expect.assertions(1);

    expect(clean_of_non_std_chars("  o-oof 234  ")).toBe("o-oof 234");
  });
});
