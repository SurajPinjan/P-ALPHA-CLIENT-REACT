import { randomCreatedDate, randomId } from "@mui/x-data-grid-generator";
import { DateTime } from "luxon";
import { Model } from "./Model";
import { View } from "./View";
import { SELECT_VALUES } from "../types/enums";

export type XModel = Model & {
  columnDate: string;
  url: string;
  columnUText: string;
  columnSelect: SELECT_VALUES;
};

export type XView = View & {
  columnDate: Date;
  url: string;
  columnUText: string;
  columnSelect: SELECT_VALUES;
};

export function getViewFromModelX(a: XModel): XView {
  return {
    id: randomId(),
    uid: a.uid,
    url: a.url,
    columnSelect: a.columnSelect,
    columnUText: a.columnUText,
    columnDate: DateTime.fromMillis(parseInt(a.columnDate)).toJSDate(),
    isNew: false,
    isDeleted: a.isDeleted,
  };
}

export function getModelFromViewX(a: XView): XModel {
  return {
    uid: a.uid,
    columnDate: DateTime.fromJSDate(a.columnDate).toMillis().toString(),
    url: a.url,
    columnUText: a.columnUText,
    columnSelect: a.columnSelect,
    createDate: randomCreatedDate(),
    createBy: "A_User_ID",
    updateDate: randomCreatedDate(),
    updateBy: "B_User_ID",
    isDeleted: a.isDeleted,
  };
}
