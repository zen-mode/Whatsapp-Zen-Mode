/* eslint-disable no-console */
import {env_is} from "../env/env";
import {ObjectValuesUnionOf} from "../../types/generic-types";

// Make devprint global for ease of debugging - no need to import explicitly.
// todo-2: all globalThis assignments sd be dome through a helper
globalThis.devprint = devprint;

/**
 * @description: Prints to console in dev environment; accepts optional indents
 * @exampleInput: 'foo', 2
 * @exampleOutput: console.log('  foo')
 * @pure: false: depends on env_is, prints to console
 * @hasTests: false
 */
const PrinterTypes = {
  LOG: "LOG",
  WARN: "WARN",
  ERROR: "ERROR",
};
type PrintType = ObjectValuesUnionOf<typeof PrinterTypes>;

export function devprint(
  textToPrint: string,
  relatedObject?: unknown,
  type?: PrintType,
  indentsNum?: number,
): void {
  if (!env_is.dev()) return;

  const printer = {
    [PrinterTypes.LOG]: console.log,
    [PrinterTypes.WARN]: console.warn,
    [PrinterTypes.ERROR]: console.error,
  };

  if (!type) {
    // eslint-disable-next-line no-param-reassign
    type = PrinterTypes.LOG;
  }

  const tabs = indentsNum ? " ".repeat(indentsNum) : "";
  // const tabs = indentsNum ? "\t".repeat(indentsNum) : ""; // Tabs
  relatedObject !== undefined
    ? printer[type](tabs + textToPrint, relatedObject)
    : printer[type](tabs + textToPrint);
}

/* eslint-disable functional/immutable-data */
devprint.warn = function warn(text: string, obj?: object): void {
  return devprint(text, obj, PrinterTypes.WARN);
};
devprint.error = function error(text: string, obj?: object): void {
  return devprint(text, obj, PrinterTypes.ERROR);
};
/* eslint-enable functional/immutable-data */
