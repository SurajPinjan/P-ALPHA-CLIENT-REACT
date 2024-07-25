import { GridSortModel } from "@mui/x-data-grid";
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
  sorts?: GridSortModel;
  filters?: Filter[];
};

// shri_ram - Tamtam,
// bhakarwadi,
// lilochivda,
// dhuliram Peda

export type HttpMailRequestBody = {
  to: string[]
  subject: string
  text: string
}

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
  displayMsg: string;
};

export type HttpMultiPartResponseBody = HttpResponseBody & {
  url: string;
};

export type HttpErrorResponseBody = HttpResponseBody & {
  errorMessage: string;
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
