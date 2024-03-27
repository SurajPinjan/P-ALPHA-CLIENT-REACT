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
  GridSortModel,
  GridValidRowModel,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import FileUpload from "../Dialogues/FileUpload";
import ImagePreview from "../Dialogues/ImagePreview";
import EditToolbar from "../../components/Project/ProjectStages/EditToolbarV2";
import { RoleModel, RoleView, getViewFromModelRole } from "../../models/Role";
import {
  User,
  UserView,
  getModelFromViewUser,
  getViewFromModelUser,
} from "../../models/User";
import { makeHttpCall } from "../../services/ApiService";
import store from "../../services/GlobalStateService";
import { camelCaseToPretty } from "../../services/textUtils";
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
import { FileInfo, GlobalState, Page } from "../../types/types";

interface UserProps {
  isCompare?: boolean;
  saveHandler?: (newData: GridValidRowModel) => void;
  updateHandler?: (editData: GridValidRowModel) => void;
}

const UserGrid = (props: UserProps & { sidePannelExpand?: boolean }) => {
  // constants
  const columns = [];

  columns.push({
    field: "username",
    headerName: "User Name",
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
  const [roles, setRoles] = useState<RoleView[]>([]);
  // states
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpenUpload, setIsOpenUpload] = React.useState(false);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const [toDeleted, setToDeleted] = React.useState<boolean>(false);

  const [isCompare] = React.useState(props.isCompare);
  const [imgRw, setImgRw] = React.useState<GridValidRowModel | undefined>();
  const [hasAttachment] = React.useState(false);
  const [toUpdated, setToUpdated] = React.useState<boolean>(false);
  const [savedId, setSavedId] = React.useState<GridRowId>(-1);
  const [updateId, setUpdateId] = React.useState<GridRowId>(-1);
  const [sorts, setSorts] = React.useState<GridSortModel>([]);
  const [buttonTitle] = React.useState("Add User");
  const [tableTitle] = React.useState("Users");

  // param states

  columns.push({
    field: "role_id",
    headerName: "Roles",
    width: 140,
    type: "singleSelect",
    editable: true,
    valueOptions: [
      ...roles.map((x: RoleView) => {
        return { value: x.uid, label: camelCaseToPretty(x.role_name) };
      }),
    ],
    valueFormatter: ({ value }: GridValueFormatterParams<number>) => {
      for (let index = 0; index < roles.length; index++) {
        const option: RoleView = roles[index];
        if (option.uid && option.uid === value) {
          return camelCaseToPretty(option.role_name);
        }
      }

      return value;
    },
  });

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

  // 3rd party hooks

  const navigate = useNavigate();

  //   data operations
  const getDataAll = useCallback(async () => {
    setPageState((old) => ({ ...old, isLoading: true }));
    const filterArray: Filter[] = [];

    const requestDataAll: HttpRequestData<HttpGetAllRequestBody> = {
      entityName: ENTITY_NAME.USER,
      method: HTTP_METHOD.POST,
      operation: OPERATION.GET_ALL,
      body: {
        filters: filterArray,
        sorts: sorts,
        pageSize: pageState.pageSize,
        pageNumber: pageState.page,
      },
    };
    console.log("requestDataAll in user== ", requestDataAll);

    const fetchData: HttpResponseGetAll<User> = await makeHttpCall<
      HttpResponseGetAll<User>,
      HttpGetAllRequestBody
    >(requestDataAll, store, navigate);

    const dat: UserView[] = fetchData.data
      ? fetchData.data.map((row: User) => {
          const data: UserView = getViewFromModelUser(row);
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
    async (viewData: UserView) => {
      const requestDataCreate: HttpRequestData<HttpUpdateOneRequestBody<User>> =
        {
          entityName: ENTITY_NAME.USER,
          method: HTTP_METHOD.POST,
          operation: OPERATION.UPDATE_ONE,
          body: {
            data: getModelFromViewUser(viewData),
          },
        };

      const updatedData: HttpResponseUpdateOne<User> = await makeHttpCall<
        HttpResponseUpdateOne<User>,
        HttpUpdateOneRequestBody<User>
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
    async (viewData: UserView) => {
      const requestDataCreate: HttpRequestData<HttpCreateOneRequestBody<User>> =
        {
          entityName: ENTITY_NAME.USER,
          method: HTTP_METHOD.POST,
          operation: OPERATION.CREATE_ONE,
          body: {
            data: getModelFromViewUser(viewData),
          },
        };

      const createdData: HttpResponseCreateOne<User> = await makeHttpCall<
        HttpResponseCreateOne<User>,
        HttpCreateOneRequestBody<User>
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

  const getDataAllRole = useCallback(async () => {
    setPageState((old) => ({ ...old, isLoading: true }));
    const filterArray: Filter[] = [];

    const requestDataAll: HttpRequestData<HttpGetAllRequestBody> = {
      entityName: ENTITY_NAME.ROLE,
      method: HTTP_METHOD.POST,
      operation: OPERATION.GET_ALL,
      body: {
        filters: filterArray,
        sorts: sorts,
      },
    };

    const fetchData: HttpResponseGetAll<RoleModel> = await makeHttpCall<
      HttpResponseGetAll<RoleModel>,
      HttpGetAllRequestBody
    >(requestDataAll, store, navigate);

    const dat: RoleView[] = fetchData.data
      ? fetchData.data.map((row: RoleModel) => {
          const data: RoleView = getViewFromModelRole(row);
          return data;
        })
      : [];

    setRoles(dat);
  }, [navigate, sorts]);

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

  useEffect(() => {
    getDataAllRole();
  }, [getDataAllRole]);

  React.useEffect(() => {
    const entityFound: GridValidRowModel | undefined = findById(savedId);

    if (
      entityFound &&
      // props.saveHandler &&
      savedId != -1
    ) {
      createData({
        username: entityFound.username,
        password: "Password123",
        role_id: entityFound.role_id,
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
        username: entityFound.username,
        password: entityFound.password,
        role_id: entityFound.role_id,
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
    params: GridRowParams<UserView>,
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
          onSave={() => {}}
        ></FileUpload>
      )}
      <Box
        sx={{
          height: "auto",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          "& .actions": {
            color: "text.secondary",
          },
          "& .textPrimary": {
            color: "text.primary",
          },
        }}
      >
        <div
          style={{
            width: props.sidePannelExpand
              ? `calc(100vw - 37rem)`
              : `calc(-26.6rem + 100vw)`,
            overflow: "auto",
          }}
        >
          <DataGrid
            sx={{ border: "none", padding: "5px", overflow: "auto" }}
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
            sortingMode="server"
            onSortModelChange={handleSortModelChange}
          />
        </div>
      </Box>
    </>
  );
};

const mapStateToProps = (state: GlobalState) => ({
  selectUId: state.selectUId,
});

const UserGridWithState = connect(mapStateToProps)(UserGrid);
export default UserGridWithState;
