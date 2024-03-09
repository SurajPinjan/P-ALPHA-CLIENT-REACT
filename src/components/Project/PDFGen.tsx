import { Button } from "@mui/material";
import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import {
  _JSONToPDFtransformer,
  jsonToMap,
} from "../../services/JSONToPDFTransformer";
// import pdfFonts from "pdfmake/build/vfs_fonts";
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { TDocumentDefinitions } from "pdfmake/interfaces";
import { urlToBase64 } from "../../services/ApiService";
import { MakePDFCellData } from "../../types/types";

const pdfContent = async () => {
  const _content: TDocumentDefinitions = {
    content: [
      {
        table: {
          widths: ["*"],
          body: [
            [
              {
                text: "SIX SIGMA ANECDOTE",
                style: "title",
              },
            ],
          ],
        },
      },
      {
        alignment: "justify",
        columns: [
          {
            style: "tableExample",
            table: {
              widths: [30, "*", 30, "*", 30, "*"],
              body: _JSONToPDFtransformer(
                jsonToMap({
                  fontSize: {
                    text: "200",
                  } as MakePDFCellData,
                  bold: {
                    text: "200",
                  } as MakePDFCellData,
                  alignment: {
                    text: "center",
                  } as MakePDFCellData,
                  background: {
                    text: "FFFFF",
                  } as MakePDFCellData,
                  color: {
                    text: "DDD",
                  } as MakePDFCellData,
                  sbold: {
                    text: "EEE",
                  } as MakePDFCellData,
                  salignment: {
                    text: "center",
                  } as MakePDFCellData,
                  sbackground: {
                    text: "#FFFFFF",
                  } as MakePDFCellData,
                  scolor: {
                    text: "center",
                  } as MakePDFCellData,
                }),
                3
              ),
            },
          },
          {
            style: "tableExample",
            table: {
              widths: [30, "*", 30, "*", 30, "*"],
              body: _JSONToPDFtransformer(
                jsonToMap({
                  fontSize: {
                    text: "200",
                  } as MakePDFCellData,
                  bold: {
                    text: "200",
                  } as MakePDFCellData,
                  alignment: {
                    text: "center",
                  } as MakePDFCellData,
                  background: {
                    text: "FFFFF",
                  } as MakePDFCellData,
                  color: {
                    text: "DDD",
                  } as MakePDFCellData,
                  sbold: {
                    text: "EEE",
                  } as MakePDFCellData,
                  salignment: {
                    text: "center",
                  } as MakePDFCellData,
                  sbackground: {
                    text: "#FFFFFF",
                  } as MakePDFCellData,
                  scolor: {
                    text: "center",
                  } as MakePDFCellData,
                }),
                3
              ),
            },
          },
        ],
      },
      {
        alignment: "justify",
        columns: [
          {
            image: await urlToBase64(
              "http://localhost:3000/uploads/istockphoto-2.jpg"
            ),
            width: 130,
            margin: [
              // Left, Top, Right, Bottom
              0, 2, 0, 2,
            ],
          },
          {
            table: {
              widths: [30, "*", 30, "*", 30, "*"],
              body: _JSONToPDFtransformer(
                jsonToMap({
                  fontSize: {
                    text: "200",
                  } as MakePDFCellData,
                  bold: {
                    text: "200",
                  } as MakePDFCellData,
                  alignment: {
                    text: "center",
                  } as MakePDFCellData,
                  background: {
                    text: "FFFFF",
                  } as MakePDFCellData,
                  color: {
                    text: "DDD",
                  } as MakePDFCellData,
                  sbold: {
                    text: "EEE",
                  } as MakePDFCellData,
                  salignment: {
                    text: "center",
                  } as MakePDFCellData,
                  sbackground: {
                    text: "#FFFFFF",
                  } as MakePDFCellData,
                  scolor: {
                    text: "center",
                  } as MakePDFCellData,
                }),
                3
              ),
            },
          },
        ],
      },
      {
        table: {
          headerRows: 2,
          body: [
            [
              {
                bold: true,
                fontSize: 8,
                color: "black",
                fillColor: "gray",
                alignment: "center",
                text: "Header with Colspan = 2",
                colSpan: 2,
              },
              {},
              {
                text: "Header 3",
                bold: true,
                fontSize: 8,
                color: "black",
                fillColor: "gray",
                alignment: "center",
              },
            ],
            [
              {
                text: "Header 1",
                bold: true,
                fontSize: 8,
                color: "black",
                fillColor: "gray",
                alignment: "center",
              },
              {
                text: "Header 2",
                bold: true,
                fontSize: 8,
                color: "black",
                fillColor: "gray",
                alignment: "center",
              },
              {
                text: "Header 3",
                bold: true,
                fontSize: 8,
                color: "black",
                fillColor: "gray",
                alignment: "center",
              },
            ],
            ["Sample value 1", "Sample value 2", "Sample value 3"],
            [
              {
                rowSpan: 3,
                text: "rowSpan set to 3\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor",
              },
              "Sample value 2",
              "Sample value 3",
            ],
            ["", "Sample value 2", "Sample value 3"],
            ["Sample value 1", "Sample value 2", "Sample value 3"],
            [
              "Sample value 1",
              {
                colSpan: 2,
                rowSpan: 2,
                text: "Both:\nrowSpan and colSpan\ncan be defined at the same time",
              },
              "",
            ],
            ["Sample value 1", "", ""],
          ],
        },
      },
    ],

    styles: {
      title: {
        fontSize: 8,
        bold: true,
        alignment: "center",
        fillColor: "#00000",
        color: "#FFFFFF",
      },
    },
  };

  return _content;
};

interface PDFGenProps {}

const PDFGenrator: React.FC<PDFGenProps> = () => {
  const generatePdf = async () => {
    try {
      const pdfBlob: pdfMake.TCreatedPdf = pdfMake.createPdf(
        await pdfContent()
      );
      pdfBlob.open();
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  React.useEffect(() => {
    generatePdf();
  }, []);

  return (
    <>
      <div>
        <Button onClick={generatePdf}>Generate PDF</Button>
      </div>
    </>
  );
};

export default PDFGenrator;
