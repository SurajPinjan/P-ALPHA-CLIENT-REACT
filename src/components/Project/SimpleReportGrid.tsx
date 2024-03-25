import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  styled,
} from "@mui/material";
import { GridSortModel, GridValidRowModel } from "@mui/x-data-grid";
import React, { useCallback, useState } from "react";
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
import { Page } from "../../types/types";

const TableHeadStyled = styled("thead")({
  background: "#00B0AB",
  borderBottom: "none",
  color: "#ffffff",
});

const TableCellStyled = styled(TableCell)({
  padding: "5px",
  borderRight: "1px solid #ddd",
});
const SubTableCellStyled = styled(TableCell)({
  padding: "5px",
  borderRight: "1px solid #ddd",
  lineHeight: "0.5",
});

const TableRowStyled = styled(TableRow)({});

function SavingReport() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [sorts] = React.useState<GridSortModel>([]);

  const [pageState, setPageState] = useState<Page>({
    isLoading: false,
    data: [],
    total: 0,
    page: 0,
    pageSize: 5,
  });

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

  React.useEffect(() => {
    getDataAll();
  }, [getDataAll]);

  React.useEffect(() => {
    if (isOpen) setIsOpen(true);
  }, [isOpen]);

  const handleChangePage1 = (event: unknown, newPage1: number) => {
    console.log(event);
    setPageState({ ...pageState, ...{ page: newPage1 } });
  };
  const handleChangeRowsPerPage1 = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPageState({
      ...pageState,
      ...{ pageSize: parseInt(event.target.value, 10), page: 0 },
    });
  };

  const columns = [];

  columns.push(
    {
      field: "url",
      headerName: "URL",
      width: 240,
      editable: true,
    },
    {
      field: "uniqueText",
      headerName: "Unique Text",
      width: 240,
      editable: true,
    },
    {
      field: "calculatedColumnA",
      headerName: "Calculated Value A",
      width: 240,
      editable: true,
    }
  );

  return (
    <>
      <TableContainer style={{ overflow: "hidden" }}>
        <Table aria-label="sticky table">
          <TableHeadStyled>
            <TableRowStyled>
              {columns.map((colData) => (
                <TableCellStyled align="center" style={{ fontWeight: "bold" }}>
                  {colData.headerName}
                </TableCellStyled>
              ))}
            </TableRowStyled>
          </TableHeadStyled>
          <TableBody>
            {pageState.data &&
              pageState &&
              pageState.data.map(
                (cellData: GridValidRowModel, cellIndex: number) => (
                  <TableRow key={`row ${cellIndex}`}>
                    <SubTableCellStyled key={cellIndex}>
                      {cellData.url}
                    </SubTableCellStyled>
                    <SubTableCellStyled key={cellIndex}>
                      {cellData.columnUText}
                    </SubTableCellStyled>
                    <SubTableCellStyled key={cellIndex}>
                      {cellData.computedColumnA}
                    </SubTableCellStyled>
                  </TableRow>
                )
              )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          count={pageState.total}
          rowsPerPage={pageState.pageSize}
          page={pageState.page}
          onPageChange={handleChangePage1}
          onRowsPerPageChange={handleChangeRowsPerPage1}
        />
      </TableContainer>
    </>
  );
}

export default SavingReport;
