// https://www.npmjs.com/package/safe-flat
import {flatten as flat} from "flat";

export function flatten(obj: object, delimiter?: string): object {
  return flat(obj, {delimiter});
}
