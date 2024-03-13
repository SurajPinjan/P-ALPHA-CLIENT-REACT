import CloseIcon from "@mui/icons-material/Close";
import { Checkbox, Grid } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { useNavigate } from "react-router-dom";

import {
  DefaultPermsModel,
  getModelFromViewDefaultPerms,
} from "../../models/DefaultPerms";
import {
  RoleDefaultPermsModel,
  RoleDefaultPermsView,
  getViewFromModelRoleDefaultPerms,
} from "../../models/RoleDefaultPerms";
import { makeHttpCall } from "../../services/ApiService";
import store from "../../services/GlobalStateService";
import { camelCaseToPretty } from "../../services/textUtils";
import {
  API_RESPONSE_CODE,
  ENTITY_NAME,
  HTTP_METHOD,
  OPERATION,
} from "../../types/enums";
import {
  HttpCreateOneRequestBody,
  HttpRequestData,
  HttpResponseCreateOne,
  HttpResponseGetAll,
  HttpResponseUpdateOne,
  HttpUpdateOneRequestBody,
} from "../../types/httpTypes";
import _ from "lodash";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function RolePermissionDialogue(params: {
  role_id: number | undefined;
  isOpen: boolean;
  compare?: boolean;
  onClose: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [compare] = React.useState(params.compare);
  const [fullWidth] = React.useState(true);
  const [role_id] = React.useState<number | undefined>(params.role_id);
  const [allPermissions, setAllPermissions] = React.useState<
    RoleDefaultPermsView[]
  >([]);
  const [allPermissionsNew, setAllPermissionsNew] = React.useState<
    RoleDefaultPermsView[]
  >([]);
  const navigate = useNavigate();

  const [maxWidth] = React.useState<DialogProps["maxWidth"]>("md");
  const handleClose = () => {
    setOpen(false);
    params.onClose();
  };

  //   data operations

  const getDataAll = React.useCallback(async () => {
    if (role_id) {
      const requestDataAll: HttpRequestData<{ role_id: number }> = {
        entityName: ENTITY_NAME.ROLEDEFAULTPERMS,
        method: HTTP_METHOD.POST,
        operation: OPERATION.GET_ALL,
        body: {
          role_id: role_id,
        },
      };

      const fetchData: HttpResponseGetAll<RoleDefaultPermsModel> =
        await makeHttpCall<
          HttpResponseGetAll<RoleDefaultPermsModel>,
          { role_id: number }
        >(requestDataAll, store, navigate);

      const dat: RoleDefaultPermsView[] = fetchData.data
        ? fetchData.data.map((row: RoleDefaultPermsModel) => {
            const data: RoleDefaultPermsView =
              getViewFromModelRoleDefaultPerms(row);
            return data;
          })
        : [];

      setAllPermissions(dat);
      setAllPermissionsNew(_.cloneDeep(dat));
    }
  }, [navigate, role_id]);

  const deleteData = React.useCallback(
    async (viewData: RoleDefaultPermsView) => {
      if (
        typeof viewData.uid === "number" &&
        viewData.dp_uid !== null &&
        typeof role_id === "number"
      ) {
        const requestDataCreate: HttpRequestData<
          HttpUpdateOneRequestBody<DefaultPermsModel>
        > = {
          entityName: ENTITY_NAME.DEFAULTPERMS,
          method: HTTP_METHOD.POST,
          operation: OPERATION.UPDATE_ONE,
          body: {
            data: getModelFromViewDefaultPerms({
              perm_id: viewData.uid,
              role_id: role_id,
              uid: viewData.dp_uid,
              isNew: viewData.isNew,
              isDeleted: true,
            }),
          },
        };

        const updatedData: HttpResponseUpdateOne<DefaultPermsModel> =
          await makeHttpCall<
            HttpResponseUpdateOne<DefaultPermsModel>,
            HttpUpdateOneRequestBody<DefaultPermsModel>
          >(requestDataCreate, store, navigate);

        if (updatedData.responseCode == API_RESPONSE_CODE.SUCCESS_UPDATE) {
          getDataAll();
        }
      }
    },
    [getDataAll, navigate, role_id]
  );

  const createData = React.useCallback(
    async (viewData: RoleDefaultPermsView) => {
      if (
        typeof viewData.uid === "number" &&
        viewData.dp_uid === null &&
        typeof role_id === "number"
      ) {
        const requestDataCreate: HttpRequestData<
          HttpCreateOneRequestBody<DefaultPermsModel>
        > = {
          entityName: ENTITY_NAME.DEFAULTPERMS,
          method: HTTP_METHOD.POST,
          operation: OPERATION.CREATE_ONE,
          body: {
            data: getModelFromViewDefaultPerms({
              perm_id: viewData.uid,
              role_id: role_id,
              isNew: viewData.isNew,
              isDeleted: viewData.isDeleted,
            }),
          },
        };

        const updatedData: HttpResponseCreateOne<DefaultPermsModel> =
          await makeHttpCall<
            HttpResponseCreateOne<DefaultPermsModel>,
            HttpCreateOneRequestBody<DefaultPermsModel>
          >(requestDataCreate, store, navigate);

        if (updatedData.responseCode == API_RESPONSE_CODE.SUCCESS_CREATE) {
          getDataAll();
        }
      }
    },
    [getDataAll, navigate, role_id]
  );

  React.useEffect(() => {
    if (params.isOpen) setOpen(true);
  }, [params.isOpen]);

  React.useEffect(() => {
    if (role_id && role_id > 0) {
      console.log(role_id);
      getDataAll();
    }
  }, [getDataAll, role_id]);

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
          Default Permissions
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
          <Grid container spacing={2}>
            <Grid item xs={compare ? 6 : 12}>
              <Typography gutterBottom>
                <Grid container spacing={2}>
                  {allPermissionsNew.map((permission, index) => {
                    return (
                      <Grid item xs={3}>
                        <Checkbox
                          checked={permission.dp_uid !== null}
                          onChange={() => {
                            checkboxClickHandler(index, permission);
                          }}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                        {camelCaseToPretty(permission.permission)}{" "}
                        {permission.perm_type}
                      </Grid>
                    );
                  })}
                </Grid>
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );

  // event handlers
  function checkboxClickHandler(
    index: number,
    permission: RoleDefaultPermsView
  ) {
    if (allPermissions[index].dp_uid === null) {
      createData(permission);
    } else {
      deleteData(permission);
    }
  }
}
