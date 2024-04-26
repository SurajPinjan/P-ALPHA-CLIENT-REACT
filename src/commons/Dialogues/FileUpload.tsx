import CloseIcon from "@mui/icons-material/Close";
import { CardContent, CardMedia, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import * as React from "react";
import {
  HttpMultiPartResponseBody,
  HttpRequestData,
} from "../../types/httpTypes";
import { ENTITY_NAME, HTTP_METHOD, OPERATION } from "../../types/enums";
import { makeMultiPartHttpCall } from "../../services/ApiService";
import store from "../../services/GlobalStateService";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function FileUpload(params: {
  urlExisting: string | undefined;
  existingFileType: string | undefined;
  onUpload: (data: {
    url: string;
    filesize: number;
    filetype: string;
    filename: string;
  }) => void;
  onSave: () => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [fullWidth] = React.useState(true);
  const [maxWidth] = React.useState<DialogProps["maxWidth"]>("md");
  const [url, setUrl] = React.useState<string | undefined>(params.urlExisting);
  const [fileType, setFileType] = React.useState<string | undefined>(
    params.existingFileType
  );
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleClose = () => {
    setOpen(false);
    setUrl(undefined);
    setFileType(undefined);
    params.onClose();
  };

  const onSave = () => {
    params.onSave();
  };

  const handleFileInputChange = async (fileList: FileList | null) => {
    if (fileList) setSelectedFile(fileList[0]);
  };

  const uploadFile = async () => {
    if (selectedFile != null) {
      if (
        selectedFile.type === "video/mp4" ||
        selectedFile.type === "video/quicktime"
      ) {
        const requestDataUpdateOne: HttpRequestData<FormData> = {
          entityName: ENTITY_NAME.FILE,
          method: HTTP_METHOD.POST,
          operation: OPERATION.UPLOAD,
          body: new FormData(),
        };

        requestDataUpdateOne.body?.append("file", selectedFile);
        const data: HttpMultiPartResponseBody = await makeMultiPartHttpCall(
          requestDataUpdateOne,
          store
        );
        setUrl(data.url);
        setFileType(selectedFile.type);
        params.onUpload({
          filename: selectedFile.name,
          filesize: selectedFile.size,
          filetype: selectedFile.type,
          url: data.url,
        });
      }
      if (selectedFile.type === "application/pdf") {
        const requestDataUpdateOne: HttpRequestData<FormData> = {
          entityName: ENTITY_NAME.FILE,
          method: HTTP_METHOD.POST,
          operation: OPERATION.UPLOAD,
          body: new FormData(),
        };

        requestDataUpdateOne.body?.append("file", selectedFile);
        const data: HttpMultiPartResponseBody = await makeMultiPartHttpCall(
          requestDataUpdateOne,
          store
        );
        setUrl(data.url);
        setFileType(selectedFile.type);
        params.onUpload({
          filename: selectedFile.name,
          filesize: selectedFile.size,
          filetype: selectedFile.type,
          url: data.url,
        });
      }
      const image: string = URL.createObjectURL(selectedFile);

      const img = new Image();
      img.onload = async () => {
        if (img) {
          const requestDataUpdateOne: HttpRequestData<FormData> = {
            entityName: ENTITY_NAME.FILE,
            method: HTTP_METHOD.POST,
            operation: OPERATION.UPLOAD,
            body: new FormData(),
          };
          requestDataUpdateOne.body?.append("file", selectedFile);
          const data: HttpMultiPartResponseBody = await makeMultiPartHttpCall(
            requestDataUpdateOne,
            store
          );
          setUrl(data.url);
          setFileType(selectedFile.type);
          params.onUpload({
            filename: selectedFile.name,
            filesize: selectedFile.size,
            filetype: selectedFile.type,
            url: data.url,
          });
        } else {
          alert("image width must be exactly twice image height");
        }
      };

      img.src = image;
    }
  };

  React.useEffect(() => {
    if (params.isOpen) setOpen(true);
  }, [params.isOpen]);

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Preview
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          {(typeof fileType === "undefined" || fileType.includes("image")) && (
            <CardMedia component="img" height="140" image={url} />
          )}
          {fileType && !fileType.includes("image") && (
            <iframe
              src={url}
              width={440 * 2}
              height={200 * 2}
              allow="autoplay"
            ></iframe>
          )}

          <CardContent>
            <Typography style={{ textAlign: "right" }}>
              <input
                id="file-input-1"
                type="file"
                accept=".png, .jpg, .jpeg, .pdf, .mp4, .mov"
                onChange={(e) => handleFileInputChange(e.target.files)}
              />
              <button
                style={{
                  textAlign: "right",
                  background: "#0d19a5",
                  color: "white",
                }}
                onClick={uploadFile}
              >
                Upload
              </button>
              <button
                type="button"
                onClick={onSave}
                style={{
                  marginLeft: "10px",
                  textAlign: "right",
                  background: "#b2002d",
                  color: "white",
                }}
              >
                Save
              </button>
            </Typography>
          </CardContent>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
