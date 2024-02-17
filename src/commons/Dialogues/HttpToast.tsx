import CloseIcon from "@mui/icons-material/Close";
import MuiAlert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import * as React from "react";
import { GlobalState } from "../../types/types";
import { DateTime } from "luxon";

interface ToastState {
  isOpen: boolean;
}

const HttpToast = ({ code, displayMsg, errMsg, apiTime }: GlobalState) => {
  // constants
  const initialState: ToastState = {
    isOpen: false,
  };

  //   states
  const [open, setOpen] = React.useState<boolean>(initialState.isOpen);
  const [codeP, setCodeP] = React.useState<string>("");
  const [displayMsgP, setDisplayMsgP] = React.useState<string>("");
  const [errMsgP, setErrMsgP] = React.useState<string | undefined>();
  const [apiTimeP, setApiTimeP] = React.useState<string>(
    DateTime.now().toISO()
  );
  // hooks

  React.useEffect(() => {
    setCodeP(code);
    setDisplayMsgP(displayMsg);
    setErrMsgP(errMsg);
    setApiTimeP(apiTime);
  }, [code, displayMsg, errMsg, apiTime]);

  React.useEffect(() => {
    setOpen(true);
  }, [codeP, displayMsgP, errMsgP, apiTimeP]);

  // event handlers

  const handleClose = (
    event?: Event | React.SyntheticEvent,
    reason?: SnackbarCloseReason
  ) => {
    console.log(event?.isTrusted);
    if (reason !== "clickaway") {
      setOpen(false);
    }
  };

  //   DOM
  return (
    <div>
      <Snackbar
        open={open}
        // autoHideDuration={6000}
        autoHideDuration={null}
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
          severity={errMsgP ? "error" : "success"}
        >
          <div>{codeP}</div>
          <div>{displayMsgP}</div>
          <div>{errMsgP}</div>
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default HttpToast;
