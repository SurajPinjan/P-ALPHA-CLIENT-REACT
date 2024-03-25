import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import * as React from "react";
import MediaGrid from "../Grids/MediaGrid";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function MediaGallary(params: {
  url: string | undefined;
  isOpen: boolean;
  addTag?: boolean;
  compare?: boolean;
  onClose: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [fullWidth] = React.useState(true);
  const [addTag, setAddTag] = React.useState(false);
  const [maxWidth] = React.useState<DialogProps["maxWidth"]>("md");
  const handleClose = () => {
    setOpen(false);
    params.onClose();
  };

  React.useEffect(() => {
    if (params.isOpen) setOpen(true);
  }, [params.isOpen]);

  React.useEffect(() => {
    if (params.addTag) setAddTag(params.addTag);
  }, [params.addTag]);

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
          Media Gallary
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
          <MediaGrid addTag={addTag}></MediaGrid>
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
