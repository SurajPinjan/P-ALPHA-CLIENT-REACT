import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import { Box, Container, Stack } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridPaginationModel,
  GridRowId,
  GridSortModel,
  GridValidRowModel,
} from "@mui/x-data-grid";
import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "../../commons/Dialogues/FileUpload";
import ImagePreview from "../../commons/Dialogues/ImagePreview";
import {
  MediaModel,
  MediaView,
  getModelFromViewMedia,
  getViewFromModelMedia,
} from "../../models/Media";
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
import { Page, SortableGridColDef, sortGridColDef } from "../../types/types";
import MediaToolbar from "./MediaToolbar";

interface MediaProps {
  isCompare?: boolean;
  saveHandler?: (newData: GridValidRowModel) => void;
  updateHandler?: (editData: GridValidRowModel) => void;
}

const MediaGrid: React.FC<MediaProps> = (props) => {
  // constants
  const navigate = useNavigate();
  const columns: SortableGridColDef[] = [];

  columns.push({
    order: 0,
    field: "filename",
    headerName: "File Name",
    width: 240,
    editable: false,
  });

  columns.push({
    order: 1,
    field: "filesize",
    headerName: "File Size",
    type: "number",
    width: 140,
    editable: false,
  });

  columns.push({
    order: 2,
    field: "filetype",
    headerName: "File Type",
    width: 140,
    editable: false,
  });

  // states
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
  const [toDeleted, setToDeleted] = React.useState<boolean>(false);

  const [isCompare] = React.useState(props.isCompare);
  const [imgRw, setImgRw] = React.useState<GridValidRowModel | undefined>();
  const [toUpdated, setToUpdated] = React.useState<boolean>(false);
  const [updateId, setUpdateId] = React.useState<GridRowId>(-1);
  const [tableTitle] = React.useState("Media Gallary");
  const [buttonTitle] = React.useState("Add File");
  // constants
  const columnsDetails: SortableGridColDef[] = [...columns];

  columnsDetails.push({
    order: 3,
    field: "fileurl",
    headerName: "File URL",
    type: "actions",
    width: 100,
    editable: false,
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

  columnsDetails.push({
    order: 4,
    field: "actions",
    type: "actions",
    headerName: "Actions",
    editable: false,
    width: 100,
    cellClassName: "actions",
    getActions: ({ id }) => {
      return [
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

    const requestDataAll: HttpRequestData<HttpGetAllRequestBody> = {
      entityName: ENTITY_NAME.MEDIA,
      method: HTTP_METHOD.POST,
      operation: OPERATION.GET_ALL,
      body: {
        filters: filterArray,
        sorts: sorts,
        pageSize: pageState.pageSize,
        pageNumber: pageState.page,
      },
    };

    const fetchData: HttpResponseGetAll<MediaModel> = await makeHttpCall<
      HttpResponseGetAll<MediaModel>,
      HttpGetAllRequestBody
    >(requestDataAll, store, navigate);

    const dat: MediaView[] = fetchData.data
      ? fetchData.data.map((row: MediaModel) => {
          const data: MediaView = getViewFromModelMedia(row);
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
    async (viewData: MediaView) => {
      const requestDataCreate: HttpRequestData<
        HttpUpdateOneRequestBody<MediaModel>
      > = {
        entityName: ENTITY_NAME.MEDIA,
        method: HTTP_METHOD.POST,
        operation: OPERATION.UPDATE_ONE,
        body: {
          data: getModelFromViewMedia(viewData),
        },
      };

      const updatedData: HttpResponseUpdateOne<MediaModel> = await makeHttpCall<
        HttpResponseUpdateOne<MediaModel>,
        HttpUpdateOneRequestBody<MediaModel>
      >(requestDataCreate, store, navigate);

      if (updatedData.responseCode == API_RESPONSE_CODE.SUCCESS) {
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
    async (viewData: MediaView) => {
      const requestDataCreate: HttpRequestData<
        HttpCreateOneRequestBody<MediaModel>
      > = {
        entityName: ENTITY_NAME.MEDIA,
        method: HTTP_METHOD.POST,
        operation: OPERATION.CREATE_ONE,
        body: {
          data: getModelFromViewMedia(viewData),
        },
      };

      const createdData: HttpResponseCreateOne<MediaModel> = await makeHttpCall<
        HttpResponseCreateOne<MediaModel>,
        HttpCreateOneRequestBody<MediaModel>
      >(requestDataCreate, store, navigate);

      if (createdData.responseCode == API_RESPONSE_CODE.SUCCESS) {
        setImgRw(undefined);
        setIsOpenUpload(false);
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

  const onClose = () => {
    setIsOpen(false);
    setIsOpenUpload(false);
  };

  const handleSortModelChange = (newSortModel: GridSortModel) => {
    setSorts(_.cloneDeep(newSortModel));
  };

  //   hooks

  useEffect(() => {
    if (isOpenUpload) setImgRw({});
  }, [isOpenUpload]);

  useEffect(() => {
    getDataAll();
  }, [getDataAll, pageState.page, pageState.pageSize]);

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
        filename: entityFound.filename,
        filesize: entityFound.filesize,
        fileurl: entityFound.fileurl,
        filetype: entityFound.filetype,
        entityId: -1,
        entityType: ENTITY_NAME.X,
        isDeleted: entityFound.isDeleted == 0 ? false : true,
        isNew: entityFound.isNew,
      });
      // props.updateHandler(entityFound);
    }
  }, [findById, props, toDeleted, toUpdated, updateData, updateId]);

  const handleDeleteClick = (id: GridRowId) => () => {
    setToUpdated(true);
    setToDeleted(true);
    setUpdateId(id);
  };

  const handleSave = (
    data:
      | {
          url: string;
          filesize: number;
          filetype: string;
          filename: string;
        }
      | undefined
  ): void => {
    if (data) {
      setImgRw({
        filesize: data.filesize,
        filetype: data.filetype,
        filename: data.filename,
        entityId: -1,
        entityType: ENTITY_NAME.X,
        isDeleted: false,
        isNew: true,
        fileurl: data.url,
      });
    }
  };

  const handleCreate = (): void => {
    if (imgRw && imgRw.filetype) {
      createData({
        filename: imgRw.filename,
        filesize: imgRw.filesize,
        fileurl: imgRw.fileurl,
        filetype: imgRw.filetype,
        entityId: -1,
        entityType: ENTITY_NAME.X,
        isDeleted: false,
        isNew: imgRw.isNew,
      });
    }
  };

  //   dom

  return (
    <>
      {imgRw && (
        <ImagePreview
          url={imgRw.fileurl}
          isOpen={isOpen}
          compare={isCompare}
          onClose={onClose}
        ></ImagePreview>
      )}
      {imgRw && (
        <FileUpload
          urlExisting={imgRw.fileurl}
          isOpen={isOpenUpload}
          onClose={onClose}
          onUpload={handleSave}
          onSave={handleCreate}
        ></FileUpload>
      )}
      <Box>
        <Container>
          <DataGrid
            sx={{ border: "none", padding: "15px" }}
            autoHeight
            editMode="row"
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
              toolbar: MediaToolbar,
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
                setIsOpenUpload,
                tableTitle,
                buttonTitle,
                handleCreate,
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

export default MediaGrid;
