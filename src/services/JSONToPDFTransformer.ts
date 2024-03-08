import { TableCell } from "pdfmake/interfaces";
import { MakePDFCellData } from "../types/types";

export const _JSONToPDFtransformer = (
  _data: Map<string, MakePDFCellData>,
  column_count: number
): TableCell[][] => {
  let pushCount: number = 0;
  const _response: TableCell[][] = [];

  for (const [key, value] of _data) {
    if (pushCount === 0 || pushCount % (column_count * 2) == 0) {
      _response.push([]);
    }

    _response[_response.length - 1].push({
      text: key,
      bold: true,
      fontSize: 8,
      color: "black",
      fillColor: "gray",
    });
    _response[_response.length - 1].push({
      text: value.text,
      colSpan: value.colSpan,
      rowSpan: value.rowSpan,
      fontSize: 8,
    });

    pushCount = pushCount + 2;
  }

  if (_response[_response.length - 1].length < column_count * 2) {
    let fillerCount: number =
      column_count * 2 - _response[_response.length - 1].length;
    while (fillerCount !== 0) {
      _response[_response.length - 1].push({
        text: "",
        fontSize: 8,
        italics: true,
        color: "black",
        fillColor: "gray",
      });
      _response[_response.length - 1].push("");
      fillerCount = fillerCount - 2;
    }
  }

  return _response;
};

export const jsonToMap = <T>(json: T): Map<string, MakePDFCellData> => {
  const map = new Map<string, MakePDFCellData>();
  for (const key in json) {
    map.set(key, json[key] as MakePDFCellData);
  }
  return map;
};
