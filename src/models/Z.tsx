import { randomCreatedDate, randomId } from "@mui/x-data-grid-generator";
import { Model } from "./Model";
import { View } from "./View";
import { DateTime } from "luxon";

export type ZModel = Model & {
  columnText: string;
  monthColumn: string;
};

export type ZView = View & {
  columnText: string;
  monthColumn: Date;
};

export function getViewFromModelZ(a: ZModel): ZView {
  return {
    id: randomId(),
    uid: a.uid,
    monthColumn: DateTime.fromMillis(parseInt(a.monthColumn)).toJSDate(),
    columnText: a.columnText,
    isNew: false,
    isDeleted: a.isDeleted,
  };
}

export function getModelFromViewZ(a: ZView): ZModel {
  return {
    uid: a.uid,
    columnText: a.columnText,
    monthColumn: DateTime.fromJSDate(a.monthColumn).toMillis().toString(),
    createDate: randomCreatedDate(),
    createBy: "A_User_ID",
    updateDate: randomCreatedDate(),
    updateBy: "B_User_ID",
    isDeleted: a.isDeleted,
  };
}
