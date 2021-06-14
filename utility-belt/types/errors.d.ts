import {ERRORS} from "../constants/errors";

export type Error = typeof ERRORS.INCORRECT_ARGUMENT_RECIEVED & HTTPError;

export type HTTPError =
  | typeof ERRORS.INCORRECT_INPUT_VALUE
  | typeof ERRORS.REMOTE_DATA_NOT_FOUND
  | typeof ERRORS.GENERIC;
