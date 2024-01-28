import React, { useEffect, useReducer } from "react";
import { HttpResponseBody } from "../types/httpTypes";
import { makeHttpCall } from "./ApiService";
import {
  API_RESPONSE_CODE,
  ENTITY_NAME,
  HTTP_METHOD,
  OPERATION,
} from "../types/enums";
import { deepReducerFunction } from "../Reducers/deepReducer";
import { GridPaginationModel } from "@mui/x-data-grid";

const useApiQuery = <G extends HttpResponseBody>(
  props: GridPaginationModel
) => {
  // states
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [dat, setDat] = useReducer(deepReducerFunction, undefined);
  const [page] = useReducer(deepReducerFunction<GridPaginationModel>, props);

  //  data operations
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const a = {
        entityName: ENTITY_NAME.X,
        method: HTTP_METHOD.POST,
        operation: OPERATION.GET_ALL,
        body: {
          pageNumber: page.page,
          pageSize: page.pageSize,
        },
      };
      const response: G = await makeHttpCall(a);
      if (response.responseCode === API_RESPONSE_CODE.SUCCESS) {
        setDat(response);
      }
    } catch (error: unknown) {
      if (error instanceof Error) console.log(error.stack);
    } finally {
      setIsLoading(false);
    }
  };

  //   hooks
  useEffect(() => {
    fetchData();
    return () => {};
  }, []);

  // dom
  return {
    isLoading,
    dat,
    executeQuery: fetchData,
  };
};

export default useApiQuery;
