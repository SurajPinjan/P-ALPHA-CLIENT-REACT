import CancelIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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
  GridSortModel,
  GridValidRowModel,
} from "@mui/x-data-grid";
import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import FileUpload from "../../../commons/Dialogues/FileUpload";
import ImagePreview from "../../../commons/Dialogues/ImagePreview";
import {
  YModel,
  YView,
  getModelFromViewY,
  getViewFromModelY,
} from "../../../models/Y";
import { makeHttpCall } from "../../../services/ApiService";
import store from "../../../services/GlobalStateService";
import {
  API_RESPONSE_CODE,
  ENTITY_NAME,
  HTTP_METHOD,
  OPERATION,
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
import { GlobalState, Page } from "../../../types/types";
import EditToolbar from "../ProjectStages/EditToolbarV2";

interface YProps {
  isCompare?: boolean;
  x_id: number;
  isPrestine: boolean;
  saveHandler?: (newData: GridValidRowModel) => void;
  updateHandler?: (editData: GridValidRowModel) => void;
}

const YGrid: React.FC<YProps> = (props: YProps & { selectUId?: number }) => {
  // constants

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

  const [imgRw, setImgRw] = React.useState<GridValidRowModel | undefined>();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpenUpload, setIsOpenUpload] = React.useState(false);
  const [toDeleted, setToDeleted] = React.useState<boolean>(false);
  const [toUpdated, setToUpdated] = React.useState<boolean>(false);
  const [savedId, setSavedId] = React.useState<GridRowId>(-1);
  const [updateId, setUpdateId] = React.useState<GridRowId>(-1);
  const [xId, setXId] = React.useState<number>(-1);
  const [sorts, setSorts] = React.useState<GridSortModel>([]);
  const [buttonTitle] = React.useState("Add Y");
  const [tableTitle] = React.useState("Y");

  // add columns

  // constants
  const columnsDetails: unknown[] = [];

  columnsDetails.push({
    field: "columnText",
    headerName: "Text",
    width: 240,
    editable: true,
    order: 0,
  });

  columnsDetails.push({
    order: 3,
    field: "x_url",
    headerName: "Url",
    type: "actions",
    width: 100,
    cellClassName: "attachment",
    getActions: ({ id }: { id: number }) => {
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

  // 3rd party hooks

  const navigate = useNavigate();

  //   data operations
  const getDataAll = useCallback(async () => {
    setPageState((old) => ({ ...old, isLoading: true }));
    const filterArray: Filter[] = [];
    filterArray.push({
      column_name: "x_id",
      operator: "=",
      value: xId,
    });

    const requestDataAll: HttpRequestData<HttpGetAllRequestBody> = {
      entityName: ENTITY_NAME.Y,
      method: HTTP_METHOD.POST,
      operation: OPERATION.GET_ALL,
      body: {
        filters: filterArray,
        sorts: sorts,
        pageSize: pageState.pageSize,
        pageNumber: pageState.page,
      },
    };

    const fetchData: HttpResponseGetAll<YModel> = await makeHttpCall<
      HttpResponseGetAll<YModel>,
      HttpGetAllRequestBody
    >(requestDataAll, store, navigate);

    const dat: YView[] = fetchData.data
      ? fetchData.data.map((row: YModel) => {
          const data: YView = getViewFromModelY(row);
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
    async (viewData: YView) => {
      const requestDataCreate: HttpRequestData<
        HttpUpdateOneRequestBody<YModel>
      > = {
        entityName: ENTITY_NAME.Y,
        method: HTTP_METHOD.POST,
        operation: OPERATION.UPDATE_ONE,
        body: {
          data: getModelFromViewY(viewData),
        },
      };

      const updatedData: HttpResponseUpdateOne<YModel> = await makeHttpCall<
        HttpResponseUpdateOne<YModel>,
        HttpUpdateOneRequestBody<YModel>
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
    async (viewData: YView) => {
      const requestDataCreate: HttpRequestData<
        HttpCreateOneRequestBody<YModel>
      > = {
        entityName: ENTITY_NAME.Y,
        method: HTTP_METHOD.POST,
        operation: OPERATION.CREATE_ONE,
        body: {
          data: getModelFromViewY(viewData),
        },
      };

      const createdData: HttpResponseCreateOne<YModel> = await makeHttpCall<
        HttpResponseCreateOne<YModel>,
        HttpCreateOneRequestBody<YModel>
      >(requestDataCreate, store, navigate);

      if (createdData.responseCode == API_RESPONSE_CODE.SUCCESS_CREATE) {
        setPageState((old) => ({
          ...old,
          page: 0,
          pageSize: 2,
        }));
        getDataAll();
      } else {
        getDataAll();
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

  //   hooks

  useEffect(() => {
    getDataAll();
  }, [getDataAll, pageState.page, pageState.pageSize]);

  React.useEffect(() => {
    const entityFound: YView | undefined = findById(savedId) as
      | YView
      | undefined;

    if (
      entityFound &&
      // props.saveHandler &&
      savedId != -1
    ) {
      createData({
        ...entityFound,
        ...{ x_id: xId ? xId : -1, isDeleted: false },
      });
      // props.saveHandler(entityFound);
    }
  }, [createData, findById, props, savedId, xId]);

  React.useEffect(() => {
    const entityFound: GridValidRowModel | undefined = findById(updateId);
    const ssvToolsFound: YView | undefined = entityFound as YView | undefined;

    if (
      ssvToolsFound &&
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
        ...ssvToolsFound,
        x_id: xId ? xId : -1,
        isDeleted: entityFound.isDeleted == 0 ? false : true,
      });
      // props.updateHandler(entityFound);
    }
  }, [findById, props, toDeleted, toUpdated, updateData, updateId, xId]);

  useEffect(() => {
    if (props.selectUId && props.selectUId !== -1) {
      setXId(props.selectUId);
    }
  }, [props.selectUId]);

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

  const handleSortModelChange = (newSortModel: GridSortModel) => {
    setSorts(_.cloneDeep(newSortModel));
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
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

  const onClose = () => {
    setIsOpen(false);
    setIsOpenUpload(false);
  };

  //   dom

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
          columns={columnsDetails as GridColDef[]}
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
              tableTitle,
              buttonTitle,
            },
          }}
          sortingMode="server"
          onSortModelChange={handleSortModelChange}
        />
      </Box>
    </>
  );
};

const mapStateToProps = (state: GlobalState) => ({
  selectUId: state.selectUId,
});

const YGridWithState = connect(mapStateToProps)(YGrid);
export default YGridWithState;
