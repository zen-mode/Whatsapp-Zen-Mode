import moment from "moment";

/**
 * @description: Checks if parameter is a Moment obj.
 * @exampleInput:  {Moment} | 777
 * @exampleOutput: true     | false
 * @sideEffects: no
 * @hasTests: false
 */
export function is_Moment<T>(possibleMomentObj: T): boolean {
  return moment.isMoment(possibleMomentObj);
}
