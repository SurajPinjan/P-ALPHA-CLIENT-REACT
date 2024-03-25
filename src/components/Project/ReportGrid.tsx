import { Box, Stack } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRowModesModel,
  GridRowsProp,
  GridSortModel,
} from "@mui/x-data-grid";
import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ReportModel,
  ReportVue,
  getViewFromModelReport,
} from "../../models/Report";
import { makeHttpCall } from "../../services/ApiService";
import store from "../../services/GlobalStateService";
import { ENTITY_NAME, HTTP_METHOD, OPERATION } from "../../types/enums";
import { Filter } from "../../types/filterTypes";
import {
  HttpGetAllRequestBody,
  HttpRequestData,
  HttpResponseGetAll,
} from "../../types/httpTypes";
import EditToolbar from "./ProjectStages/EditToolbar";

export interface Page {
  isLoading: boolean;
  data: GridRowsProp;
  total: number;
  page: number;
  pageSize: number;
}

const ReportGrid: React.FC = () => {
  // constants

  const columns = [];

  columns.push({
    field: "url",
    headerName: "URL",
    width: 340,
    editable: false,
  });

  columns.push({
    field: "columnUText",
    headerName: "Unique Text",
    width: 240,
    editable: false,
  });

  columns.push({
    field: "computedColumnA",
    headerName: "Calculated Value A",
    width: 240,
    editable: false,
  });

  // states
  const [pageState, setPageState] = useState<Page>({
    isLoading: false,
    data: [],
    total: 0,
    page: 0,
    pageSize: 2,
  });
  // states

  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  const [sorts, setSorts] = React.useState<GridSortModel>([]);
  const [tableTitle] = React.useState("Report");

  // constants
  const columnsDetails: GridColDef[] = [...columns];

  const [clmnVisibility, setClmnVisibility] = useState<{
    [key: string]: boolean;
  }>(() => {
    const initialVisibility: { [key: string]: boolean } = {};
    columnsDetails.forEach((column) => {
      initialVisibility[column.field] = true;
    });
    return initialVisibility;
  });

  // 3rd party hooks

  const navigate = useNavigate();

  //   data operations
  const getDataAll = useCallback(async () => {
    setPageState((old) => ({ ...old, isLoading: true }));
    const filterArray: Filter[] = [];

    const requestDataAll: HttpRequestData<HttpGetAllRequestBody> = {
      entityName: ENTITY_NAME.REPORT,
      method: HTTP_METHOD.POST,
      operation: OPERATION.GET_ALL,
      body: {
        filters: filterArray,
        sorts: sorts,
        pageSize: pageState.pageSize,
        pageNumber: pageState.page,
      },
    };

    const fetchData: HttpResponseGetAll<ReportModel> = await makeHttpCall<
      HttpResponseGetAll<ReportModel>,
      HttpGetAllRequestBody
    >(requestDataAll, store, navigate);

    const dat: ReportVue[] = fetchData.data
      ? fetchData.data.map((row: ReportModel) => {
          const data: ReportVue = getViewFromModelReport(row);
          return data;
        })
      : [];

    setPageState((old) => ({
      ...old,
      isLoading: false,
      data: dat,
      total: fetchData.totalCount,
    }));
  }, [navigate, pageState.page, pageState.pageSize, sorts]);

  // anonymous functions

  // event handlers

  //   hooks

  useEffect(() => {
    getDataAll();
  }, [getDataAll, pageState.page, pageState.pageSize]);

  const handleSortModelChange = (newSortModel: GridSortModel) => {
    setSorts(_.cloneDeep(newSortModel));
  };

  //   dom

  return (
    <>
      <Box
        sx={{
          height: "auto",
          width: "100%",
          "& .actions": {
            color: "text.secondary",
          },
          "& .textPrimary": {
            color: "text.primary",
          },
        }}
      >
        <DataGrid
          sx={{ border: "none", padding: "15px" }}
          autoHeight
          editMode="row"
          rowModesModel={rowModesModel}
          rows={pageState.data}
          rowCount={pageState.total}
          loading={pageState.isLoading}
          pageSizeOptions={[1, 2, 3]}
          pagination
          onPaginationModelChange={(paginationModel: GridPaginationModel) => {
            setPageState((old) => ({
              ...old,
              page: paginationModel.page,
              pageSize: paginationModel.pageSize,
            }));
          }}
          paginationModel={{
            pageSize: pageState.pageSize,
            page: pageState.page,
          }}
          paginationMode="server"
          columns={columnsDetails.filter(
            (column) => clmnVisibility[column.field]
          )}
          slots={{
            toolbar: EditToolbar,
            noRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                No Details
              </Stack>
            ),
            noResultsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                No Result
              </Stack>
            ),
          }}
          slotProps={{
            toolbar: {
              setPageState,
              setRowModesModel,
              setClmnVisibility,
              columnList: columnsDetails,
              columnMultiField: "none",
              tableTitle,
            },
          }}
          sortingMode="server"
          onSortModelChange={handleSortModelChange}
        />
      </Box>
    </>
  );
};

export default ReportGrid;
