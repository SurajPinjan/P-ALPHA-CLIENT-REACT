import { GridValidRowModel } from "@mui/x-data-grid";

export type View = GridValidRowModel & {
  uid?: number;
  isNew: boolean;
  isDeleted: boolean;
};
