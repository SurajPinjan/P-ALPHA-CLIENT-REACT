import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ImageIcon from "@mui/icons-material/Image";
import SaveIcon from "@mui/icons-material/Save";
import { Box, Stack } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridPaginationModel,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { DateTime } from "luxon";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  XModel,
  XView,
  getModelFromViewX,
  getViewFromModelX,
} from "../../../models/X";
import { makeHttpCall } from "../../../services/ApiService";
import store from "../../../services/GlobalStateService";
import {
  API_RESPONSE_CODE,
  ENTITY_NAME,
  HTTP_METHOD,
  OPERATION,
  SELECT_VALUES,
} from "../../../types/enums";
import { Filter } from "../../../types/filterTypes";
import {
  HttpCreateOneRequestBody,
  HttpGetAllRequestBody,
  HttpRequestData,
  HttpResponseCreateOne,
  HttpResponseGetAll,
  HttpResponseUpdateOne,
  HttpUpdateOneRequestBody,
} from "../../../types/httpTypes";
import { Page } from "../../../types/types";
import EditToolbarV2 from "../ProjectStages/EditToolbarV2";
import { urlEncodeObject } from "../../../services/encoderService";
import ImagePreview from "../../../commons/Dialogues/ImagePreview";
import FileUpload from "../../../commons/Dialogues/FileUpload";

interface XProps {
  isCompare?: boolean;
  x_id: number;
  clickHandler: () => void;
  saveHandler?: (newData: GridValidRowModel) => void;
  updateHandler?: (editData: GridValidRowModel) => void;
}

