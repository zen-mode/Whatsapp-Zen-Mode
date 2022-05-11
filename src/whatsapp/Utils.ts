import {WWAProviderCall, WWAProviderRequest, WWAProviderResponse} from "./types";
import {v4 as uuidv4} from "uuid";

export function generateBasicWWARequest(call: WWAProviderCall, args: any[] = []): WWAProviderRequest {
  return {
    id: uuidv4(),
    call: call,
    args: args
  };
}

export function generateBasicWWAResponse(id: string, result?: any, error?: any, request?: WWAProviderRequest): WWAProviderResponse {
  const requestResult: WWAProviderResponse = { id: id };
  if (error) {
    requestResult.error = error;
    requestResult.original = request;
  }
  if (result)
    requestResult.result = result;
  return requestResult;
}
