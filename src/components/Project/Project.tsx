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
  GridEventListener,
  GridPaginationModel,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridValidRowModel,
} from "@mui/x-data-grid";
import React, { useCallback, useEffect, useState } from "react";
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
  XModel,
  XView,
  getModelFromViewX,
  getViewFromModelX,
} from "../../models/X";
import {
  API_RESPONSE_CODE,
  ENTITY_NAME,
  HTTP_METHOD,
  OPERATION,
  SELECT_VALUES,
  USER_ROLES,
} from "../../types/enums";
import { makeHttpCall } from "../../services/ApiService";
import ImagePreview from "../../commons/Dialogues/ImagePreview";
import { GridColDef } from "@mui/x-data-grid";
import { GridRowModesModel } from "@mui/x-data-grid";
import { GridRowModes } from "@mui/x-data-grid";
import { GridActionsCellItem } from "@mui/x-data-grid";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import AddIcon from "@mui/icons-material/Add";
import { GridRowsProp } from "@mui/x-data-grid";
import ImageIcon from "@mui/icons-material/Image";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUpload from "../../commons/Dialogues/FileUpload";
import EditToolbar from "./ProjectStages/EditToolbar";
import { MasterView } from "../../models/Master";
import { useNavigate } from "react-router-dom";
import { urlEncodeObject } from "../../services/encoderService";

export interface Page {
  isLoading: boolean;
  data: GridRowsProp;
  total: number;
  page: number;
  pageSize: number;
}

interface AdminProps {
  isCompare?: boolean;
  saveHandler?: (newData: GridValidRowModel) => void;
  updateHandler?: (editData: GridValidRowModel) => void;
  filters: MasterView;
}

const Admin: React.FC<AdminProps> = (props) => {
  // constants
  const role: string | null = localStorage.getItem("userrole");

  const columns = [];

  columns.push({
    field: "columnDate",
    headerName: "Date",
    width: 240,
    type: "date",
    editable: true,
  });

  const isAdmin: boolean =
    typeof role !== "undefined" && role !== null && role === USER_ROLES.ADMIN;

  columns.push({
    field: "columnSelect",
    headerName: "Select",
    width: 240,
    type: "singleSelect",
    editable: isAdmin ? true : false,
    valueOptions: [SELECT_VALUES.VALUE_1, SELECT_VALUES.VALUE_2],
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
  const [buttonTitle] = React.useState("Add X");
  const [tableTitle] = React.useState("X");

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

  if (isAdmin) {
    columnsDetails.push({
      field: "navigate",
      type: "actions",
      headerName: "Navigate",
      width: 100,
      cellClassName: "navigate",
      getActions: ({ id }) => {
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

  // 3rd party hooks

  const navigate = useNavigate();

  //   data operations
  const getDataAll = useCallback(async () => {
    setPageState((old) => ({ ...old, isLoading: true }));
    const requestDataAll: HttpRequestData<HttpGetAllRequestBody<XModel>> = {
      entityName: ENTITY_NAME.X,
      method: HTTP_METHOD.POST,
      operation: OPERATION.GET_ALL,
      body: {
        pageSize: pageState.pageSize,
        pageNumber: pageState.page,
      },
    };

    const fetchData: HttpResponseGetAll<XModel> = await makeHttpCall<
      HttpResponseGetAll<XModel>,
      HttpGetAllRequestBody<XModel>
    >(requestDataAll);

    const dat: XView[] = fetchData.data.map((row: XModel) => {
      const data: XView = getViewFromModelX(row);
      return data;
    });

    setPageState((old) => ({
      ...old,
      isLoading: false,
      data: dat,
      total: fetchData.totalCount,
    }));
  }, [pageState.page, pageState.pageSize]);

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
      >(requestDataCreate);

      if (updatedData.responseCode == API_RESPONSE_CODE.SUCCESS) {
        setPageState((old) => ({
          ...old,
          page: 0,
          pageSize: 2,
        }));
        getDataAll();
      }
    },
    [getDataAll]
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
      >(requestDataCreate);

      if (createdData.responseCode == API_RESPONSE_CODE.SUCCESS) {
        setPageState((old) => ({
          ...old,
          page: 0,
          pageSize: 2,
        }));
        getDataAll();
      }
    },
    [getDataAll]
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

  useEffect(() => {}, [props.filters, props.filters.master]);

  React.useEffect(() => {
    const entityFound: GridValidRowModel | undefined = findById(savedId);

    if (
      entityFound &&
      // props.saveHandler &&
      savedId != -1
    ) {
      createData({
        columnDate: entityFound.columnDate,
        columnSelect: entityFound.columnSelect,
        isDeleted: false,
        url: entityFound.url,
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
        url: entityFound.url,
        columnSelect: entityFound.columnSelect,
        columnDate: entityFound.columnDate,
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
          onUpload={(urlSaved: string | undefined) => {
            if (imgRw) {
              imgRw.url = urlSaved;
            }
          }}
        ></FileUpload>
      )}
      <Box>
        <AppBar>
          <Toolbar>
            <Typography variant="h6" component="div">
              X Grid
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
            columns={columnsDetails}
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
                tableTitle,
                buttonTitle,
              },
            }}
          />
        </Container>
      </Box>
    </>
  );
};

export default Admin;
