export type FormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};
export type CardProps = {
  url: string,
  title: string,
  description: string
};

export type select = {
  label?: string,
  value: string[],
  enabled?: boolean
};

export type textArea = {
  label?: string,
  row?: number,
  style?: React.CSSProperties[];
};

export type date = {
  label?: string,
};