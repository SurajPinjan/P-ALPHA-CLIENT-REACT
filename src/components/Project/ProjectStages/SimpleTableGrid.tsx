import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  styled,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  XDetailModel,
  XDetailView,
  getViewFromModelXDetail,
} from "../../../models/XDetail";
import { makeHttpCall } from "../../../services/ApiService";
import store from "../../../services/GlobalStateService";
import { urlDecodeString } from "../../../services/encoderService";
import {
  BLANK,
  ENTITY_NAME,
  HTTP_METHOD,
  OPERATION,
} from "../../../types/enums";
import { Filter } from "../../../types/filterTypes";
import {
  HttpGetAllRequestBody,
  HttpRequestData,
  HttpResponseGetAll,
} from "../../../types/httpTypes";
import { DataList } from "../../../types/types";
import UpdateXDetailDialogue from "../../Dialogues/UpdateXDetail";

interface Column {
  id: "stage" | "plan" | "actual" | "start1" | "end1" | "start2" | "end2";
  label: string;
  minWidth?: number;
  align?: "center";
  format?: (value: number) => string;
}

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

function ProjectSchedule() {
  // constants
  const columns: Column[] = [
    { id: "stage", label: "COLUMN_1", minWidth: 150 },
    { id: "plan", label: BLANK, minWidth: 150 },
  ];
  // states
  const navigate = useNavigate();
  const { data } = useParams();
  const [urlData, setUrlData] = React.useState<XDetailModel | undefined>();
  const [pageState, setPageState] = useState<DataList<XDetailView>>({
    isLoading: false,
    data: [],
  });
  const [updateRow, setUpdateRow] = React.useState<XDetailView>({
    columnDetail: BLANK,
    x_id: -1,
    isDeleted: false,
    isNew: false,
  });
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  //   event handlers
  const handleClick = (value: XDetailView) => {
    setIsOpen(true);
    if (value) {
      setUpdateRow({ ...value });
    }
  };

  //   Data operations

  const getDataAll = useCallback(async () => {
    setPageState((old) => ({ ...old, isLoading: true }));
    const filterArray: Filter[] = [];
    if (urlData && urlData.uid) {
      filterArray.push({
        column_name: "x_id",
        operator: "=",
        value: urlData.uid.toString(),
      });
    }
    const requestDataAll: HttpRequestData<HttpGetAllRequestBody> = {
      entityName: ENTITY_NAME.XDETAIL,
      method: HTTP_METHOD.POST,
      operation: OPERATION.GET_ALL,
      body: {
        filters: filterArray,
        sorts: [],
        pageSize: 100,
        pageNumber: 0,
      },
    };
    console.log("requestDataAll in user== ", requestDataAll);

    const fetchData: HttpResponseGetAll<XDetailModel> = await makeHttpCall<
      HttpResponseGetAll<XDetailModel>,
      HttpGetAllRequestBody
    >(requestDataAll, store, navigate);

    const dat: XDetailView[] = fetchData.data
      ? fetchData.data.map((row: XDetailModel) => {
          const data: XDetailView = getViewFromModelXDetail(row);
          return data;
        })
      : [];

    setPageState((old) => ({
      ...old,
      isLoading: false,
      data: dat,
      total: fetchData.totalCount,
    }));
  }, [navigate, urlData]);

  React.useEffect(() => {
    if (data) {
      setUrlData(urlDecodeString<XDetailModel>(data));
    }
  }, [data]);

  React.useEffect(() => {
    if (isOpen) setIsOpen(true);
  }, [isOpen]);

  React.useEffect(() => {
    getDataAll();
  }, [getDataAll]);

  return (
    <>
      {isOpen && (
        <UpdateXDetailDialogue
          xDetailOld={updateRow}
          onUpdate={(): void => {
            setIsOpen(false);
            getDataAll();
          }}
          isOpen={isOpen}
          onClose={(): void => {
            setIsOpen(false);
          }}
        ></UpdateXDetailDialogue>
      )}
      <TableContainer style={{ overflow: "hidden" }}>
        <Table aria-label="sticky table">
          <TableHeadStyled>
            <TableRow>
              {columns.map((column) => (
                <TableCellStyled
                  key={column.id}
                  align={column.align}
                  style={{
                    top: 57,
                    minWidth: column.minWidth,
                    fontWeight: "bold",
                  }}
                >
                  {column.label}
                </TableCellStyled>
              ))}
            </TableRow>
          </TableHeadStyled>
          <TableBody>
            {pageState.data.map((value: XDetailView) => (
              <TableRow>
                <SubTableCellStyled> {value.columnDetail}</SubTableCellStyled>
                <SubTableCellStyled>
                  <Button
                    autoFocus
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                      console.log(event.isTrusted);
                      handleClick(value);
                    }}
                  >
                    Update
                  </Button>
                </SubTableCellStyled>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ProjectSchedule;
