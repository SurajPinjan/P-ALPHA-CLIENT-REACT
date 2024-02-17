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

export type date = {
  label?: string;
};

export type GlobalState = {
  code: string;
  displayMsg: string;
  apiTime: string;
  errMsg?: string;
};

export const enum TableType {
  Audit,
  Detail,
}

export const enum TabType {
  Machine,
  Process,
}
