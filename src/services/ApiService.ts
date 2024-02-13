import { API_RESPONSE_CODE, OPERATION } from "../types/enums";
import {
  HttpMultiPartResponseBody,
  HttpRequestData,
  HttpResponseBody,
} from "../types/httpTypes";

export async function makeHttpCall<T extends HttpResponseBody, G>(
  params: HttpRequestData<G>
): Promise<T> {
  const url: string = `http://${import.meta.env.VITE_BACKEND_IP}:${
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
          console.log(res.errorMessage);
        }
        return res;
      }
    });
}

export function makeMultiPartHttpCall(
  params: HttpRequestData<FormData>
): Promise<HttpMultiPartResponseBody> {
  const url: string = `http://${import.meta.env.VITE_BACKEND_IP}:${
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
