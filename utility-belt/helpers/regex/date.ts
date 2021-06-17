import is from "is_js";

//                      'DD.MM.YYYY'
export const RU_date = /^\d{2}\.\d{2}\.\d{4}$/u;

export function has_RU_datestring_format(string: string): boolean {
  if (!is.string(string)) {
    // Explain: Need SE here.
    // eslint-disable-next-line functional/no-throw-statement
    throw Error(`Recieved value of incorrect type. Expected String, got: ${string}`);
  }

  return Boolean(string.match(RU_date));
}
