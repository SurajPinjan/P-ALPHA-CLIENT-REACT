import { randomCreatedDate, randomId } from "@mui/x-data-grid-generator";
import { Model } from "./Model";
import { View } from "./View";

export type YModel = Model & {
  columnText: string;
  x_id: number;
};

export type YView = View & {
  columnText: string;
  x_id: number;
};

export function getViewFromModelY(a: YModel): YView {
  return {
    id: randomId(),
    uid: a.uid,
    x_id: a.x_id,
    columnText: a.columnText,
    isNew: false,
    isDeleted: a.isDeleted,
  };
}

export function getModelFromViewY(a: YView): YModel {
  return {
    uid: a.uid,
    columnText: a.columnText,
    x_id: a.x_id,
    createDate: randomCreatedDate(),
    createBy: "A_User_ID",
    updateDate: randomCreatedDate(),
    updateBy: "B_User_ID",
    isDeleted: a.isDeleted,
  };
}
