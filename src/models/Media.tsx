import { randomCreatedDate, randomId } from "@mui/x-data-grid-generator";
import { Model } from "./Model";
import { View } from "./View";
import { ENTITY_NAME } from "../types/enums";

export type MediaModel = Model & {
  fileurl: string;
  filetype: string;
  filesize: number;
  filename: string;
  entityType: ENTITY_NAME;
  entityId: number;
};

export type MediaView = View & {
  fileurl: string;
  filetype: string;
  filesize: number;
  filename: string;
  entityType: ENTITY_NAME;
  entityId: number;
};

export function getViewFromModelMedia(a: MediaModel): MediaView {
  return {
    id: randomId(),
    uid: a.uid,
    fileurl: a.fileurl,
    filetype: a.filetype,
    filesize: a.filesize,
    filename: a.filename,
    entityType: a.entityType,
    entityId: a.entityId,
    isNew: false,
    isDeleted: a.isDeleted,
  };
}

export function getModelFromViewMedia(a: MediaView): MediaModel {
  return {
    uid: a.uid,
    fileurl: a.fileurl,
    filetype: a.filetype,
    filesize: a.filesize,
    filename: a.filename,
    entityType: a.entityType,
    entityId: a.entityId,
    createDate: randomCreatedDate(),
    createBy: "A_User_ID",
    updateDate: randomCreatedDate(),
    updateBy: "B_User_ID",
    isDeleted: a.isDeleted,
  };
}
