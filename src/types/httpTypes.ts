import { Model } from "../models/Model";
import { UModel } from "../models/U";
import {
  API_RESPONSE_CODE,
  ENTITY_NAME,
  HTTP_METHOD,
  OPERATION,
} from "./enums";
import { Filter } from "./filterTypes";

// Request types
export type HttpRequestData<G> = {
  method: HTTP_METHOD;
  body?: G;
  entityName: ENTITY_NAME;
  operation: OPERATION;
};

export type HttpGetAllRequestBody = {
  isPagination?: boolean;
  pageNumber?: number;
  pageSize?: number;
  filters?: Filter[];
};

export type HttpGetOneRequestBody = {
  uid: number;
};

export type HttpCreateOneRequestBody<T> = {
  data: T;
};

export type HttpUpdateOneRequestBody<T> = {
  data: T;
};

export type HttpLoginRequestBody = {
  username: string;
  password: string;
};

// Response types
export type HttpResponseBody = {
  responseCode: API_RESPONSE_CODE;
  errorMessage?: string;
};

export type HttpMultiPartResponseBody = HttpResponseBody & {
  url: string;
};

export type HttpResponseGetAll<T> = HttpResponseBody & {
  data: T[];
  totalCount: number;
};

export type HttpResponseGetOne = HttpResponseBody & {
  data: Model;
};

export type HttpResponseUpdateOne<T> = HttpResponseBody & {
  data: T;
};

export type HttpResponseCreateOne<T> = HttpResponseBody & {
  data: T;
};

export type HttpResponseLogin = HttpResponseBody & {
  token: string;
  userInfo: UModel;
};
