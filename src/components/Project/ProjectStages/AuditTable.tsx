import Box from "@mui/material/Box";
import * as React from "react";
// import AddIcon from '@mui/icons-material/Add';
import CancelIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ImageIcon from "@mui/icons-material/Image";
import SaveIcon from "@mui/icons-material/Save";
import { Stack } from "@mui/material";
import {
  DataGrid,
  // GridToolbarContainer,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  GridRowsProp,
} from "@mui/x-data-grid";
import EditToolbar from "./EditToolbar";
import { TabType, TableType } from "./MeasureBak";
import ImagePreview from "../../../commons/Dialogues/ImagePreview";
import FileUpload from "../../../commons/Dialogues/FileUpload";
import { GridValidRowModel } from "@mui/x-data-grid";

export default function FullFeaturedCrudGrid(props: {
  updateHandler?: (editData: GridValidRowModel) => void;
  saveHandler?: (newData: GridValidRowModel) => void;
  isCompare?: boolean;
  hasAttachment: boolean;
  initialColumns: GridColDef[];
  initialRows: GridRowsProp;
  data: TableType;
  tab: TabType;
  tableTitle: string;
  buttonTitle?: string;
  isClicked: string | null;
  onSelect?: (subData: GridRowsProp) => void;
}) {
  const [hasAttachment] = React.useState(props.hasAttachment);
  const [isAudit] = React.useState(props.data === TableType.Audit);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpenUpload, setIsOpenUpload] = React.useState(false);
  const [isCompare] = React.useState(props.isCompare);
  const [buttonTitle] = React.useState(props.buttonTitle);
  const [tableTitle] = React.useState(props.tableTitle);

  const [rows, setRows] = React.useState(props.initialRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const [savedId, setSavedId] = React.useState<GridRowId>(-1);
  const [updateId, setUpdateId] = React.useState<GridRowId>(-1);
  const [toUpdated, setToUpdated] = React.useState<boolean>(false);
  const [toDeleted, setToDeleted] = React.useState<boolean>(false);
  const [imgRw, setImgRw] = React.useState<GridValidRowModel | undefined>();

  const findById = React.useCallback(
    (id: GridRowId): GridValidRowModel | undefined => {
      for (let index = 0; index < rows.length; index++) {
        const element: GridValidRowModel = rows[index];
        if (element.id === id) {
          return element;
        }
      }
      return undefined;
    },
    [rows]
  );

  React.useEffect(() => {
    if (
      props.isClicked &&
      props.isClicked != null &&
      props.isClicked != "null" &&
      !isAudit
    ) {
      setRows(props.initialRows);
    }
  }, [isAudit, props.initialRows, props.isClicked]);

  React.useEffect(() => {
    const entityFound: GridValidRowModel | undefined = findById(savedId);

    if (entityFound && props.saveHandler && savedId != -1) {
      props.saveHandler(entityFound);
    }
  }, [findById, props, savedId]);

  React.useEffect(() => {
    const entityFound: GridValidRowModel | undefined = findById(updateId);
    if (entityFound && props.updateHandler && updateId !== -1 && toUpdated) {
      if (toDeleted) {
        setToDeleted(false);
        entityFound.isDeleted = 1;
      }
      setToUpdated(false);
      props.updateHandler(entityFound);
    }
  }, [findById, props, toDeleted, toUpdated, updateId]);

  const onClose = () => {
    setIsOpen(false);
    setIsOpenUpload(false);
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    setToUpdated(true);
  };

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

  const handleDeleteClick = (id: GridRowId) => () => {
    setToUpdated(true);
    setToDeleted(true);
    setUpdateId(id);
    // setRows(rows.filter((row) => row.id !== id));
  };

  const handleDetailsClick = (subData: GridRowsProp) => {
    if (props.onSelect) {
      props.onSelect(subData);
    }
    //    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setToUpdated(false);
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columnsDetails: GridColDef[] = hasAttachment
    ? [
        ...props.initialColumns,
        {
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
        },
        {
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
        },
      ]
    : [
        ...props.initialColumns,
        {
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
        },
      ];

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
          rows={rows}
          columns={columnsDetails}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
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
          onRowClick={(params: GridRowParams) => {
            handleDetailsClick(params.row.subData);
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel, tableTitle, buttonTitle },
          }}
        />
      </Box>
    </>
  );
}
