import { randomCreatedDate, randomId } from "@mui/x-data-grid-generator";
import { Model } from "./Model";
import { View } from "./View";
import { USER_ROLES } from "../types/enums";

export type UModel = Model & {
  username: string;
  password?: string; //transient
  urole: USER_ROLES;
};

export type UView = View & {
  username: string;
  password?: string; //transient
  urole: USER_ROLES;
};

export function getViewFromModelU(a: UModel): UView {
  return {
    id: randomId(),
    uid: a.uid,
    username: a.username,
    urole: a.urole,
    isNew: false,
    isDeleted: a.isDeleted,
  };
}

export function getModelFromViewU(a: UView): UModel {
  return {
    uid: a.uid,
    username: a.username,
    urole: a.urole,
    password: a.password,
    createDate: randomCreatedDate(),
    createBy: "A_User_ID",
    updateDate: randomCreatedDate(),
    updateBy: "B_User_ID",
    isDeleted: a.isDeleted,
  };
}
