import { randomId } from "@mui/x-data-grid-generator";
import { ReportView } from "./View";

export type ReportModel = {
  url: string;
  columnUText: string;
  computedColumnA?: string;
};

export type ReportVue = ReportView & {
  id: string;
  url: string;
  columnUText: string;
  computedColumnA?: string;
};

export function getViewFromModelReport(a: ReportModel): ReportVue {
  return {
    id: randomId(),
    url: a.url,
    columnUText: a.columnUText,
    computedColumnA: a.computedColumnA,
  };
}
