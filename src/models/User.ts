import { randomCreatedDate, randomId } from "@mui/x-data-grid-generator";
import { Model } from "./Model";
import { View } from "./View";

export type User = Model & {
  username: string;
  password?: string; //transient
  role_id: number;
};

export type UserView = View & {
  username: string;
  password?: string; //transient
};

export function getViewFromModelUser(a: User): UserView {
  return {
    id: randomId(),
    uid: a.uid,
    username: a.username,
    password: a.password,
    role_id: a.role_id,
    isNew: false,
    isDeleted: a.isDeleted,
  };
}

export function getModelFromViewUser(a: UserView): User {
  return {
    uid: a.uid,
    username: a.username,
    role_id: a.role_id,
    password: a.password,
    createDate: randomCreatedDate(),
    createBy: "A_User_ID",
    updateDate: randomCreatedDate(),
    updateBy: "B_User_ID",
    isDeleted: a.isDeleted,
  };
}
