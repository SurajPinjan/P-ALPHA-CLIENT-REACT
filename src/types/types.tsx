import { GridColDef, GridRowsProp } from "@mui/x-data-grid";

export type FormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};
export type CardProps = {
  url: string;
  title: string;
  description: string;
};

export type select = {
  label?: string;
  value: string[];
  enabled?: boolean;
};

export type textArea = {
  label?: string;
  row?: number;
  style?: React.CSSProperties[];
};

export type DateProps = {
  label?: string;
  value: Date;
  onChange: (date: Date | null) => void;
};

export type GlobalState = {
  code: string;
  displayMsg: string;
  apiTime: string;
  APIUrl: string;
  APIBody: string;
  errMsg?: string;
  selectUId?: number;
};

export const enum TableType {
  Audit,
  Detail,
}

export const enum TabType {
  Machine,
  Process,
}

export interface DataList<T> {
  isLoading: boolean;
  data: T[];
}

export interface FileInfo {
  url: string;
  filesize: number;
  filetype: string;
  filename: string;
}

export interface Page {
  isLoading: boolean;
  data: GridRowsProp;
  total: number;
  page: number;
  pageSize: number;
}

export type SortableGridColDef = GridColDef & {
  order: number;
};

export const sortGridColDef = (
  a: SortableGridColDef,
  b: SortableGridColDef
): number => {
  return a.order > b.order ? 1 : a.order < b.order ? -1 : 0;
};
