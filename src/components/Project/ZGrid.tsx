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
  GridRowsProp,
  GridSortModel,
  GridValidRowModel,
} from "@mui/x-data-grid";
import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "../../commons/Dialogues/FileUpload";
import ImagePreview from "../../commons/Dialogues/ImagePreview";
import {
  ZModel,
  ZView,
  getModelFromViewZ,
  getViewFromModelZ,
} from "../../models/Z";
import { makeHttpCall } from "../../services/ApiService";
import store from "../../services/GlobalStateService";
import {
  API_RESPONSE_CODE,
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
import { FileInfo } from "../../types/types";
import EditToolbar from "./ProjectStages/EditToolbar";
import ItemSavedPopup from "../../commons/Dialogues/ItemSavedDialogue";

export interface Page {
  isLoading: boolean;
  data: GridRowsProp;
  total: number;
  page: number;
  pageSize: number;
}

interface ZProps {
  isCompare?: boolean;
  saveHandler?: (newData: GridValidRowModel) => void;
  updateHandler?: (editData: GridValidRowModel) => void;
}

const ZGrid: React.FC<ZProps> = (props) => {
  // constants

  const columns = [];

  columns.push({
    field: "columnText",
    headerName: "Z",
    width: 240,
    editable: true,
  });

  // states
  const [pageState, setPageState] = useState<Page>({
    isLoading: false,
    data: [],
    total: 0,
    page: 0,
    pageSize: 2,
  });
  const [savedZID, setSavedZID] = React.useState<string | undefined>();
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
  const [sorts, setSorts] = React.useState<GridSortModel>([]);
  const [buttonTitle] = React.useState("Add Z");
  const [tableTitle] = React.useState("Z");

  // constants
  const columnsDetails: GridColDef[] = [...columns];

  if (hasAttachment) {
    columnsDetails.push({
      field: "url",
      headerName: "Url",
      type: "actions",
      width: 100,
      cellClassName: "attachment",
      getActions: ({ id }) => {
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
  }

  columnsDetails.push({
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
      entityName: ENTITY_NAME.Z,
      method: HTTP_METHOD.POST,
      operation: OPERATION.GET_ALL,
      body: {
        filters: filterArray,
        sorts: sorts,
        pageSize: pageState.pageSize,
        pageNumber: pageState.page,
      },
    };

    const fetchData: HttpResponseGetAll<ZModel> = await makeHttpCall<
      HttpResponseGetAll<ZModel>,
      HttpGetAllRequestBody
    >(requestDataAll, store, navigate);

    const dat: ZView[] = fetchData.data
      ? fetchData.data.map((row: ZModel) => {
          const data: ZView = getViewFromModelZ(row);
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

  const updateData = useCallback(
    async (viewData: ZView) => {
      const requestDataCreate: HttpRequestData<
        HttpUpdateOneRequestBody<ZModel>
      > = {
        entityName: ENTITY_NAME.Z,
        method: HTTP_METHOD.POST,
        operation: OPERATION.UPDATE_ONE,
        body: {
          data: getModelFromViewZ(viewData),
        },
      };

      const updatedData: HttpResponseUpdateOne<ZModel> = await makeHttpCall<
        HttpResponseUpdateOne<ZModel>,
        HttpUpdateOneRequestBody<ZModel>
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
    async (viewData: ZView) => {
      const requestDataCreate: HttpRequestData<
        HttpCreateOneRequestBody<ZModel>
      > = {
        entityName: ENTITY_NAME.Z,
        method: HTTP_METHOD.POST,
        operation: OPERATION.CREATE_ONE,
        body: {
          data: getModelFromViewZ(viewData),
        },
      };

      const createdData: HttpResponseCreateOne<ZModel> = await makeHttpCall<
        HttpResponseCreateOne<ZModel>,
        HttpCreateOneRequestBody<ZModel>
      >(requestDataCreate, store, navigate);

      if (createdData.responseCode == API_RESPONSE_CODE.SUCCESS_CREATE) {
        if (createdData.data.uid) setSavedZID(createdData.data.uid.toString());
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

  //   hooks

  useEffect(() => {
    getDataAll();
  }, [getDataAll, pageState.page, pageState.pageSize]);

  React.useEffect(() => {
    const entityFound: GridValidRowModel | undefined = findById(savedId);

    if (
      entityFound &&
      // props.saveHandler &&
      savedId != -1
    ) {
      createData({
        columnText: entityFound.columnText,
        isDeleted: false,
        isNew: entityFound.isNew,
      });
      // props.saveHandler(entityFound);
    }
  }, [createData, findById, props, savedId]);

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
        columnText: entityFound.columnText,
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

  const handleRowClick: GridEventListener<"rowClick"> = (
    params: GridRowParams<ZView>,
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
      {savedZID && (
        <ItemSavedPopup
          isOpen={true}
          itemName={`Z`}
          itemId={savedZID}
          onClose={() => {}}
        ></ItemSavedPopup>
      )}
      {imgRw && (
        <ImagePreview
          url={imgRw.url}
          type={imgRw.filetype}
          isOpen={isOpen}
          compare={isCompare}
          onClose={onClose}
        ></ImagePreview>
      )}
      {imgRw && (
        <FileUpload
          urlExisting={imgRw.url}
          existingFileType={imgRw.filetype}
          isOpen={isOpenUpload}
          onClose={onClose}
          onUpload={(data: FileInfo | undefined) => {
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

export default ZGrid;
