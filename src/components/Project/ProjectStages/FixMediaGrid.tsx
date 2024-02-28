import ImageIcon from "@mui/icons-material/Image";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  styled,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FileUpload from "../../../commons/Dialogues/FileUpload";
import ImagePreview from "../../../commons/Dialogues/ImagePreview";
import {
  MediaModel,
  MediaView,
  getModelFromViewMedia,
  getViewFromModelMedia,
} from "../../../models/Media";
import { makeHttpCall } from "../../../services/ApiService";
import store from "../../../services/GlobalStateService";
import { urlDecodeString } from "../../../services/encoderService";
import {
  API_RESPONSE_CODE,
  BLANK,
  ENTITY_NAME,
  HTTP_METHOD,
  OPERATION,
} from "../../../types/enums";
import { Filter } from "../../../types/filterTypes";
import {
  HttpGetAllRequestBody,
  HttpRequestData,
  HttpResponseGetAll,
  HttpResponseUpdateOne,
  HttpUpdateOneRequestBody,
} from "../../../types/httpTypes";
import { DataList } from "../../../types/types";

interface Column {
  id: "tag" | "name" | "url" | "type" | "size" | "action";
  label: string;
  minWidth?: number;
  align?: "center";
  format?: (value: number) => string;
}

const TableHeadStyled = styled("thead")({
  background: "#00B0AB",
  borderBottom: "none",
  color: "#ffffff",
});

const TableCellStyled = styled(TableCell)({
  padding: "5px",
  borderRight: "1px solid #ddd",
});
const SubTableCellStyled = styled(TableCell)({
  padding: "5px",
  borderRight: "1px solid #ddd",
  lineHeight: "0.5",
});

function FixMediaGrid() {
  // constants
  const columns: Column[] = [
    { id: "tag", label: BLANK, minWidth: 80 },
    { id: "name", label: "Name", minWidth: 90 },
    { id: "type", label: "Type", minWidth: 90 },
    { id: "size", label: "Size", minWidth: 90 },
    { id: "url", label: "URl", minWidth: 80 },
    { id: "action", label: BLANK, minWidth: 90 },
  ];
  // states
  const navigate = useNavigate();
  const { data } = useParams();
  const [urlData, setUrlData] = React.useState<MediaModel | undefined>();
  const [pageState, setPageState] = useState<DataList<MediaView>>({
    isLoading: false,
    data: [],
  });

  const [isCompare] = React.useState(false);
  const [isOpenUpload, setIsOpenUpload] = React.useState(false);

  const [imgRw, setImgRw] = React.useState<MediaView | undefined>();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  //   event handlers
  const handleClick = (value: MediaView) => {
    setImgRw(undefined);
    setTimeout(() => {
      if (value) {
        setImgRw({ ...value });
      }
      setIsOpenUpload(true);
    }, 200);
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
    if (data && imgRw) {
      setImgRw({
        uid: imgRw.uid,
        tag: imgRw.tag,
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

  const onClose = () => {
    setIsOpen(false);
    setIsOpenUpload(false);
  };

  const handleUpdate = (): void => {
    if (imgRw && imgRw.filetype) {
      updateData({
        uid: imgRw.uid,
        tag: imgRw.tag,
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

  //   Data operations

  const getDataAll = useCallback(async () => {
    setPageState((old) => ({ ...old, isLoading: true }));
    const filterArray: Filter[] = [];
    if (urlData && urlData.uid) {
      filterArray.push({
        column_name: "x_id",
        operator: "=",
        value: urlData.uid.toString(),
      });
    }
    const requestDataAll: HttpRequestData<HttpGetAllRequestBody> = {
      entityName: ENTITY_NAME.MEDIA,
      method: HTTP_METHOD.POST,
      operation: OPERATION.GET_ALL,
      body: {
        filters: filterArray,
        sorts: [],
        pageSize: 100,
        pageNumber: 0,
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

    setIsOpen(false);
    setIsOpenUpload(false);
    setImgRw(undefined);
  }, [navigate, urlData]);

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

  React.useEffect(() => {
    if (data) {
      setUrlData(urlDecodeString<MediaModel>(data));
    }
  }, [data]);

  React.useEffect(() => {
    if (isOpen) setIsOpen(true);
  }, [isOpen]);

  React.useEffect(() => {
    getDataAll();
  }, [getDataAll]);

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
          onSave={handleUpdate}
        ></FileUpload>
      )}
      <TableContainer style={{ overflow: "hidden" }}>
        <Table aria-label="sticky table">
          <TableHeadStyled>
            <TableRow>
              {columns.map((column) => (
                <TableCellStyled
                  key={column.id}
                  align={column.align}
                  style={{
                    top: 57,
                    minWidth: column.minWidth,
                    fontWeight: "bold",
                  }}
                >
                  {column.label}
                </TableCellStyled>
              ))}
            </TableRow>
          </TableHeadStyled>
          <TableBody>
            {pageState.data.map((value: MediaView) => (
              <TableRow>
                <SubTableCellStyled> {value.tag}</SubTableCellStyled>
                <SubTableCellStyled> {value.filename}</SubTableCellStyled>
                <SubTableCellStyled> {value.filetype}</SubTableCellStyled>
                <SubTableCellStyled> {value.filesize}</SubTableCellStyled>
                <SubTableCellStyled>
                  <Button
                    onClick={() => {
                      setImgRw(undefined);
                      setTimeout(() => {
                        setImgRw(value);
                        setIsOpen(true);
                      }, 200);
                    }}
                  >
                    <ImageIcon />
                  </Button>
                </SubTableCellStyled>
                <SubTableCellStyled>
                  <Button
                    autoFocus
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                      console.log(event.isTrusted);
                      handleClick(value);
                    }}
                  >
                    Update
                  </Button>
                </SubTableCellStyled>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default FixMediaGrid;
