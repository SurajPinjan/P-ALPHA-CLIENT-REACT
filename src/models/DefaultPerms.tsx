import { randomCreatedDate, randomId } from "@mui/x-data-grid-generator";
import { Model } from "./Model";
import { View } from "./View";

export type DefaultPermsModel = Model & {
  role_id: number;
  perm_id: number;
};

export type DefaultPermsView = View & {
  role_id: number;
  perm_id: number;
};

export function getViewFromModelDefaultPerms(
  a: DefaultPermsModel
): DefaultPermsView {
  return {
    id: randomId(),
    uid: a.uid,
    role_id: a.role_id,
    perm_id: a.perm_id,
    isNew: false,
    isDeleted: a.isDeleted,
  };
}

export function getModelFromViewDefaultPerms(
  a: DefaultPermsView
): DefaultPermsModel {
  return {
    uid: a.uid,
    role_id: a.role_id,
    perm_id: a.perm_id,
    createDate: randomCreatedDate(),
    createBy: "A_User_ID",
    updateDate: randomCreatedDate(),
    updateBy: "B_User_ID",
    isDeleted: a.isDeleted,
  };
}
