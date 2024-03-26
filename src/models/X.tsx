import { randomCreatedDate, randomId } from "@mui/x-data-grid-generator";
import { DateTime } from "luxon";
import { Model } from "./Model";
import { View } from "./View";
import { SELECT_VALUES } from "../types/enums";
import { YModel, YView, getModelFromViewY, getViewFromModelY } from "./Y";

export type XModel = Model & {
  columnDate: string;
  url: string;
  columnUText: string;
  columnNumber: number;
  columnSelect: SELECT_VALUES;
  columnMultiValue: string;
};

export type XView = View & {
  columnDate: Date;
  url: string;
  columnUText: string;
  columnNumber: number;
  columnSelect: SELECT_VALUES;
  columnMultiValue: string[];
};

export interface FullXModelAttributes extends XModel {
  yList: YModel[];
}

export function getViewFromModelX(a: XModel): XView {
  return {
    id: randomId(),
    uid: a.uid,
    url: a.url,
    columnNumber: a.columnNumber,
    columnSelect: a.columnSelect,
    columnUText: a.columnUText,
    columnDate: DateTime.fromMillis(parseInt(a.columnDate)).toJSDate(),
    columnMultiValue: JSON.parse(a.columnMultiValue),
    isNew: false,
    isDeleted: a.isDeleted,
  };
}

export function getModelFromViewX(a: XView): XModel {
  return {
    uid: a.uid,
    columnDate: DateTime.fromJSDate(a.columnDate).toMillis().toString(),
    url: a.url,
    columnNumber: a.columnNumber,
    columnUText: a.columnUText,
    columnSelect: a.columnSelect,
    columnMultiValue: JSON.stringify(a.columnMultiValue),
    createDate: randomCreatedDate(),
    createBy: "A_User_ID",
    updateDate: randomCreatedDate(),
    updateBy: "B_User_ID",
    isDeleted: a.isDeleted,
  };
}

// Full X Model

export interface FullXModelAttributes extends XModel {
  yList: YModel[];
}

export interface FullXViewAttributes extends XView {
  yList: YView[];
}

export function getFullModelFromViewX(
  a: FullXViewAttributes
): FullXModelAttributes {
  return {
    ...getModelFromViewX(a),
    yList: a.yList.map((y) => getModelFromViewY(y)),
  };
}

export function getFullViewFromModelX(
  a: FullXModelAttributes
): FullXViewAttributes {
  return {
    ...getViewFromModelX(a),
    yList: a.yList.map((y) => getViewFromModelY(y)),
  };
}
