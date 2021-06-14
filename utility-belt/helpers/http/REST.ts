/* eslint-env node */
/* eslint-disable no-console,functional/no-try-statement */
// const isNode = typeof process === "object" ? true : false;
// const fetch = isNode ? require("node-fetch") : window.fetch;

import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
import {devprint} from "../debug/devprint";

import {ERRORS} from "../../constants/errors";

import {HTTPError} from "../../types/errors";

export const REST = {get, post, /*delete*/ response_is_error};

function get(
  argsObj: GetRequest,
): Promise<
  AxiosResponse | unknown | typeof ERRORS.REMOTE_DATA_NOT_FOUND | typeof ERRORS.GENERIC
> {
  return wrap_request({...argsObj, ...{type: "GET"}});
}

type GetRequest = {
  url: string;
  axiosConfig?: AxiosRequestConfig;
  log?: boolean;
  dataDescription: string;
  returnFullResponse?: true;
};

async function wrap_request({
  type,
  url,
  // @ts-ignore
  payload,
  axiosConfig,
  log = true,
  dataDescription,
  returnFullResponse,
}: WrapRequest): Promise<unknown | AxiosResponse | HTTPError> {
  try {
    // Explain: Need conditional assignment.
    // eslint-disable-next-line functional/no-let
    let axiosResponse;
    if (type === "GET") axiosResponse = await axios.get(url, axiosConfig);
    else if (type === "POST") axiosResponse = await axios.post(url, payload, axiosConfig);
    // todo-team: this is just to shut up TS. otherwise it complains about axiosResponse possibly undefined - what can ..
    //  we do here?
    else return ERRORS.GENERIC;

    if (log)
      devprint(dataDescription, returnFullResponse ? axiosResponse : axiosResponse.data);

    if (!axiosResponse.data) return ERRORS.REMOTE_DATA_NOT_FOUND;

    return returnFullResponse
      ? (axiosResponse as AxiosResponse)
      : (axiosResponse.data as unknown);
  } catch (err) {
    if (is_AxiosError(err)) {
      if (err.message === "Network Error") return ERRORS.NETWORK;

      // eslint-disable-next-line no-console
      console.log(JSON.stringify(err.response));

      if (err.response?.status === 404) return ERRORS.REMOTE_DATA_NOT_FOUND;

      // todo-team: if err is not -incorrect value (INN,BIK,..) - file the error to Sentry;
      // dont forget to test with smth like await REST.get({url:'https://proverk.ru/ajax.php'})
      return ERRORS.GENERIC;
    }

    return ERRORS.GENERIC;
  }
}

type WrapRequest =
  | ({
      type: "GET" | "POST" | "DELETE";
    } & GetRequest)
  | ({
      type: "GET" | "POST" | "DELETE";
    } & PostRequest);

async function post(argsObj: PostRequest): Promise<unknown | AxiosResponse | HTTPError> {
  return wrap_request({...argsObj, ...{type: "POST"}});
}

type PostRequest = GetRequest & {
  payload: unknown;
};

function response_is_error(response: string | unknown): response is HTTPError {
  return typeof (response as string) === "string";
}

function is_AxiosError(err: Error | AxiosError): err is AxiosError {
  // @ts-expect-error
  return err.isAxiosError !== undefined;
}
