import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  styled
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import React, { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  XDetailModel,
  XDetailView,
  getModelFromViewXDetail,
  getViewFromModelXDetail,
} from "../../../models/XDetail";
import { makeHttpCall } from "../../../services/ApiService";
import store from "../../../services/GlobalStateService";
import { urlDecodeString } from "../../../services/encoderService";
import {
  API_RESPONSE_CODE,
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
  HttpResponseUpdateOne,
  HttpUpdateOneRequestBody,
} from "../../../types/httpTypes";
import { DataList } from "../../../types/types";

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

interface EditMatrix {
  uid?: number;
  columnDetail: boolean;
}

function ProjectScheduleInlineEdit() {
  // constants
  const columns: Column[] = [
    { id: "stage", label: "COLUMN_1", minWidth: 150 },
    { id: "plan", label: BLANK, minWidth: 150 },
  ];
  // states
  const navigate = useNavigate();
  const { data } = useParams();
  const [urlData, setUrlData] = React.useState<XDetailModel | undefined>();
  const [editing, setEditing] = React.useState<boolean>(false);
  const [updateRow, setUpdateRow] = React.useState<XDetailView | undefined>(undefined);
  const [editMatrix, setEditMatrix] = React.useState<EditMatrix[]>([]);
  const [pageState, setPageState] = useState<DataList<XDetailView>>({
    isLoading: false,
    data: [],
  });

  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  //  event handlers

  const onSaveClick = (index: number) => {


    if (editing === true && updateRow) {
      updateData(updateRow, index);
    }
    setEditing(false);


  };

  const onCancelClickColumnDetail = (index: number) => {
    if (editing === true) {
      const tempMatrix = editMatrix;
      tempMatrix[index].columnDetail = false;
      setEditMatrix([...editMatrix, ...tempMatrix]);
      setUpdateRow(undefined);
    }
    setEditing(false);

  };

  const onColumnDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editing === true && updateRow) {
      setUpdateRow({ ...updateRow, columnDetail: e.target.value });
    }
  };

  const onEditClickColumnDetial = (index: number, value: XDetailView) => {


    if (editing === false) {
      setEditing(true);
      setUpdateRow(value);

      const tempMatrix = editMatrix;
      tempMatrix[index].columnDetail = true;
      setEditMatrix([...editMatrix, ...tempMatrix]);
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

  const updateData = useCallback(
    async (viewData: XDetailView, index: number) => {
      const requestDataCreate: HttpRequestData<HttpUpdateOneRequestBody<XDetailModel>> =
      {
        entityName: ENTITY_NAME.XDETAIL,
        method: HTTP_METHOD.POST,
        operation: OPERATION.UPDATE_ONE,
        body: {
          data: getModelFromViewXDetail(viewData),
        },
      };

      const updatedData: HttpResponseUpdateOne<XDetailModel> = await makeHttpCall<
        HttpResponseUpdateOne<XDetailModel>,
        HttpUpdateOneRequestBody<XDetailModel>
      >(requestDataCreate, store, navigate);

      const tempMatrix = editMatrix;
        tempMatrix[index].columnDetail = false;
        setEditMatrix([...editMatrix, ...tempMatrix]);

      if (updatedData.responseCode == API_RESPONSE_CODE.SUCCESS_UPDATE) {

        

        setPageState((old) => ({
          ...old,
          page: 0,
          pageSize: 2,
        }));

        getDataAll();
      }
    },
    [getDataAll, navigate, editMatrix]
  );

  // hooks

  React.useEffect(() => {
    if (data) {
      setUrlData(urlDecodeString<XDetailModel>(data));
    }
  }, [data]);

  React.useEffect(() => {
    if (pageState) {
      const tempMatrix = [];

      for (let index = 0; index < pageState.data.length; index++) {
        const dat = pageState.data[index];
        tempMatrix.push({ uid: dat.uid, columnDetail: false })

      }
      setEditMatrix(tempMatrix);
    }
  }, [pageState]);

  React.useEffect(() => {
    if (isOpen) setIsOpen(true);
  }, [isOpen]);

  React.useEffect(() => {
    getDataAll();
  }, [getDataAll]);

  return (
    <>
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
          {editMatrix && editMatrix.length !== 0 && <TableBody>
            {pageState.data.map((value: XDetailView, index: number) => (
              <TableRow>
                <SubTableCellStyled>
                  {!editMatrix[index].columnDetail &&
                    <>
                      {value.columnDetail}
                      <EditIcon style={{ float: `right` }} onClick={() => { onEditClickColumnDetial(index, value) }} />
                    </>
                  }
                  {editMatrix[index].columnDetail &&
                    <>
                      {updateRow && (<input type="text" value={updateRow.columnDetail} onChange={
                        (e: React.ChangeEvent<HTMLInputElement>) => {
                          onColumnDetailChange(e);
                        }
                      } />)}
                      <SaveIcon style={{ float: `right` }} onClick={() => onSaveClick(index)} />
                      <CancelIcon style={{ float: `right` }} onClick={() => {
                        onCancelClickColumnDetail(index)
                      }} />
                    </>
                  }
                </SubTableCellStyled>
              </TableRow>
            ))}
          </TableBody>
          }
        </Table>
      </TableContainer>
    </>
  );
}

export default ProjectScheduleInlineEdit;
