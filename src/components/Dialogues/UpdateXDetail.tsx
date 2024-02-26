import CloseIcon from "@mui/icons-material/Close";
import { Card, CardContent, FormControl, Grid, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import { Field, Formik, FormikHelpers } from "formik";
import * as React from "react";
import { Form, useNavigate } from "react-router-dom";
import {
  XDetailModel,
  XDetailView,
  getModelFromViewXDetail,
} from "../../models/XDetail";
import {
  API_RESPONSE_CODE,
  BLANK,
  ENTITY_NAME,
  HTTP_METHOD,
  OPERATION,
} from "../../types/enums";
import { makeHttpCall } from "../../services/ApiService";
import store from "../../services/GlobalStateService";
import {
  HttpRequestData,
  HttpUpdateOneRequestBody,
  HttpResponseUpdateOne,
} from "../../types/httpTypes";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function UpdateXDetailDialogue(params: {
  xDetailOld: XDetailView;
  onUpdate: () => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  // States
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [fullWidth] = React.useState(true);
  const [updateSwitch, setUpdateSwitch] = React.useState<boolean>(true);
  const [maxWidth] = React.useState<DialogProps["maxWidth"]>("md");
  const [xDetailOld, setXDetailOld] = React.useState<XDetailView>({
    columnDetail: BLANK,
    x_id: -1,
    isDeleted: false,
    isNew: false,
  });

  const [xDetail, setXDetail] = React.useState<XDetailView>({
    columnDetail: BLANK,
    x_id: -1,
    isDeleted: false,
    isNew: false,
  });

  // Data Operations

  const updateData = React.useCallback(
    async (viewData: XDetailView) => {
      const requestDataCreate: HttpRequestData<
        HttpUpdateOneRequestBody<XDetailModel>
      > = {
        entityName: ENTITY_NAME.XDETAIL,
        method: HTTP_METHOD.POST,
        operation: OPERATION.UPDATE_ONE,
        body: {
          data: getModelFromViewXDetail(viewData),
        },
      };

      const updatedData: HttpResponseUpdateOne<XDetailModel> =
        await makeHttpCall<
          HttpResponseUpdateOne<XDetailModel>,
          HttpUpdateOneRequestBody<XDetailModel>
        >(requestDataCreate, store, navigate);

      if (updatedData.responseCode == API_RESPONSE_CODE.SUCCESS) {
        params.onUpdate();
        setOpen(false);
      }
    },
    [navigate, params]
  );

  // Event Handlers

  const handleClose = () => {
    setOpen(false);
    params.onClose();
  };

  const formikSubmitHandler = (
    values: {
      columnDetail: string;
      x_id: number;
      isDeleted: boolean;
      isNew: boolean;
    },
    formikHelpers: FormikHelpers<{
      columnDetail: string;
      x_id: number;
      isDeleted: boolean;
      isNew: boolean;
    }>
  ) => {
    console.log(JSON.stringify(formikHelpers));
    setXDetail((old) => ({
      ...old,
      uid: xDetailOld.uid,
      columnDetail: values.columnDetail,
      x_id: values.x_id,
    }));
    setUpdateSwitch(!updateSwitch);
  };

  // Hooks

  React.useEffect(() => {
    if (xDetail.x_id !== -1) updateData(xDetail);
  }, [params, updateData, updateSwitch, xDetail]);

  React.useEffect(() => {
    if (params.isOpen) setOpen(true);
  }, [params.isOpen]);

  React.useEffect(() => {
    setXDetailOld(params.xDetailOld);
  }, [params.xDetailOld, params.xDetailOld.uid]);

  // React.useEffect(() => {
  //   if (xDetail.uid && xDetail.x_id !== -1) updateData(xDetail);
  // }, [xDetail, updateData]);

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
          X Detail
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
          <Card sx={{ width: "100%" }} className="outerContainer">
            <CardContent>
              <Formik
                initialValues={{
                  columnDetail: xDetailOld.columnDetail,
                  x_id: xDetailOld.x_id,
                  isDeleted: xDetailOld.isDeleted,
                  isNew: xDetailOld.isNew,
                }}
                onSubmit={formikSubmitHandler}
                render={({ submitForm }) => {
                  return (
                    <React.Fragment>
                      <Form>
                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <FormControl
                              variant="standard"
                              sx={{ minWidth: "100%" }}
                            >
                              <Field
                                as={TextField}
                                labelId="columnDetail"
                                name="columnDetail"
                                type="text"
                                style={{ width: "100%" }}
                                label="Column Text"
                                variant="standard"
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                        <button type="button" onClick={submitForm}>
                          Save
                        </button>
                      </Form>
                    </React.Fragment>
                  );
                }}
              />
            </CardContent>
          </Card>
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
