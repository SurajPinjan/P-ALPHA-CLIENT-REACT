import CloseIcon from "@mui/icons-material/Close";
import MuiAlert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import * as React from "react";

interface ToastState {
  isOpen: boolean;
}

const FileSizeExcededToast = ({
  isOpen,
  onClose,
}: { isOpen: boolean, onClose: () => void }) => {
  // constants

  const initialState: ToastState = {
    isOpen: false,
  };

  //   states
  const [open, setOpen] = React.useState<boolean>(initialState.isOpen);

  // hooks

  React.useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  // event handlers

  const handleClose = (
    event?: Event | React.SyntheticEvent,
    reason?: SnackbarCloseReason
  ) => {
    console.log(event?.isTrusted);
    if (reason !== "clickaway") {
      setOpen(false);
    }

    onClose();
  };

  //   DOM
  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <MuiAlert
          onClose={handleClose}
          severity="error"
        >
          <div>File above 100 MB</div>
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default FileSizeExcededToast;