const XGrid: React.FC<XProps> = (props) => {
  const navigate = useNavigate();

  // columns.push({
  //   field: "columnDate",
  //   headerName: "Date",
  //   width: 240,
  //   type: "date",
  //   editable: true,
  // });

  // columns.push({
  //   field: "columnUText",
  //   headerName: "Unique Text",
  //   width: 240,
  //   editable: true,
  // });

  // columns.push({
  //   field: "columnNumber",
  //   headerName: "Column Number",
  //   width: 240,
  //   type: "number",
  //   editable: true,
  //   order: 0,
  // });

  const [pageState, setPageState] = useState<Page>({
    isLoading: false,
    data: [],
    total: 0,
    page: 0,
    pageSize: 5,
  });

  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  const [imgRw, setImgRw] = React.useState<GridValidRowModel | undefined>();
  const [toDeleted, setToDeleted] = React.useState<boolean>(false);
  const [toUpdated, setToUpdated] = React.useState<boolean>(false);
  const [savedId, setSavedId] = React.useState<GridRowId>(-1);
  const [updateId, setUpdateId] = React.useState<GridRowId>(-1);
  const [tableTitle] = React.useState("Xs");

  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpenUpload, setIsOpenUpload] = React.useState(false);

  const columnsDetails: unknown[] = [];

  columnsDetails.push({
    field: "columnDate",
    headerName: "Date",
    width: 240,
    type: "date",
    editable: true,
  });

  columnsDetails.push({
    field: "columnUText",
    headerName: "Unique Text",
    width: 240,
    editable: true,
  });

  columnsDetails.push({
    field: "columnNumber",
    headerName: "Column Number",
    width: 240,
    type: "number",
    editable: true,
    order: 0,
  });

  columnsDetails.push({
    field: "columnSelect",
    headerName: "Select",
    width: 240,
    type: "singleSelect",
    editable: true,
    valueOptions: [SELECT_VALUES.VALUE_1, SELECT_VALUES.VALUE_2],
  });

  columnsDetails.push({
    field: "url",
    headerName: "Url",
    type: "actions",
    width: 100,
    cellClassName: "attachment",
    getActions: ({ id }: { id: number }) => {
      const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

      if (isInEditMode) {
        return [
          <GridActionsCellItem
            icon={<FileUploadIcon />}
            label="Upload"
            sx={{
              color: "primary.main",
            }}
            onClick={() => {
              setImgRw(undefined);
              setTimeout(() => {
                const dat = findById(id);
                setImgRw(dat);
                setIsOpenUpload(true);
              }, 200);
            }}
          />,
        ];
      }

      return [
        <GridActionsCellItem
          icon={<ImageIcon />}
          label="Edit"
          className="textPrimary"
          color="inherit"
          onClick={() => {
            setImgRw(undefined);
            setTimeout(() => {
              const dat = findById(id);
              setImgRw(dat);
              setIsOpen(true);
            }, 200);
          }}
        />,
      ];
    },
  });

  columnsDetails.push({
    field: "navigate",
    type: "actions",
    headerName: "Navigate",
    width: 100,
    cellClassName: "navigate",
    getActions: ({ id }: { id: number }) => {
      const x: GridValidRowModel | undefined = findById(id);

      const isValue1: boolean =
        x && x.columnSelect && x.columnSelect === SELECT_VALUES.VALUE_1;

      return [
        <GridActionsCellItem
          disabled={isValue1}
          icon={<AddIcon />}
          label="Edit"
          className="textPrimary"
          onClick={() => {
            navigate(
              `/dashboard/charter_update/${urlEncodeObject<
                GridValidRowModel | undefined
              >(x)}`
            );
          }}
          color="inherit"
        />,
      ];
    },
  });

  columnsDetails.push({
    field: "actions",
    type: "actions",
    headerName: "Actions",
    width: 100,
    cellClassName: "actions",
    getActions: ({ id }: { id: number }) => {
      const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

      if (isInEditMode) {
        return [
          <GridActionsCellItem
            icon={<SaveIcon />}
            label="Save"
            sx={{
              color: "primary.main",
            }}
            onClick={handleSaveClick(id)}
          />,
          <GridActionsCellItem
            icon={<CancelIcon />}
            label="Cancel"
            className="textPrimary"
            onClick={handleCancelClick(id)}
            color="inherit"
          />,
        ];
      }

      return [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          className="textPrimary"
          onClick={handleEditClick(id)}
          color="inherit"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={handleDeleteClick(id)}
          color="inherit"
        />,
      ];
    },
  });
  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    setToUpdated(true);
  };

  const getDataAll = useCallback(async () => {
    setPageState((old: Page) => ({ ...old, isLoading: true }));

    const filterArray: Filter[] = [
      // {
      //   column_name: "x_id",
      //   operator: "=",
      //   value: JSON.stringify(props.x_id),
      // },
    ];

    const requestDataAll: HttpRequestData<HttpGetAllRequestBody> = {
      entityName: ENTITY_NAME.X,
      method: HTTP_METHOD.POST,
      operation: OPERATION.GET_ALL,
      body: {
        pageSize: pageState.pageSize,
        pageNumber: pageState.page,
        filters: filterArray,
        sorts: [],
      },
    };

    const fetchData: HttpResponseGetAll<XModel> = await makeHttpCall<
      HttpResponseGetAll<XModel>,
      HttpGetAllRequestBody
    >(requestDataAll, store, navigate);
    const dat: XView[] = fetchData.data.map((row: XModel) => {
      const data: XView = getViewFromModelX(row);
      return data;
    });

    setPageState((old: Page) => ({
      ...old,
      isLoading: false,
      data: dat,
      total: fetchData.totalCount,
    }));
  }, [pageState.pageSize, pageState.page, navigate]);

  const updateData = useCallback(
    async (viewData: XView) => {
      const requestDataCreate: HttpRequestData<
        HttpUpdateOneRequestBody<XModel>
      > = {
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
      >(requestDataCreate, store, navigate);

      if (updatedData.responseCode == API_RESPONSE_CODE.SUCCESS_UPDATE) {
        setPageState((old: Page) => ({
          ...old,
          page: 0,
          pageSize: 5,
        }));
        getDataAll();
      }
    },
    [getDataAll, navigate]
  );

  const createData = useCallback(
    async (viewData: XView) => {
      const requestDataCreate: HttpRequestData<
        HttpCreateOneRequestBody<XModel>
      > = {
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
      >(requestDataCreate, store, navigate);

      if (createdData.responseCode == API_RESPONSE_CODE.SUCCESS_CREATE) {
        setPageState((old: Page) => ({
          ...old,
          page: 0,
          pageSize: 5,
        }));
        getDataAll();
      } else {
        getDataAll();
      }
    },
    [getDataAll, navigate]
  );

  const findById = useCallback(
    (id: GridRowId): GridValidRowModel | undefined => {
      for (let index = 0; index < pageState.data.length; index++) {
        const element: GridValidRowModel = pageState.data[index];
        if (element.id === id) {
          return element;
        }
      }
      return undefined;
    },
    [pageState.data]
  );

  useEffect(() => {
    getDataAll();
  }, [getDataAll, pageState.page, pageState.pageSize]);

  React.useEffect(() => {
    const entityFound: GridValidRowModel | undefined = findById(savedId);

    if (entityFound && savedId != -1) {
      createData({
        columnDate: entityFound.columnDate,
        columnNumber: entityFound.columnNumber,
        columnSelect: entityFound.columnSelect,
        columnUText: entityFound.columnUText,
        columnMultiValue: entityFound.columnMultiValue,
        isDeleted: false,
        url: entityFound.url,
        isNew: entityFound.isNew,
      });
    }
  }, [createData, findById, props, savedId]);

  React.useEffect(() => {
    const entityFound: GridValidRowModel | undefined = findById(updateId);

    if (entityFound && updateId !== -1 && toUpdated) {
      if (toDeleted) {
        setToDeleted(false);
        entityFound.isDeleted = 1;
      }
      setToUpdated(false);
      updateData({
        uid: entityFound.uid,
        url: entityFound.url,
        columnNumber: entityFound.columnNumber,
        columnUText: entityFound.columnUText,
        columnMultiValue: entityFound.columnMultiValue,
        columnSelect: entityFound.columnSelect,
        columnDate: entityFound.columnDate,
        isDeleted: entityFound.isDeleted == 0 ? false : true,
        isNew: entityFound.isNew,
      });
    }
  }, [findById, props, toDeleted, toUpdated, updateData, updateId]);

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });

    setTimeout(() => {
      if (toUpdated) {
        setUpdateId(id);
      } else {
        setSavedId(id);
      }
    }, 500);
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setToUpdated(false);
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = pageState.data.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setPageState((old) => ({
        ...old,
        data: pageState.data.filter((row) => row.id !== id),
      }));
    }
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleRowClick: GridEventListener<"rowClick"> = (
    params: GridRowParams<XView>,
    event
  ) => {
    console.log(event.isTrusted);
    props.clickHandler();

    if (params.row) {
      const selectedRowData = params.row;
      const toast = () => ({
        type: "DUMMYTYPE",
        _Code: "",
        _DisplayMsg: "",
        apiTime: DateTime.now().toISO(),
        _ErrMsg: undefined,
        _APIBody: "",
        _APIUrl: "",
        _SelectUId: selectedRowData.uid,
        _SidePannelExpand: false,
      });

      store.dispatch(toast());
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setPageState((old) => ({
      ...old,
      data: old.data.map((row) => (row.id === newRow.id ? updatedRow : row)),
    }));
    return updatedRow;
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setToUpdated(true);
    setToDeleted(true);
    setUpdateId(id);
  };

  const onClose = () => {
    setIsOpen(false);
    setIsOpenUpload(false);
  };

  return (
    <>
      {imgRw && (
        <ImagePreview
          url={imgRw.url}
          type={imgRw.filetype}
          isOpen={isOpen}
          compare={false}
          onClose={onClose}
        ></ImagePreview>
      )}
      {imgRw && (
        <FileUpload
          urlExisting={imgRw.url}
          existingFileType={imgRw.filetype}
          isOpen={isOpenUpload}
          onClose={onClose}
          onUpload={(
            data:
              | {
                  url: string;
                  filesize: number;
                  filetype: string;
                  filename: string;
                }
              | undefined
          ) => {
            if (imgRw && data) {
              imgRw.url = data.url;
            }
          }}
          onSave={onClose}
        ></FileUpload>
      )}
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
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          rows={pageState.data}
          onRowClick={handleRowClick}
          rowCount={pageState.total}
          loading={pageState.isLoading}
          pageSizeOptions={[5, 10, 15]}
          pagination
          onPaginationModelChange={(paginationModel: GridPaginationModel) => {
            setPageState((old: Page) => ({
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
          columns={columnsDetails as GridColDef[]}
          slots={{
            toolbar: EditToolbarV2,
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
              columnMultiField: "tools_used",
              tableTitle,
            },
          }}
        />
      </Box>
    </>
  );
};

export default XGrid;
