import {is_Moment} from "./is-moment";

import {dateStringFormat} from "../date-string-formats";

import {Moment} from "../../../types/lib-types";

export const if_Moment_convert_to = {
  date_string: Moment_to_date_string,
  Date: Moment_to_Date,
};

/**
 * @description: Converts Moment obj to date string.
 * @exampleInput:  {Moment}     | 777
 * @exampleOutput: "08.07.2020" | 777
 * @sideEffects: no
 * @hasTests: false
 */
//todo-4: I wish TS implements RegExp types - so we can specify specific return value format
function Moment_to_date_string<T>(momentObj: Moment | T): string | T {
  if (!is_Moment(momentObj)) return momentObj as T;

  const dateStrFormat = dateStringFormat.RU;

  return (momentObj as Moment).format(dateStrFormat);
}

/**
 * @description: Converts Moment obj to Date obj.
 * @exampleInput:  {Moment} | 777
 * @exampleOutput: {Date}   | 777
 * @sideEffects: no
 * @hasTests: false
 */
function Moment_to_Date<T>(momentObj: Moment | T): Date | T {
  if (!is_Moment(momentObj)) return momentObj as T;

  return (momentObj as Moment).toDate();
}
