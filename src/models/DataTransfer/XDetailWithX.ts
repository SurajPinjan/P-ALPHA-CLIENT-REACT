import { randomCreatedDate, randomId } from "@mui/x-data-grid-generator";
import { DateTime } from "luxon";
import { SELECT_VALUES } from "../../types/enums";
import { Model } from "../Model";
import { View } from "../View";
import { XDetailModel } from "../XDetail";

export type XDetailWithXModel = Model & {
  columnDetail: string;
  x_id: number;
  x_columnUText: string;
  x_columnDate: string;
  x_url: string;
  x_columnSelect: SELECT_VALUES;
  x_uid: number;
};

export type XDetailWithXView = View & {
  columnDetail: string;
  x_id: number;
  x_columnUText: string;
  x_columnDate: Date;
  x_url: string;
  x_columnSelect: SELECT_VALUES;
  x_uid: number;
};

export function getViewFromModelXDetailWithX(
  a: XDetailWithXModel
): XDetailWithXView {
  return {
    id: randomId(),
    uid: a.uid,
    x_id: a.x_id,
    x_columnSelect: a.x_columnSelect,
    x_url: a.x_url,
    x_columnUText: a.x_columnUText,
    x_columnDate: DateTime.fromMillis(parseInt(a.x_columnDate)).toJSDate(),
    x_uid: a.x_uid,
    columnDetail: a.columnDetail,
    isNew: false,
    isDeleted: a.isDeleted,
  };
}

export function getModelFromViewXDetailWithX(
  a: XDetailWithXView
): XDetailWithXModel {
  return {
    uid: a.uid,
    columnDetail: a.columnDetail,
    x_id: a.x_id,
    x_columnDate: DateTime.fromJSDate(a.x_columnDate).toMillis().toString(),
    x_url: a.x_url,
    x_columnUText: a.x_columnUText,
    x_columnSelect: a.x_columnSelect,
    x_uid: a.x_uid,
    createDate: randomCreatedDate(),
    createBy: "A_User_ID",
    updateDate: randomCreatedDate(),
    updateBy: "B_User_ID",
    isDeleted: a.isDeleted,
  };
}

export function getXDetailModelFromViewXDetailWithX(
  a: XDetailWithXView
): XDetailModel {
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
