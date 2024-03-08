import { DateTime } from "luxon";
import { NavigateFunction } from "react-router-dom";
import { Store } from "redux";
import { API_RESPONSE_CODE, OPERATION } from "../types/enums";
import {
  HttpMultiPartResponseBody,
  HttpRequestData,
  HttpResponseBody,
} from "../types/httpTypes";
import { GlobalState } from "../types/types";
import { ActionInterface } from "./GlobalStateService";

export async function makeHttpCall<T extends HttpResponseBody, G>(
  params: HttpRequestData<G>,
  store: Store<GlobalState, ActionInterface, unknown>,
  navigate: NavigateFunction
): Promise<T> {
  const url: string = `http:
    import.meta.env.VITE_BACKEND_PORT
  }/app/${import.meta.env.VITE_API_VERSION}/${params.entityName}/${
    params.operation
  }`;
  const authToken: string | null = localStorage.getItem("token");

  const headers: Headers = new Headers();
  headers.append("Content-Type", "application/json");

  if (authToken !== null) {
    headers.append("Authorization", `Bearer ${authToken}`);
  }

  return fetch(url, {
    credentials: "include",
    method: params.method,
    headers: headers,
    body: JSON.stringify(params.body),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json();
      } else {
        return res.json();
      }
    })
    .then((res: T) => {
      if (res && res.responseCode === API_RESPONSE_CODE.SUCCESS) {
        return res;
      } else {
        if (res instanceof Object && "errorMessage" in res) {
          toastDispatcher(store, JSON.stringify(params.body), url, res);
          if (res.responseCode === API_RESPONSE_CODE.ERROR_INVALID_TOKEN) {
            navigate("/");
          }
        }
        return res;
      }
    });
}

export async function makeMultiPartHttpCall(
  params: HttpRequestData<FormData>
): Promise<HttpMultiPartResponseBody> {
  const url: string = `http:
    import.meta.env.VITE_BACKEND_PORT
  }/app/${import.meta.env.VITE_API_VERSION}/file/${OPERATION.UPLOAD}`;
  const authToken: string | null = localStorage.getItem("token");
  const headers: Headers = new Headers();

  if (authToken !== null) {
    headers.append("Authorization", `Bearer ${authToken}`);
  }

  return fetch(url, {
    credentials: "include",
    method: params.method,
    body: params.body,
    headers: headers,
  })
    .then((res) => {
      if (!res.ok) {
        alert(res.statusText);
      } else {
        return res.json();
      }
    })
    .then((res: HttpMultiPartResponseBody) => {
      return res;
    });
}

export async function urlToBase64(url: string): Promise<string> {
  return fetch(url, {
    credentials: "include",
    method: "GET",
  })
    .then(async (res) => {
      if (!res.ok) {
        return res.json();
      } else {
        const blob: Blob = await res.blob();
        return {
          blob: blob,
          content_type: res.headers.get("content-type") || "image/jpeg",
        };
      }
    })
    .then(async (_result: { blob: Blob; content_type: string }) => {
      const reader = new FileReader();
      reader.readAsDataURL(_result.blob);

      return new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            const base64WithMetadata = `data:${_result.content_type};base64,${
              reader.result.split(",")[1]
            }`;
            resolve(base64WithMetadata);
          } else {
            reject("Failed to read image data.");
          }
        };
      });
    });
}

export function toastDispatcher(
  store: Store<GlobalState, ActionInterface, unknown>,
  APIBody: string,
  APIUrl: string,
  fetchData: HttpResponseBody
) {
  const toast = () => ({
    type: "DUMMYTYPE",
    _Code: fetchData.responseCode,
    _DisplayMsg: fetchData.displayMsg,
    apiTime: DateTime.now().toISO(),
    _ErrMsg:
      fetchData instanceof Object &&
      "errorMessage" in fetchData &&
      typeof fetchData.errorMessage === "string"
        ? fetchData.errorMessage
        : undefined,
    _APIBody: APIBody,
    _APIUrl: APIUrl,
    _SelectUId: -1,
  });

  store.dispatch(toast());
}
