/**
 * @description: Parse Date object to Russian-style date.
 * @exampleInput: new Date
 * @exampleOutput: "20.06.2020"
 * @sideEffects: no
 * @hasTests: false
 */
export function parse_to_date_RU(date: Date): string {
  return date.toLocaleDateString("ru");
}

/**
 * @description: Parse Date object to Russian-style date-time.
 * @exampleInput: new Date
 * @exampleOutput: "19.10.2019, 20:19:03"
 * @sideEffects: no
 * @hasTests: false
 */
export function parse_to_datetime_RU(date: Date): string {
  return date.toLocaleString("ru");
}

/**
 * @description: Converts RU datestring to date input -applicable string.
 * @exampleInput:  "16.01.2007"
 * @exampleOutput: "2007-01-16"
 * @sideEffects: no
 * @hasTests: false
 */
export function convert_RU_datestirng_to_Date_acceptable_string(
  datestring: string,
): string {
  const [year, month, day] = [
    /* eslint-disable no-magic-numbers */
    datestring.substr(6, 4),
    datestring.substr(3, 2),
    datestring.substr(0, 2),
    /* eslint-enable no-magic-numbers */
  ];

  return `${year}-${month}-${day}`;
}
