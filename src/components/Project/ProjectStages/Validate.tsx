import { Box, Card, CardContent } from "@mui/material";
import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import {
  XModel,
  XView,
  getModelFromViewX,
  getViewFromModelX,
} from "../../../models/X";
import { makeHttpCall } from "../../../services/ApiService";
import {
  API_RESPONSE_CODE,
  ENTITY_NAME,
  HTTP_METHOD,
  OPERATION,
  SELECT_VALUES,
} from "../../../types/enums";
import {
  HttpCreateOneRequestBody,
  HttpGetAllRequestBody,
  HttpRequestData,
  HttpResponseCreateOne,
  HttpResponseGetAll,
  HttpResponseUpdateOne,
  HttpUpdateOneRequestBody,
} from "../../../types/httpTypes";
import FullFeaturedCrudGrid from "./AuditTable";
import { TabType, TableType } from "./MeasureBak";

function Validate() {
  // experiment

  // states
  const [rows, setRows] = React.useState<GridValidRowModel[]>([]);
  const [columnsDetails, setColumnsDetails] = React.useState<GridColDef[]>([]);

  // view refresh states
  const [reset, setReset] = React.useState<boolean>(true);

  // event handlers

  const saveHandler = (newData: GridValidRowModel) => {
    //save now
    createData({
      columnDate: newData.columnDate,
      columnSelect: newData.columnSelect,
      isDeleted: false,
      url: newData.url,
      isNew: newData.isNew,
    });
  };

  const updateHandler = (editData: GridValidRowModel) => {
    //edit now
    updateData({
      uid: editData.uid,
      url: editData.url,
      columnSelect: editData.columnSelect,
      columnDate: editData.columnDate,
      isDeleted: editData.isDeleted == 0 ? false : true,
      isNew: editData.isNew,
    });
  };

  useEffect(() => {
    setColumnsDetails([
      {
        field: "columnDate",
        headerName: "Date",
        width: 240,
        type: "date",
        editable: true,
      },
      {
        field: "columnSelect",
        headerName: "Select",
        width: 240,
        type: "singleSelect",
        editable: true,
        valueOptions: [SELECT_VALUES.VALUE_1, SELECT_VALUES.VALUE_2],
      },
    ]);

    getDataAll();
  }, []);

  // data operators
  const getDataAll = async () => {
    setReset(false);
    const requestDataAll: HttpRequestData<HttpGetAllRequestBody<XModel>> = {
      entityName: ENTITY_NAME.X,
      method: HTTP_METHOD.POST,
      operation: OPERATION.GET_ALL,
      body: {
        pageSize: 100,
        pageNumber: 0,
      },
    };

    const fetchData: HttpResponseGetAll<XModel> = await makeHttpCall<
      HttpResponseGetAll<XModel>,
      HttpGetAllRequestBody<XModel>
    >(requestDataAll);

    setRows(
      fetchData.data.map((row: XModel) => {
        const data: XView = getViewFromModelX(row);
        return data;
      })
    );

    setTimeout(() => {
      setReset(true);
    }, 100);
  };

  const createData = async (viewData: XView) => {
    setReset(false);
    const requestDataCreate: HttpRequestData<HttpCreateOneRequestBody<XModel>> =
      {
        entityName: ENTITY_NAME.X,
        method: HTTP_METHOD.POST,
        operation: OPERATION.CREATE_ONE,
        body: {
          data: getModelFromViewX(viewData),
        },
      };

    const createdData: HttpResponseCreateOne<XModel> = await makeHttpCall<
      HttpResponseCreateOne<XModel>,
      HttpCreateOneRequestBody<XModel>
    >(requestDataCreate);

    if (createdData.responseCode == API_RESPONSE_CODE.SUCCESS) {
      getDataAll().then(() => {
        setReset(true);
      });
    } else {
      setReset(true);
    }
  };

  const updateData = async (viewData: XView) => {
    setReset(false);

    const requestDataCreate: HttpRequestData<HttpUpdateOneRequestBody<XModel>> =
      {
        entityName: ENTITY_NAME.X,
        method: HTTP_METHOD.POST,
        operation: OPERATION.UPDATE_ONE,
        body: {
          data: getModelFromViewX(viewData),
        },
      };

    const updatedData: HttpResponseUpdateOne<XModel> = await makeHttpCall<
      HttpResponseUpdateOne<XModel>,
      HttpUpdateOneRequestBody<XModel>
    >(requestDataCreate);

    if (updatedData.responseCode == API_RESPONSE_CODE.SUCCESS) {
      getDataAll().then(() => {
        setReset(true);
      });
    } else {
      setReset(true);
    }
  };

  return (
    reset && (
      <>
        <Box marginTop={2}>
          <Card>
            <CardContent>
              <FullFeaturedCrudGrid
                updateHandler={updateHandler}
                saveHandler={saveHandler}
                hasAttachment={true}
                tableTitle="X"
                buttonTitle="Add X"
                initialColumns={columnsDetails}
                initialRows={rows}
                data={TableType.Audit}
                tab={TabType.Process}
              ></FullFeaturedCrudGrid>
            </CardContent>
          </Card>
        </Box>
      </>
    )
  );
}

export default Validate;
