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
  GridPaginationModel,
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
import useApiQuery from "../../../services/ApiHook";
import { ENTITY_NAME, HTTP_METHOD, OPERATION } from "../../../types/enums";
import {
  HttpGetAllRequestBody,
  HttpResponseBody,
  HttpResponseGetAll,
} from "../../../types/httpTypes";
import { XModel, XView, getViewFromModelX } from "../../../models/X";
import { deepReducerFunction } from "../../../Reducers/deepReducer";

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
  isClicked?: string;
  onSelect?: (subData: GridRowsProp) => void;
}) {
  const [paginationModel, setPaginationModel] = React.useReducer(
    deepReducerFunction<GridPaginationModel>,
    {
      page: 0,
      pageSize: 5,
    }
  );

  const { isLoading, dat, executeQuery } = useApiQuery(paginationModel);

  const [rowCountState, setRowCountState] = React.useState(
    (dat as HttpResponseGetAll<XModel>)?.totalCount || 0
  );
  React.useEffect(() => {
    setRowCountState((prevRowCountState) =>
      (dat as HttpResponseGetAll<XModel>)?.totalCount !== undefined
        ? (dat as HttpResponseGetAll<XModel>)?.totalCount
        : prevRowCountState
    );
  }, [(dat as HttpResponseGetAll<XModel>)?.totalCount, setRowCountState]);

  return (
    <div style={{ height: 400, width: "100%" }}>
      {(dat as HttpResponseGetAll<XModel>) && (
        <DataGrid
          rows={(dat as HttpResponseGetAll<XModel>)?.data.map((row: XModel) => {
            const data: XView = getViewFromModelX(row);
            return data;
          })}
          columns={props.initialColumns}
          rowCount={rowCountState}
          loading={isLoading}
          pageSizeOptions={[5, 10]}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
        />
      )}
    </div>
  );
}
