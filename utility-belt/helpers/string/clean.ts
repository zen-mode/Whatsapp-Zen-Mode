/**
 * Clean the string of non-standard chars like emogjis, non-printables and the like;
 * keeps only:
 * \p{L} - all letters from any language;
 * \p{N} - numbers;
 * \p{P} - punctuation;
 * \p{Z} - whitespace separators;
 * trims leading\trailing whitespace.
 *
 * @param str - String to clean.
 *
 * @exampleInput  'Мы 🐸 бум бам тест 🇮🇪🇮🇲 hihi' | 'דגלים🥕🏁 שחוריםצ[  ]ומת🇮🇪🇮🇲 %$^&*()ביל💕🏴‍☠️״ו'
 * @exampleOutput "Мы  бум бам тест  hihi"        | "דגלים שחוריםצ[  ]ומת %$^&*()ביל‍️״ו" .
 *
 * @sideEffects No.
 * @hasTests Yes.
 */
export function clean_of_non_std_chars(str: string): string {
  // WARNING: Backslash is still being removed in this implementation.
  return str.replace(/[^\p{L}\p{N}\p{P}\p{Z}{^$=+±\\'|`\\~<>}]/gu, "").trim();
}
