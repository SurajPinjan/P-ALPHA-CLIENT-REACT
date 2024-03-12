import CancelIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";
import SaveIcon from "@mui/icons-material/Save";
import {
  AppBar,
  Box,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridEventListener,
  GridPaginationModel,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  GridRowsProp,
  GridSortModel,
  GridValidRowModel,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import FileUpload from "../../commons/Dialogues/FileUpload";
import ImagePreview from "../../commons/Dialogues/ImagePreview";
import {
  XDetailWithXModel,
  XDetailWithXView,
  getViewFromModelXDetailWithX,
} from "../../models/DataTransfer/XDetailWithX";
import { XView } from "../../models/X";
import {
  XDetailModel,
  XDetailView,
  getModelFromViewXDetail,
} from "../../models/XDetail";
import { makeHttpCall } from "../../services/ApiService";
import store from "../../services/GlobalStateService";
import {
  API_RESPONSE_CODE,
  BLANK,
  ENTITY_NAME,
  HTTP_METHOD,
  OPERATION,
} from "../../types/enums";
import { Filter } from "../../types/filterTypes";
import {
  HttpCreateOneRequestBody,
  HttpGetAllRequestBody,
  HttpRequestData,
  HttpResponseCreateOne,
  HttpResponseGetAll,
  HttpResponseUpdateOne,
  HttpUpdateOneRequestBody,
} from "../../types/httpTypes";
import {
  GlobalState,
  SortableGridColDef,
  sortGridColDef,
} from "../../types/types";
import EditToolbar from "../Project/ProjectStages/EditToolbar";

export interface Page {
  isLoading: boolean;
  data: GridRowsProp;
  total: number;
  page: number;
  pageSize: number;
}

interface XDetailProps {
  isCompare?: boolean;
  saveHandler?: (newData: GridValidRowModel) => void;
  updateHandler?: (editData: GridValidRowModel) => void;
  saveData: XDetailView;
  xOptions: XView[];
}

const XDetailGrid = (props: XDetailProps & { selectUId?: number }) => {
  // constants
  const navigate = useNavigate();
  const columns: SortableGridColDef[] = [];

  columns.push({
    field: "columnDetail",
    headerName: "Column Detail",
    width: 240,
    editable: true,
    order: 0,
  });

  columns.push({
    field: "x_columnDate",
    headerName: "Date",
    width: 240,
    type: "date",
    editable: false,
    order: 1,
  });

  // states
  const [xId, setXId] = React.useState<number>(-1);
  const [sorts, setSorts] = React.useState<GridSortModel>([]);
  const [pageState, setPageState] = useState<Page>({
    isLoading: false,
    data: [],
    total: 0,
    page: 0,
    pageSize: 2,
  });
  // states
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpenUpload, setIsOpenUpload] = React.useState(false);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const [toDeleted, setToDeleted] = React.useState<boolean>(false);

  const [isCompare] = React.useState(props.isCompare);
  const [imgRw, setImgRw] = React.useState<GridValidRowModel | undefined>();
  const [hasAttachment] = React.useState(true);
  const [toUpdated, setToUpdated] = React.useState<boolean>(false);
  const [savedId, setSavedId] = React.useState<GridRowId>(-1);
  const [updateId, setUpdateId] = React.useState<GridRowId>(-1);
  const [saveData, setSaveData] = React.useState<XDetailView>({
    isDeleted: false,
    isNew: false,
    columnDetail: BLANK,
    x_id: 0,
    uid: undefined,
  });
  const [tableTitle] = React.useState("Y");

  const [xOptions, setXOptions] = React.useState<XView[]>([]);

  // constants
  const columnsDetails: SortableGridColDef[] = [...columns];

  columnsDetails.push({
    order: 2,
    field: "x_id",
    headerName: "X Entity FK",
    width: 240,
    type: "singleSelect",
    editable: true,
    valueOptions: [
      ...xOptions.map((x: XView) => {
        return { value: x.uid, label: x.columnUText };
      }),
    ],
    valueFormatter: ({ value }: GridValueFormatterParams<number>) => {
      for (let index = 0; index < xOptions.length; index++) {
        const option: XView = xOptions[index];
        if (option.uid && option.uid === value) {
          return option.columnUText;
        }
      }

      return value;
    },
  });

  if (hasAttachment) {
    columnsDetails.push({
      order: 3,
      field: "x_url",
      headerName: "Url",
      type: "actions",
      width: 100,
      cellClassName: "attachment",
      getActions: ({ id }) => {
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
  }

  columnsDetails.push({
    order: 4,
    field: "actions",
    type: "actions",
    headerName: "Actions",
    width: 100,
    cellClassName: "actions",
    getActions: ({ id }) => {
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

  //   data operations
  const getDataAll = useCallback(async () => {
    setPageState((old) => ({ ...old, isLoading: true }));
    const filterArray: Filter[] = [];
    filterArray.push({ column_name: "x_id", operator: "=", value: xId });

    const requestDataAll: HttpRequestData<HttpGetAllRequestBody> = {
      entityName: ENTITY_NAME.XDETAILWITHX,
      method: HTTP_METHOD.POST,
      operation: OPERATION.GET_ALL,
      body: {
        filters: filterArray,
        sorts: sorts,
        pageSize: pageState.pageSize,
        pageNumber: pageState.page,
      },
    };

    const fetchData: HttpResponseGetAll<XDetailWithXModel> = await makeHttpCall<
      HttpResponseGetAll<XDetailWithXModel>,
      HttpGetAllRequestBody
    >(requestDataAll, store, navigate);

    const dat: XDetailWithXView[] = fetchData.data
      ? fetchData.data.map((row: XDetailWithXModel) => {
          const data: XDetailWithXView = getViewFromModelXDetailWithX(row);
          return data;
        })
      : [];

    setPageState((old) => ({
      ...old,
      isLoading: false,
      data: dat,
      total: fetchData.totalCount,
    }));
  }, [navigate, pageState.page, pageState.pageSize, sorts, xId]);

  const updateData = useCallback(
    async (viewData: XDetailView) => {
      const requestDataCreate: HttpRequestData<
        HttpUpdateOneRequestBody<XDetailModel>
      > = {
        entityName: ENTITY_NAME.XDETAIL,
        method: HTTP_METHOD.POST,
        operation: OPERATION.UPDATE_ONE,
        body: {
          data: getModelFromViewXDetail(viewData),
        },
      };

      const updatedData: HttpResponseUpdateOne<XDetailModel> =
        await makeHttpCall<
          HttpResponseUpdateOne<XDetailModel>,
          HttpUpdateOneRequestBody<XDetailModel>
        >(requestDataCreate, store, navigate);

      if (updatedData.responseCode == API_RESPONSE_CODE.SUCCESS_UPDATE) {
        setPageState((old) => ({
          ...old,
          page: 0,
          pageSize: 2,
        }));
        getDataAll();
      }
    },
    [getDataAll, navigate]
  );

  const createData = useCallback(
    async (viewData: XDetailView) => {
      const requestDataCreate: HttpRequestData<
        HttpCreateOneRequestBody<XDetailModel>
      > = {
        entityName: ENTITY_NAME.XDETAIL,
        method: HTTP_METHOD.POST,
        operation: OPERATION.CREATE_ONE,
        body: {
          data: getModelFromViewXDetail(viewData),
        },
      };

      const createdData: HttpResponseCreateOne<XDetailModel> =
        await makeHttpCall<
          HttpResponseCreateOne<XDetailModel>,
          HttpCreateOneRequestBody<XDetailModel>
        >(requestDataCreate, store, navigate);

      if (createdData.responseCode == API_RESPONSE_CODE.SUCCESS_CREATE) {
        setPageState((old) => ({
          ...old,
          page: 0,
          pageSize: 2,
        }));
        getDataAll();
      } else {
        setUpdateId(-1);
        setToUpdated(false);
      }
    },
    [getDataAll, navigate]
  );

  // anonymous functions

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

  // event handlers

  const onClose = () => {
    setIsOpen(false);
    setIsOpenUpload(false);
  };

  const handleSortModelChange = (newSortModel: GridSortModel) => {
    setSorts(_.cloneDeep(newSortModel));
  };

  //   hooks
  useEffect(() => {
    setXId(props.selectUId ? props.selectUId : -1);
  }, [props.selectUId]);

  useEffect(() => {
    setSavedId(1);
    setSaveData((old) => ({
      ...old,
      columnDetail: props.saveData.columnDetail,
      x_id: props.saveData.x_id,
    }));
  }, [props.saveData, props.saveData.columnDetail]);

  useEffect(() => {
    getDataAll();
  }, [getDataAll, pageState.page, pageState.pageSize]);

  useEffect(() => {
    setXOptions(props.xOptions);
  }, [getDataAll, props.xOptions]);

  React.useEffect(() => {
    const entityFound: GridValidRowModel | undefined = findById(savedId);

    if (
      entityFound &&
      // props.saveHandler &&
      savedId != -1
    ) {
      createData({
        columnDetail: entityFound.columnDetail,
        isDeleted: false,
        x_id: entityFound.x_id,
        isNew: entityFound.isNew,
      });
      // props.saveHandler(entityFound);
    }
  }, [createData, findById, props, savedId]);

  React.useEffect(() => {
    if (
      savedId != -1 &&
      saveData.columnDetail !== BLANK &&
      saveData.x_id !== 0
    ) {
      setSavedId(-1);
      createData(saveData);
    }
  }, [createData, saveData, savedId]);

  React.useEffect(() => {
    const entityFound: GridValidRowModel | undefined = findById(updateId);
    if (
      entityFound &&
      // props.updateHandler &&
      updateId !== -1 &&
      toUpdated
    ) {
      if (toDeleted) {
        setToDeleted(false);
        entityFound.isDeleted = 1;
      }
      setToUpdated(false);
      updateData({
        uid: entityFound.uid,
        x_id: entityFound.x_id,
        columnDetail: entityFound.columnDetail,
        isDeleted: entityFound.isDeleted == 0 ? false : true,
        isNew: entityFound.isNew,
      });
      // props.updateHandler(entityFound);
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

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    setToUpdated(true);
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setToUpdated(true);
    setToDeleted(true);
    setUpdateId(id);
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
    params: GridRowParams<XDetailWithXView>,
    event
  ) => {
    console.log(event.isTrusted);
    const selectedRowData = params.row;
    if (params.row) {
      console.log("Clicked row:", selectedRowData);
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

  //   dom

  return (
    <>
      {imgRw && (
        <ImagePreview
          url={imgRw.url}
          isOpen={isOpen}
          compare={isCompare}
          onClose={onClose}
        ></ImagePreview>
      )}
      {imgRw && (
        <FileUpload
          urlExisting={imgRw.url}
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
      <Box>
        <AppBar>
          <Toolbar>
            <Typography variant="h6" component="div">
              X Detail Grid
            </Typography>
          </Toolbar>
        </AppBar>
        <Container style={{ marginTop: 100, marginBottom: 100 }}>
          <DataGrid
            sx={{ border: "none", padding: "15px" }}
            autoHeight
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            onRowClick={handleRowClick}
            processRowUpdate={processRowUpdate}
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
            columns={columnsDetails.sort(sortGridColDef)}
            slots={{
              toolbar: EditToolbar,
              noRowsOverlay: () => (
                <Stack
                  height="100%"
                  alignItems="center"
                  justifyContent="center"
                >
                  No Details
                </Stack>
              ),
              noResultsOverlay: () => (
                <Stack
                  height="100%"
                  alignItems="center"
                  justifyContent="center"
                >
                  No Result
                </Stack>
              ),
            }}
            slotProps={{
              toolbar: {
                setPageState,
                setRowModesModel,
                columnList: [],
                tableTitle,
              },
            }}
            sortingMode="server"
            onSortModelChange={handleSortModelChange}
          />
        </Container>
      </Box>
    </>
  );
};

const mapStateToProps = (state: GlobalState) => ({
  selectUId: state.selectUId,
});

const XDetailGridWithState = connect(mapStateToProps)(XDetailGrid);
export default XDetailGridWithState;
