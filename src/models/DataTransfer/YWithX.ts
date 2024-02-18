import { randomCreatedDate, randomId } from "@mui/x-data-grid-generator";
import { Model } from "../Model";
import { View } from "../View";
import { SELECT_VALUES } from "../../types/enums";
import { YModel } from "../Y";
import { DateTime } from "luxon";

export type YWithXModel = Model & {
  columnText: string;
  x_id: number;
  x_columnUText: string;
  x_columnDate: string;
  x_url: string;
  x_columnSelect: SELECT_VALUES;
  x_uid: number;
};

export type YWithXView = View & {
  columnText: string;
  x_id: number;
  x_columnUText: string;
  x_columnDate: Date;
  x_url: string;
  x_columnSelect: SELECT_VALUES;
  x_uid: number;
};

export function getViewFromModelYWithX(a: YWithXModel): YWithXView {
  return {
    id: randomId(),
    uid: a.uid,
    x_id: a.x_id,
    x_columnSelect: a.x_columnSelect,
    x_url: a.x_url,
    x_columnUText: a.x_columnUText,
    x_columnDate: DateTime.fromMillis(parseInt(a.x_columnDate)).toJSDate(),
    x_uid: a.x_uid,
    columnText: a.columnText,
    isNew: false,
    isDeleted: a.isDeleted,
  };
}

export function getModelFromViewYWithX(a: YWithXView): YWithXModel {
  return {
    uid: a.uid,
    columnText: a.columnText,
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

export function getYModelFromViewYWithX(a: YWithXView): YModel {
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
