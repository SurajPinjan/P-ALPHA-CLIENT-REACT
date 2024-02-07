import { Box, Card, CardContent, Input, Typography } from "@mui/material";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { randomId } from "@mui/x-data-grid-generator";
import filepdf from "../../../assets/images/filepdf.pdf";
import FullFeaturedCrudGrid from "./AuditTable";
import { TabType, TableType } from "./MeasureBak";

// textarea

const initialRows: GridRowsProp = [
  {
    id: randomId(),
    acts: "Glass Thickness reduced",
    controlmeasure: "Heigh Resolution camera installed",
    ssv: "Assembly Process",
  },
  {
    id: randomId(),
    acts: "Glass Thickness reduced",
    controlmeasure: "Weekly manual check",
    ssv: "Assembly Process",
  },
  // {
  //     id: randomId(),
  //     acts: 'Glass Thickness reduced',
  //     controlmeasure: '',
  //     ssv: 'Assembly Process'
  // },
  // {
  //     id: randomId(),
  //     acts: 'Glass Thickness reduced',
  //     controlmeasure: '',
  //     ssv: 'Assembly Process'
  // }
];

function Control() {
  const columnsDetails: GridColDef[] = [
    {
      field: "ssv",
      headerName: "SSV's",
      width: 270,
      type: "singleSelect",
      editable: true,
      valueOptions: ["Assembly Process", "Day Star Hole Diameter"],
    },
    {
      field: "acts",
      headerName: "Action Taken",
      width: 220,
      editable: true,
      type: "singleSelect",
      valueOptions: ["Glass Thickness reduced", "Glass Height reduced"],
    },
    {
      field: "controlmeasure",
      width: 450,
      headerName: "Control Measure Taken",
      editable: true,
    },
  ];

  return (
    <>
      <Box>
        <Card>
          <CardContent>
            {/* <Typography gutterBottom variant="h5" component="div" style={{ color: '#115E6E', fontSize: 18, fontWeight: 600 }}>
                            Action Planned and Implemented </Typography>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead style={{ backgroundColor: '#00B0AB' }}>
                                    <TableRow>
                                        <TableCellStyle>Description</TableCellStyle>
                                        <TableCellStyle>Baseline</TableCellStyle>
                                        <TableCellStyle>Target</TableCellStyle>
                                        <TableCellStyle>Actual</TableCellStyle>
                                        <TableCellStyle>UOM</TableCellStyle>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCellData component="th" scope="row">
                                            Quality Level
                                        </TableCellData>
                                        <TableCellData component="th" scope="row">
                                            25000
                                        </TableCellData>
                                        <TableCellData component="th" scope="row">
                                            5000
                                        </TableCellData>
                                        <TableCellData component="th" scope="row">
                                            <TextField id="standard-basic" variant="standard" value="5000" />
                                        </TableCellData>
                                        <TableCellData component="th" scope="row">
                                            PPM
                                        </TableCellData>
                                    </TableRow>
                                    <TableRow>
                                        <TableCellData component="th" scope="row">
                                            Cost
                                        </TableCellData>
                                        <TableCellData component="th" scope="row">
                                            -
                                        </TableCellData>
                                        <TableCellData component="th" scope="row">
                                            0.29
                                        </TableCellData>
                                        <TableCellData component="th" scope="row">
                                            <TextField id="standard-basic" variant="standard" value="2.23" />
                                        </TableCellData>
                                        <TableCellData component="th" scope="row">
                                            Rs. Lakhs
                                        </TableCellData>
                                    </TableRow>
                                </TableBody>
                                <TableFooter>
                                </TableFooter>
                            </Table>
                        </TableContainer> */}
            <FullFeaturedCrudGrid
              isClicked={null}
              hasAttachment={true}
              tableTitle="Control Against Actions"
              buttonTitle="Add Control"
              initialColumns={columnsDetails}
              initialRows={initialRows}
              data={TableType.Audit}
              tab={TabType.Process}
            ></FullFeaturedCrudGrid>
          </CardContent>
        </Card>
      </Box>
      <Box marginTop={2}>
        <Card>
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              style={{ color: "#115E6E", fontSize: 18, fontWeight: 600 }}
            >
              Reference Document
            </Typography>
            <label htmlFor="file-input-1">
              <object
                data={filepdf}
                type="application/pdf"
                width="100%"
                height="500px"
              ></object>
            </label>
            <Input
              id="file-input-1"
              type="file"
              style={{ display: "none" }}
              inputProps={{ accept: ".pdf" }}
            />
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
export default Control;
