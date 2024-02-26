import CloseIcon from "@mui/icons-material/Close";
import MuiAlert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import * as React from "react";
import { GlobalState } from "../../types/types";
import { DateTime } from "luxon";
import JsonView from "react18-json-view";
import { BLANK } from "../../types/enums";

interface ToastState {
  isOpen: boolean;
}

const HttpToast = ({
  code,
  displayMsg,
  errMsg,
  apiTime,
  APIBody,
  APIUrl,
}: GlobalState) => {
  // constants
  const initialState: ToastState = {
    isOpen: false,
  };

  //   states
  const [open, setOpen] = React.useState<boolean>(initialState.isOpen);
  const [codeP, setCodeP] = React.useState<string>(BLANK);
  const [displayMsgP, setDisplayMsgP] = React.useState<string>(BLANK);
  const [errMsgP, setErrMsgP] = React.useState<string | undefined>();
  const [APIUrlP, setAPIUrlP] = React.useState<string | undefined>();
  const [APIBodyP, setAPIBodyP] = React.useState<string | undefined>(`{}`);
  const [apiTimeP, setApiTimeP] = React.useState<string>(
    DateTime.now().toISO()
  );
  // hooks

  React.useEffect(() => {
    setCodeP(code);
    setDisplayMsgP(displayMsg);
    setErrMsgP(errMsg);
    setApiTimeP(apiTime);
    setAPIUrlP(APIUrl);
    setAPIBodyP(APIBody);
  }, [code, displayMsg, errMsg, apiTime, APIUrl, APIBody]);

  React.useEffect(() => {
    if (codeP !== BLANK) setOpen(true);
  }, [codeP, displayMsgP, errMsgP, apiTimeP, APIUrlP, APIBodyP]);

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
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
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
          <div>{APIUrlP}</div>
          {APIBodyP && (
            <JsonView
              style={{ width: "20%", height: "5%" }}
              displaySize={"collapsed"}
              theme="github"
              enableClipboard={false}
              collapsed={true}
              collapseStringMode={"word"}
              editable={false}
              src={JSON.parse(APIBodyP)}
            />
          )}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default HttpToast;
