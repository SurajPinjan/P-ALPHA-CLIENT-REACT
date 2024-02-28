import { randomCreatedDate, randomId } from "@mui/x-data-grid-generator";
import { Model } from "./Model";
import { View } from "./View";

export type ZModel = Model & {
  columnText: string;
};

export type ZView = View & {
  columnText: string;
};

export function getViewFromModelZ(a: ZModel): ZView {
  return {
    id: randomId(),
    uid: a.uid,
    columnText: a.columnText,
    isNew: false,
    isDeleted: a.isDeleted,
  };
}

export function getModelFromViewZ(a: ZView): ZModel {
  return {
    uid: a.uid,
    columnText: a.columnText,
    createDate: randomCreatedDate(),
    createBy: "A_User_ID",
    updateDate: randomCreatedDate(),
    updateBy: "B_User_ID",
    isDeleted: a.isDeleted,
  };
}
