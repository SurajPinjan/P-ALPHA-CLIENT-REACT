import { randomCreatedDate, randomId } from "@mui/x-data-grid-generator";
import { Model } from "./Model";
import { View } from "./View";

export type XDetailModel = Model & {
  columnDetail: string;
  x_id: number;
};

export type XDetailView = View & {
  columnDetail: string;
  x_id: number;
};

export function getViewFromModelXDetail(a: XDetailModel): XDetailView {
  return {
    id: randomId(),
    uid: a.uid,
    x_id: a.x_id,
    columnDetail: a.columnDetail,
    isNew: false,
    isDeleted: a.isDeleted,
  };
}

export function getModelFromViewXDetail(a: XDetailView): XDetailModel {
  return {
    uid: a.uid,
    columnDetail: a.columnDetail,
    x_id: a.x_id,
    createDate: randomCreatedDate(),
    createBy: "A_User_ID",
    updateDate: randomCreatedDate(),
    updateBy: "B_User_ID",
    isDeleted: a.isDeleted,
  };
}
