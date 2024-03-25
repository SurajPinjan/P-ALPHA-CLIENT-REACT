import { randomCreatedDate, randomId } from "@mui/x-data-grid-generator";
import { Model } from "./Model";
import { View } from "./View";
import { USER_ROLES } from "../types/enums";
import {
  PermissionView,
  PermissionModel,
  getViewFromModelPermission,
  getModelFromViewPermission,
} from "./Permission";

export type UModel = Model & {
  username: string;
  password?: string; //transient
  role_name: USER_ROLES;
  permissions?: PermissionModel[]; //transient
};

export type UView = View & {
  username: string;
  password?: string; //transient
  role_name: USER_ROLES;
  permissions?: PermissionView[]; //transient
};

export function getViewFromModelU(a: UModel): UView {
  return {
    id: randomId(),
    uid: a.uid,
    username: a.username,
    role_name: a.role_name,
    isNew: false,
    isDeleted: a.isDeleted,
    permissions: a.permissions?.map((p) => getViewFromModelPermission(p)),
  };
}

export function getModelFromViewU(a: UView): UModel {
  return {
    uid: a.uid,
    username: a.username,
    role_name: a.role_name,
    password: a.password,
    createDate: randomCreatedDate(),
    createBy: "A_User_ID",
    updateDate: randomCreatedDate(),
    updateBy: "B_User_ID",
    permissions: a.permissions?.map((p) => getModelFromViewPermission(p)),
    isDeleted: a.isDeleted,
  };
}
