import { useEffect, useState } from "react";
import { API_RESPONSE_CODE } from "../types/enums";
import { HttpRequestData, HttpResponseBody } from "../types/httpTypes";
import { toastDispatcher } from "./ApiService";
import store from "./GlobalStateService";

export const useHttpCall = <T extends HttpResponseBody, G>(
  params: HttpRequestData<G>
): [T | null, boolean, string | null] => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const makeRequest = async () => {
      setLoading(true);
      try {
        const url = `http://${import.meta.env.VITE_BACKEND_IP}:${
          import.meta.env.VITE_BACKEND_PORT
        }/app/${import.meta.env.VITE_API_VERSION}/${params.entityName}/${
          params.operation
        }`;

        const authToken = localStorage.getItem("token");

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        if (authToken) {
          headers.append("Authorization", `Bearer ${authToken}`);
        }

        const response = await fetch(url, {
          credentials: "include",
          method: params.method,
          headers,
          body: JSON.stringify(params.body),
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const responseData: T = await response.json();
        toastDispatcher(store, JSON.stringify(params.body), url, responseData);

        if (
          responseData.responseCode === API_RESPONSE_CODE.SUCCESS_GEN ||
          responseData.responseCode === API_RESPONSE_CODE.SUCCESS_CREATE ||
          responseData.responseCode === API_RESPONSE_CODE.SUCCESS_UPDATE
        ) {
          setData(responseData);
        } else {
          if (
            responseData instanceof Object &&
            "errorMessage" in responseData &&
            typeof responseData.errorMessage === "string"
          ) {
            setError(responseData.errorMessage || "Unknown error");
          }
        }
      } catch (error) {
        if (error instanceof Error) setError(error.message || "Network error");
      } finally {
        setLoading(false);
      }
    };

    makeRequest();
  }, [params]);

  return [data, loading, error];
};
