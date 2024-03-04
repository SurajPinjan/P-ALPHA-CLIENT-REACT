import { Button } from "@mui/material";
import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { TDocumentDefinitions } from "pdfmake/interfaces";

const pdfContent = () => {
  const _content: TDocumentDefinitions = {
    content: [
      {
        text: "SIX SIGMA ANECDOTE",
        style: {
          // font: "Helvetica",
          fontSize: 12,
          bold: true,
          alignment: "center",
          background: "#00000",
          color: "#FFFFFF",
          // margin: [40, 20, 0, 20],
        },
      },

      // {
      //   text: "Demonstrating various styling options",
      //   style: {
      //     // font: "Arial",
      //     fontSize: 18,
      //     italics: true,
      //     lineHeight: 1.2,
      //   },
      // },

      // {
      //   text: "This paragraph displays text indentation and a colored background. It utilizes basic text formatting options.",
      //   style: {
      //     leadingIndent: 20,
      //     background: "#f5f5f5",
      //     color: "#333333",
      //   },
      // },

      // {
      //   ul: [
      //     "List item 1",
      //     {
      //       text: "List item 2 with a different font size",
      //       style: {
      //         fontSize: 12,
      //       },
      //     },
      //     "List item 3 (circle marker)",
      //     {
      //       text: "List item 4 (square marker)",
      //       markerColor: "■",
      //     },
      //   ],
      // },

      // {
      //   table: {
      //     headerRows: 1,
      //     body: [
      //       ["Column 1", "Column 2", "Column 3"],
      //       [
      //         "Data 1 with border",
      //         {
      //           text: "Data 2 with centered alignment",
      //           alignment: "center",
      //         },
      //         "Data 3 with blue color",
      //         {
      //           text: "Data 4 (italicized)",
      //           style: {
      //             italics: true,
      //           },
      //         },
      //       ],
      //     ],
      //     // layout: {
      //     //   hLineWidth: function (i, node) {
      //     //     return i === 0 || i === node.table.body.length ? 1 : 0.5;
      //     //   },
      //     //   vLineWidth: function (i, node) {
      //     //     return i === 0 || i === node.table.widths.length ? 1 : 0.5;
      //     //   },
      //     // },
      //   },
      // },

      // {
      //   text: "This text is placed within a custom object for further styling possibilities.",
      //   margin: [10, 5, 10, 5],
      //   fillColor: "#eeeeee",
      // },
    ],

    styles: {
      header: {
        // font: "Times New Roman",
        fontSize: 16,
        bold: true,
      },
    },
  };

  return _content;
};

interface PDFGenProps {}

const PDFGenrator: React.FC<PDFGenProps> = () => {
  const generatePdf = async () => {
    try {
      const pdfBlob: pdfMake.TCreatedPdf = pdfMake.createPdf(pdfContent());
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
