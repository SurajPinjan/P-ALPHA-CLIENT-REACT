import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ImageIcon from "@mui/icons-material/Image";
import SaveIcon from "@mui/icons-material/Save";
import {
  AppBar,
  Box,
  Container,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
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
  GridValueFormatterParams,
  useGridApiContext,
} from "@mui/x-data-grid";
import _ from "lodash";
import { DateTime } from "luxon";
import React, { Ref, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "../../commons/Dialogues/FileUpload";
import ImagePreview from "../../commons/Dialogues/ImagePreview";
import { MasterView } from "../../models/Master";
import {
  XModel,
  XView,
  getModelFromViewX,
  getViewFromModelX,
} from "../../models/X";
import { makeHttpCall } from "../../services/ApiService";
import store from "../../services/GlobalStateService";
import { urlEncodeObject } from "../../services/encoderService";
import {
  API_RESPONSE_CODE,
  BLANK,
  ENTITY_NAME,
  HTTP_METHOD,
  OPERATION,
  SELECT_VALUES,
  USER_ROLES,
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
import EditToolbar from "./ProjectStages/EditToolbar";

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
  udpateSwitch?: () => void;
}

const optionsList: string[] = ["A", "B", "C", "AD"];

function CustomEditComponent(props: {
  id: string;
  value: string;
  field: string;
}) {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();

  const handleChange = (event: SelectChangeEvent<string>) => {
    const eventValue = event.target.value;
    const newValue =
      typeof eventValue === "string" ? value.split(",") : eventValue;
    apiRef.current.setEditCellValue({
      id,
      field,
      value: newValue.filter((x: string) => x !== ""),
    });
  };

  return (
    <Select
      labelId="demo-multiple-name-label"
      id="demo-multiple-name"
      multiple
      value={value}
      onChange={handleChange}
      sx={{ width: "100%" }}
    >
      {optionsList.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  );
}

const CustomDiscountEditCell = (params: {
  id: string;
  value: string;
  field: string;
}) => <CustomEditComponent {...params} />;

function CustomFilterInputSingleSelect(props: {
  item: object;
  applyValue: (a: unknown) => void;
  type: string;
  focusElementRef: Ref<unknown> | undefined;
}) {
  const { item, applyValue, type, focusElementRef } = props;

  if ("value" in item && "id" in item) {
    return (
      <TextField
        id={`contains-input-${item.id}`}
        value={item.value}
        onChange={(event) => applyValue({ ...item, value: event.target.value })}
        type={type || "text"}
        variant="standard"
        InputLabelProps={{
          shrink: true,
        }}
        inputRef={focusElementRef}
        select
        SelectProps={{
          native: true,
        }}
      >
        {["", ...optionsList].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </TextField>
    );
  } else {
    return <></>;
  }
}

const Admin: React.FC<AdminProps> = (props) => {
  const role: string | null = localStorage.getItem("userrole");

  const columns = [];

  columns.push({
    field: "columnDate",
    headerName: "Date",
    width: 240,
    type: "date",
    editable: true,
  });

  columns.push({
    field: "columnUText",
    headerName: "Unique Text",
    width: 240,
    editable: true,
  });

  columns.push({
    field: "columnNumber",
    headerName: "Column Number",
    width: 240,
    type: "number",
    editable: true,
    order: 0,
  });

  columns.push({
    field: "columnMultiValue",
    headerName: "Tools Used",
    type: "singleSelect",
    width: 240,
    editable: true,
    valueOptions: optionsList,
    valueFormatter: ({ value }: GridValueFormatterParams) => {
      return value ? value.join("/") : "";
    },
    renderEditCell: CustomDiscountEditCell,
    filterOperators: [
      {
        value: "contains",
        getApplyFilterFn: (filterItem: { value: unknown } | null) => {
          if (
            filterItem instanceof Object &&
            filterItem !== null &&
            "value" in filterItem &&
            (filterItem.value == null || filterItem.value === "")
          ) {
            return null;
          } else {
            return null;
          }
          // return ({ value }: unknown) => {
          //   return value.some(
          //     (cellValue: unknown) => cellValue === filterItem.value
          //   );
          // };
        },
        InputComponent: CustomFilterInputSingleSelect,
      },
    ],
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
  const [filters, setFilters] = React.useState<MasterView>({
    isDeleted: false,
    isNew: false,
    master: undefined,
    uid: undefined,
  });
  const [sorts, setSorts] = React.useState<GridSortModel>([]);
  const [buttonTitle] = React.useState("Add X");
  const [tableTitle] = React.useState("X");

  const columnsDetails: unknown[] = [...columns];

  if (hasAttachment) {
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
  }

  if (isAdmin) {
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
  }

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

  const navigate = useNavigate();

  // Data operations
  const getDataAll = useCallback(async () => {
    setPageState((old) => ({ ...old, isLoading: true }));
    const filterArray: Filter[] = [];

    if (filters && filters.master) {
      filterArray.push({
        column_name: "columnSelect",
        operator: "=",
        value: filters.master.toString(),
      });
    }

    const requestDataAll: HttpRequestData<HttpGetAllRequestBody> = {
      entityName: ENTITY_NAME.X,
      method: HTTP_METHOD.POST,
      operation: OPERATION.GET_ALL,
      body: {
        filters: filterArray,
        sorts: sorts,
        pageSize: pageState.pageSize,
        pageNumber: pageState.page,
      },
    };

    const fetchData: HttpResponseGetAll<XModel> = await makeHttpCall<
      HttpResponseGetAll<XModel>,
      HttpGetAllRequestBody
    >(requestDataAll, store, navigate);

    const dat: XView[] = fetchData.data
      ? fetchData.data.map((row: XModel) => {
          const data: XView = getViewFromModelX(row);
          return data;
        })
      : [];

    setPageState((old) => ({
      ...old,
      isLoading: false,
      data: dat,
      total: fetchData.totalCount,
    }));
  }, [filters, navigate, pageState.page, pageState.pageSize, sorts]);

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
        setPageState((old) => ({
          ...old,
          page: 0,
          pageSize: 2,
        }));
        getDataAll();

        if (props.udpateSwitch) props.udpateSwitch();
      }
    },
    [getDataAll, navigate, props]
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
        setPageState((old) => ({
          ...old,
          page: 0,
          pageSize: 2,
        }));
        getDataAll();
        if (props.udpateSwitch) props.udpateSwitch();
      } else {
        setUpdateId(-1);
        setToUpdated(false);
      }
    },
    [getDataAll, navigate, props]
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

  const onClose = () => {
    setIsOpen(false);
    setIsOpenUpload(false);
  };

  // hooks
  useEffect(() => {
    setFilters((old) => ({ ...old, master: props.filters.master }));
  }, [props.filters]);

  useEffect(() => {
    getDataAll();
  }, [getDataAll, pageState.page, pageState.pageSize, filters]);

  useEffect(() => {}, [props.filters, props.filters.master]);

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

  // event handlers
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
    params: GridRowParams<XView>,
    event
  ) => {
    console.log(event.isTrusted);

    if (params.row) {
      const selectedRowData = params.row;
      const toast = () => ({
        type: "DUMMYTYPE",
        _Code: BLANK,
        _DisplayMsg: BLANK,
        apiTime: DateTime.now().toISO(),
        _ErrMsg: undefined,
        _APIBody: BLANK,
        _APIUrl: BLANK,
        _SelectUId: selectedRowData.uid,
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

  // DOM
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
            columns={columnsDetails as GridColDef[]}
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
                columnMultiField: "columnMultiValue",
                tableTitle,
                buttonTitle,
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

export default Admin;
