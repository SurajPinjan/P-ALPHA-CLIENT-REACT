import { GridSortModel } from "@mui/x-data-grid";
import React from "react";
import { NavigateFunction } from "react-router-dom";
import { Page } from "../components/Project/Project";
import { ENTITY_NAME, HTTP_METHOD, OPERATION } from "../types/enums";
import { Filter } from "../types/filterTypes";
import {
  HttpGetAllRequestBody,
  HttpRequestData,
  HttpResponseGetAll,
} from "../types/httpTypes";
import { makeHttpCall } from "./ApiService";
import store from "./GlobalStateService";

export function getAllFactory<T, TView>(
  filterArray: Filter[],
  sorts: GridSortModel,
  setPageState: React.Dispatch<React.SetStateAction<Page>>,
  pageState: Page,
  navigate: NavigateFunction,
  getViewFromModel: (row: T) => TView
): () => void {
  return async () => {
    setPageState((old) => ({ ...old, isLoading: true }));

    const requestDataAll: HttpRequestData<HttpGetAllRequestBody> = {
      entityName: ENTITY_NAME.X,
      method: HTTP_METHOD.POST,
      operation: OPERATION.GET_ALL,
      body: {
        filters: filterArray,
        sorts: sorts,
        pageSize: pageState.pageSize,
        pageNumber: pageState.page,
      },
    };

    const fetchData: HttpResponseGetAll<T> = await makeHttpCall<
      HttpResponseGetAll<T>,
      HttpGetAllRequestBody
    >(requestDataAll, store, navigate);

    const dat: TView[] = fetchData.data
      ? fetchData.data.map((row: T) => {
          const data: TView = getViewFromModel(row);
          return data;
        })
      : [];

    console.log(JSON.stringify(dat[0]));

    // setPageState((old) => ({
    //   ...old,
    //   isLoading: false,
    //   data: dat
    //   total: fetchData.totalCount,
    // }));
  };
}
