import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import { Box, Container } from "@mui/material";
import {
  GridActionsCellItem,
  GridRowId,
  GridSortModel,
  GridValidRowModel,
} from "@mui/x-data-grid";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FixMediaGrid from "../../../components/Project/ProjectStages/FixMediaGrid";
import {
  MediaModel,
  MediaView,
  getModelFromViewMedia,
  getViewFromModelMedia,
} from "../../../models/Media";
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
import { Page, SortableGridColDef } from "../../../types/types";
import FileUpload from "../../Dialogues/FileUpload";
import ImagePreview from "../../Dialogues/ImagePreview";

interface MediaProps {
  isCompare?: boolean;
  saveHandler?: (newData: GridValidRowModel) => void;
  updateHandler?: (editData: GridValidRowModel) => void;
}

const MediaGridFix: React.FC<MediaProps> = (props) => {
  // constants
  const navigate = useNavigate();
  const columns: SortableGridColDef[] = [];

  columns.push({
    field: "filename",
    headerName: "File Name",
    width: 240,
    editable: false,
    order: 0,
  });

  columns.push({
    field: "filesize",
    headerName: "File Size",
    type: "number",
    width: 140,
    editable: false,
    order: 1,
  });

  columns.push({
    field: "filetype",
    headerName: "File Type",
    width: 140,
    editable: false,
    order: 2,
  });

  // states
  const [sorts] = React.useState<GridSortModel>([]);
  const [pageState, setPageState] = useState<Page>({
    isLoading: false,
    data: [],
    total: 0,
    page: 0,
    pageSize: 3,
  });
  // states
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpenUpload, setIsOpenUpload] = React.useState(false);
  const [toDeleted, setToDeleted] = React.useState<boolean>(false);

  const [isCompare] = React.useState(props.isCompare);
  const [imgRw, setImgRw] = React.useState<GridValidRowModel | undefined>();
  const [toUpdated, setToUpdated] = React.useState<boolean>(false);
  const [updateId, setUpdateId] = React.useState<GridRowId>(-1);
  // constants
  const columnsDetails: SortableGridColDef[] = [...columns];

  columnsDetails.push({
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
    order: 4,
  });

  columnsDetails.push({
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
    order: 5,
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

      if (createdData.responseCode == API_RESPONSE_CODE.SUCCESS_CREATE) {
        setImgRw(undefined);
        setIsOpenUpload(false);
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
          type={imgRw.filetype}
          url={imgRw.fileurl}
          isOpen={isOpen}
          compare={isCompare}
          onClose={onClose}
        ></ImagePreview>
      )}
      {imgRw && (
        <FileUpload
          urlExisting={imgRw.fileurl}
          existingFileType={imgRw.filetype}
          isOpen={isOpenUpload}
          onClose={onClose}
          onUpload={handleSave}
          onSave={handleCreate}
        ></FileUpload>
      )}
      <Box>
        <Container>
          <FixMediaGrid></FixMediaGrid>
        </Container>
      </Box>
    </>
  );
};

export default MediaGridFix;
