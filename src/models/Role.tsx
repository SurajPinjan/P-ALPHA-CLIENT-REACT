import { randomCreatedDate, randomId } from "@mui/x-data-grid-generator";
import { Model } from "./Model";
import { View } from "./View";

export type RoleModel = Model & {
  role_name: string;
};

export type RoleView = View & {
  role_name: string;
};

export function getViewFromModelRole(a: RoleModel): RoleView {
  return {
    id: randomId(),
    uid: a.uid,
    role_name: a.role_name,
    isNew: false,
    isDeleted: a.isDeleted,
  };
}

export function getModelFromViewRole(a: RoleView): RoleModel {
  return {
    uid: a.uid,
    role_name: a.role_name,
    createDate: randomCreatedDate(),
    createBy: "A_User_ID",
    updateDate: randomCreatedDate(),
    updateBy: "B_User_ID",
    isDeleted: a.isDeleted,
  };
}
