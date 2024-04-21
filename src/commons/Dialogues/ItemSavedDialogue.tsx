import CloseIcon from "@mui/icons-material/Close";
import { DialogTitle, Grid } from "@mui/material";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import * as React from "react";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function ItemSavedPopup(params: {
  itemName: string | undefined;
  itemId: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [itemID, setItemID] = React.useState(``);
  const [itemName, setItemName] = React.useState(``);
  const [fullWidth] = React.useState(true);
  const [maxWidth] = React.useState<DialogProps["maxWidth"]>("md");
  const handleClose = () => {
    setOpen(false);
    params.onClose();
  };

  React.useEffect(() => {
    if (params.isOpen) setOpen(true);
  }, [params.isOpen]);

  React.useEffect(() => {
    if (params.itemId) setItemID(params.itemId);
  }, [params.itemId]);

  React.useEffect(() => {
    if (params.itemName) setItemName(params.itemName);
  }, [params.itemName]);

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
      >
        <DialogTitle
          sx={{ m: 0, p: 2 }}
          id="customized-dialog-title"
        ></DialogTitle>
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
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <div
                style={{
                  textAlign: "center",
                }}
              >
                {itemName} HAS BEEN SAVED WITH ID <span>{itemID}</span>
              </div>
            </Grid>
          </Grid>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}
