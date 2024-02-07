import { randomCreatedDate, randomId } from "@mui/x-data-grid-generator";
import { Model } from "./Model";
import { View } from "./View";
import { SELECT_VALUES } from "../types/enums";

export type MasterModel = Model & {
  master?: SELECT_VALUES;
};

export type MasterView = View & {
  master?: SELECT_VALUES;
};

export function getViewFromModelMaster(a: MasterModel): MasterView {
  return {
    id: randomId(),
    uid: a.uid,
    master: a.master,
    isNew: false,
    isDeleted: a.isDeleted,
  };
}

export function getModelFromViewU(a: MasterView): MasterModel {
  return {
    uid: a.uid,
    master: a.master,
    createDate: randomCreatedDate(),
    createBy: "A_User_ID",
    updateDate: randomCreatedDate(),
    updateBy: "B_User_ID",
    isDeleted: a.isDeleted,
  };
}
