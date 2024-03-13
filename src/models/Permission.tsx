import { randomCreatedDate, randomId } from "@mui/x-data-grid-generator";
import { Model } from "./Model";
import { View } from "./View";
import { PERMISSION_TYPES } from "../types/enums";

export type PermissionModel = Model & {
  permission: string;
  perm_type: PERMISSION_TYPES;
};

export type PermissionView = View & {
  permission: string;
  perm_type: PERMISSION_TYPES;
};

export function getViewFromModelPermission(a: PermissionModel): PermissionView {
  return {
    id: randomId(),
    uid: a.uid,
    permission: a.permission,
    perm_type: a.perm_type,
    isNew: false,
    isDeleted: a.isDeleted,
  };
}

export function getModelFromViewPermission(a: PermissionView): PermissionModel {
  return {
    uid: a.uid,
    permission: a.permission,
    perm_type: a.perm_type,
    createDate: randomCreatedDate(),
    createBy: "A_User_ID",
    updateDate: randomCreatedDate(),
    updateBy: "B_User_ID",
    isDeleted: a.isDeleted,
  };
}
