/* eslint-disable max-lines */
import {round} from "../math/round";

/**
 * @description: .
 * @exampleInput:
 * @exampleOutput:
 * @sideEffects:
 * @hasTests:
 */
export function convert_numberLike_to_currency(
  numberLike: number | string,
  locale: string,
): string {
  // "1fd2 300,8c9" ==> "12300.89"
  // prettier-ignore
  const numberLikeWithDotSeparator
      = typeof numberLike === "string"
      ? numberLike.replace(/,/gu, ".").replace(/[^0-9.]+|\s+/gimu, "")
      : numberLike;

  const parsedValue = isNaN(parseFloat(numberLikeWithDotSeparator as string))
    ? ""
    : parseFloat(numberLikeWithDotSeparator as string);

  const decimalCount = 2;

  return parsedValue.toLocaleString(locale, {
    maximumFractionDigits: decimalCount,
    minimumFractionDigits: decimalCount,
  });
  // TODO-team: indicate whether function is pure and has tests; delete this line
}

export function convert_numberLike_to_RUB(numberLike: number | string): string {
  return convert_numberLike_to_currency(numberLike, "ru");
}

// todo-team: add convert_numberLike_to_RUB to this obj
export function convert(
  value: number | string,
): {
  to_comma_separated_number_string: (options?: {decimalCount: number}) => string;
  to_number_or_dot_separated_string: (options?: {
    decimalCount?: number;
    returnString?: boolean;
  }) => number | string;
} {
  return {
    // eslint-disable-next-line lines-around-comment
    /**
     * @description: Converts a number or a number string in a dot decimal notation to
     *               a number string in comma decimal notation.
     * @exampleInput:  "123.3445" | "123.3445", {decimalCount: 3} | 123.3445 | 123.3445, {decimalCount: 3}
     * @exampleOutput: "123,34"   | "123,344"                     | "123,34" | "123,344"
     * @sideEffects: no
     * @hasTests: no
     */
    to_comma_separated_number_string(options = {decimalCount: 2}): string {
      //todo-team: Validate that there are only digits and dot

      const {decimalCount} = options;

      const roundedValue = typeof value === "number" ? round(value, decimalCount) : value;
      const valueToManipulate =
        typeof value === "number" ? String(roundedValue) : (roundedValue as string);
      if (!valueToManipulate.includes(".")) return valueToManipulate;

      const replacedValue = valueToManipulate.replace(".", ",");

      return replacedValue.substring(0, replacedValue.indexOf(",") + 1 + decimalCount);
    },

    /**
     * @description: Converts a number string in a comma decimal notation to
     *               a number string in dot decimal notation; or a number.
     * @exampleInput:  "123,3445" | "123,3445", {returnString: true} | "123,3445", {returnString: true, decimalCount: 3}
     * | 123.3445
     * @exampleOutput: 123.3445   | "123.3445"                         | "123.344"
     * | 123.3445
     * @sideEffects: no
     * @hasTests: no
     */
    to_number_or_dot_separated_string(
      options: {decimalCount?: number; returnString?: boolean} = {
        decimalCount: 999,
        returnString: false,
      },
    ): number | string {
      if (typeof value === "number") return value;
      //todo-team: Validate that there are only digits and comma in value as string

      const {decimalCount, returnString} = options;

      const replacedValue = value.replace(",", ".");
      const trimmedValue = replacedValue.substring(
        0,
        // Explain: if options is defined, but decimalCount is not  - we want to pass 999, otherwise 2nd arg to
        // .substring will be NaN.
        // eslint-disable-next-line no-magic-numbers
        replacedValue.indexOf(".") + 1 + (decimalCount ?? 999),
      );

      return returnString ? trimmedValue : parseFloat(trimmedValue);
    },
  };
}
