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
  console.log("DEBUG-POINT- #1");
  const url: string = `http://${import.meta.env.VITE_BACKEND_IP}:${
    import.meta.env.VITE_BACKEND_PORT
  }/app/${import.meta.env.VITE_API_VERSION}/${params.entityName}/${
    params.operation
  }`;
  const authToken: string | null = localStorage.getItem("token");

  const headers: Headers = new Headers();
  headers.append("Content-Type", "application/json");

  if (authToken !== null) {
    console.log("DEBUG-POINT- #2");
    headers.append("Authorization", `Bearer ${authToken}`);
  }

  return fetch(url, {
    credentials: "include",
    method: params.method,
    headers: headers,
    body: JSON.stringify(params.body),
  })
    .then((res) => {
      console.log("DEBUG-POINT- #3");
      if (!res.ok) {
        console.log("DEBUG-POINT- #4");
        return res.json();
      } else {
        console.log("DEBUG-POINT- #5");
        return res.json();
      }
    })
    .then((res: T) => {
      console.log("DEBUG-POINT- #6");
      if (
        res &&
        (res.responseCode === API_RESPONSE_CODE.SUCCESS_GEN ||
          res.responseCode === API_RESPONSE_CODE.SUCCESS_CREATE ||
          res.responseCode === API_RESPONSE_CODE.SUCCESS_PING ||
          res.responseCode === API_RESPONSE_CODE.SUCCESS_UPDATE)
      ) {
        console.log("DEBUG-POINT- #7");
        if (
          params.operation === OPERATION.CREATE_ONE ||
          params.operation === OPERATION.UPDATE_ONE
        ) {
          console.log("DEBUG-POINT- #8");
          toastDispatcher(store, JSON.stringify(params.body), url, res);
        }
        return res;
      } else {
        console.log("DEBUG-POINT- #9");
        if (res instanceof Object && "errorMessage" in res) {
          console.log("DEBUG-POINT- #10");
          toastDispatcher(store, JSON.stringify(params.body), url, res);
          if (res.responseCode === API_RESPONSE_CODE.ERROR_INVALID_TOKEN) {
            console.log("DEBUG-POINT- #11");
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
  console.log("DEBUG-POINT- #12");
  const url: string = `http://${import.meta.env.VITE_BACKEND_IP}:${
    import.meta.env.VITE_BACKEND_PORT
  }/app/${import.meta.env.VITE_API_VERSION}/file/${OPERATION.UPLOAD}`;
  const authToken: string | null = localStorage.getItem("token");
  const headers: Headers = new Headers();

  if (authToken !== null) {
    console.log("DEBUG-POINT- #13");
    headers.append("Authorization", `Bearer ${authToken}`);
  }

  return fetch(url, {
    credentials: "include",
    method: params.method,
    body: params.body,
    headers: headers,
  })
    .then((res) => {
      console.log("DEBUG-POINT- #14");
      if (!res.ok) {
        console.log("DEBUG-POINT- #15");
        alert(res.statusText);
      } else {
        console.log("DEBUG-POINT- #16");
        return res.json();
      }
    })
    .then((res: HttpMultiPartResponseBody) => {
      console.log("DEBUG-POINT- #17");
      return res;
    });
}

export async function urlToBase64(url: string): Promise<string> {
  console.log("DEBUG-POINT- #18");
  return fetch(url, {
    credentials: "include",
    method: "GET",
  })
    .then(async (res) => {
      console.log("DEBUG-POINT- #19");
      if (!res.ok) {
        console.log("DEBUG-POINT- #20");
        return res.json();
      } else {
        console.log("DEBUG-POINT- #21");
        const blob: Blob = await res.blob();
        return {
          blob: blob,
          content_type: res.headers.get("content-type") || "image/jpeg",
        };
      }
    })
    .then(async (_result: { blob: Blob; content_type: string }) => {
      console.log("DEBUG-POINT- #22");
      const reader = new FileReader();
      reader.readAsDataURL(_result.blob);

      return new Promise<string>((resolve, reject) => {
        console.log("DEBUG-POINT- #23");
        reader.onloadend = () => {
          console.log("DEBUG-POINT- #24");
          if (typeof reader.result === "string") {
            console.log("DEBUG-POINT- #25");
            const base64WithMetadata = `data:${_result.content_type};base64,${
              reader.result.split(",")[1]
            }`;
            resolve(base64WithMetadata);
          } else {
            console.log("DEBUG-POINT- #26");
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
  console.log("DEBUG-POINT- #27");
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
