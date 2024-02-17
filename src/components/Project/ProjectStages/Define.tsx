import {
  AppBar,
  Button,
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
  Tab,
  Table,
  TableContainer,
  TableRow,
  Tabs,
  Typography,
  styled,
} from "@mui/material";
import { SetStateAction, useState } from "react";
import { Panel } from "../ProjectDetails";
import {
  Paper,
  TableBody,
  TableCell,
  Tooltip,
  TextField,
  CardContent,
  Card,
} from "@mui/material";
import React from "react";
import Box from "@mui/material/Box";
import TablePagination from "@mui/material/TablePagination";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SelectVariants from "../../../commons/SelectInput";
import Textarea from "../../../commons/Textarea";
import BasicDatePicker from "../../../commons/DatePicker";
interface Column {
  id: "stage" | "plan" | "actual" | "start1" | "end1" | "start2" | "end2";
  label: string;
  minWidth?: number;
  align?: "center";
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: "stage", label: "", minWidth: 150 },

  { id: "plan", label: "Plan", minWidth: 100, align: "center" },
  { id: "actual", label: "Actual", minWidth: 100, align: "center" },
  {
    id: "start1",
    label: "Start",
    minWidth: 80,
    align: "center",
  },
  {
    id: "end1",
    label: "End",
    minWidth: 80,
    align: "center",
  },
  {
    id: "start2",
    label: "Start",
    minWidth: 80,
    align: "center",
  },
  { id: "end2", label: "End", minWidth: 80, align: "center" },
];

function createData(
  stage: string,
  plan: number,
  actual: string,
  start1: string,
  end1: string,
  end2: string,
  start2: string
) {
  return { stage, plan, actual, start1, end1, start2, end2 };
}

const rows = [
  createData("Define", 5, "-", "-", "-", "-", "-"),
  createData("Measure", 15, "-", "-", "-", "-", "-"),
  createData("Analyse", 25, "-", "-", "-", "-", "-"),
  createData("Validate / Improve", 45, "-", "-", "-", "-", ""),
  createData("Control", 10, "-", "-", "-", "-", "-"),
  createData("Total", 100, "-", "-", "-", "-", "-"),
];

// end project schedule

// manage resource

interface resourceData {
  id: number;
  name: string;
  calories: number;
  fat: string | number;
  carbs: number;
  protein: number;
  actions: string;
}

function resourceData(
  id: number,
  name: string,
  calories: number,
  fat: string | number,
  carbs: string | number,
  protein: string | number,
  actions: string | number
) {
  return { id, name, calories, fat, carbs, protein, actions };
}

const tableRows = [
  resourceData(
    1,
    "G.T. Madhupatil",
    1127757,
    "Movement_Plan",
    "-",
    "Project-Lead",
    ""
  ),
  resourceData(2, "K. Nanthakumar", 34234, "Movement_Plan", "-", "Member", ""),
  resourceData(3, "A.S. Sambasivan", 42353, "Quality", "BB", "Member", ""),
];

// manage resource

const ButtonStyle = styled(Button)`
  background-color: #005f71;
  color: #fff;
  border: none;
  margin-bottom: 10px;
  font-size: 14px;
  text-transform: capitalize;

  &:hover {
    background-color: #115e6e;
  }
`;
const GridStyled = styled(Grid)({
  textAlign: "left",
});
const TableHeadStyled = styled("thead")({
  background: "#00B0AB",
  borderBottom: "none",
  color: "#ffffff",
});

const TableCellStyled = styled(TableCell)({
  padding: "5px",
  borderRight: "1px solid #ddd",
});
const SubTableCellStyled = styled(TableCell)({
  padding: "5px",
  borderRight: "1px solid #ddd",
  lineHeight: "0.5",
});

const TableRowStyled = styled(TableRow)({});

const TableCellAlign = styled(TableCell)({
  padding: "5px",
  border: "none",
  borderRight: "1px solid #ddd",
  position: "sticky",
});

const SubTableCell = styled(TableCell)({
  marginTop: "0",
  padding: "10px",
  border: "none",
  borderRight: "1px solid #ddd",
  position: "sticky",
  textAlign: "center",
});

const BoxStyled = styled(Box)``;

function Define() {
  const [index, setIndex] = useState(0);
  const onTabClicked = (_event: unknown, index: SetStateAction<number>) => {
    setIndex(index);
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    console.log(event);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [showForm, setShowForm] = useState(false);

  const handleAddClick = () => {
    setShowForm(true);
  };
  const handleCloseWindow = () => {
    setShowForm(false);
  };

  // function handleCheckboxChange(index: number): void {
  //     console.log(index);
  //     throw new Error("Function not implemented.");
  // }

  return (
    // <>
    // <Box style={{ width: '100%' }} >
    <BoxStyled style={{ padding: "" }}>
      <AppBar
        position="static"
        style={{
          background: "transparent",
          width: "100%",
          color: "#fff",
          marginTop: "0rem",
          marginBottom: "1rem",
        }}
      >
        <Tabs value={index} onChange={onTabClicked}>
          <Tab label="Upload Files" style={{ color: "#000" }} />
          <Tab label="project Schedule" style={{ color: "#000" }} />
          <Tab label=" Team (Manage Resource)" style={{ color: "#000" }} />
        </Tabs>
      </AppBar>
      <Panel value={index} index={0}>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Card>
              <CardContent style={{ paddingBottom: 1 }}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  style={{ color: "#115E6E", fontSize: 18 }}
                >
                  Suspected Scientific Reasons / Phenomena
                </Typography>
                <Textarea label="Enter Your Message Here" row={3} />
                <Box display={"flex"} justifyContent={"center"} marginTop={2}>
                  <ButtonStyle variant="contained">
                    Click here to upload
                  </ButtonStyle>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardContent style={{ paddingBottom: 1 }}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  style={{ color: "#115E6E", fontSize: 18 }}
                >
                  Problem Detection Stage & Frequency of Inspection
                </Typography>
                <Textarea
                  aria-label="empty textarea"
                  label="Enter Your Message Here"
                  row={3}
                />
                <Box display={"flex"} justifyContent={"center"} marginTop={2}>
                  <ButtonStyle variant="contained">
                    Click here to upload
                  </ButtonStyle>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box display={"flex"} justifyContent={"center"} marginTop={2}>
          <ButtonStyle variant="contained">Save & Next</ButtonStyle>
        </Box>
      </Panel>

      <Panel value={index} index={1}>
        <Paper sx={{ width: "100%" }}>
          <TableContainer style={{ overflow: "hidden" }}>
            <Table aria-label="sticky table">
              <TableHeadStyled>
                <TableRowStyled>
                  <TableCellAlign align="center" style={{ fontWeight: "bold" }}>
                    Stage
                  </TableCellAlign>
                  <TableCellStyled
                    align="center"
                    colSpan={2}
                    style={{ fontWeight: "bold" }}
                  >
                    Score
                  </TableCellStyled>
                  <TableCellStyled
                    align="center"
                    colSpan={2}
                    style={{ fontWeight: "bold" }}
                  >
                    Plan
                  </TableCellStyled>
                  <TableCellStyled
                    align="center"
                    colSpan={2}
                    style={{ fontWeight: "bold" }}
                  >
                    Actual
                  </TableCellStyled>
                </TableRowStyled>
                <TableRow>
                  {columns.map((column) => (
                    <TableCellStyled
                      key={column.id}
                      align={column.align}
                      style={{
                        top: 57,
                        minWidth: column.minWidth,
                        fontWeight: "bold",
                      }}
                    >
                      {column.label}
                    </TableCellStyled>
                  ))}
                </TableRow>
              </TableHeadStyled>
              <TableBody>
                <TableRow>
                  <SubTableCellStyled> Define</SubTableCellStyled>
                  <SubTableCellStyled>5</SubTableCellStyled>
                  <SubTableCellStyled>
                    {" "}
                    <TextField variant="standard" />{" "}
                  </SubTableCellStyled>
                  <SubTableCellStyled>18-Jan-23</SubTableCellStyled>
                  <SubTableCellStyled>18-Jul-23</SubTableCellStyled>
                  <SubTableCellStyled>-</SubTableCellStyled>
                  <SubTableCellStyled>-</SubTableCellStyled>
                </TableRow>
                <TableRow>
                  <SubTableCellStyled> Measure</SubTableCellStyled>
                  <SubTableCellStyled>5</SubTableCellStyled>
                  <SubTableCellStyled>
                    {" "}
                    <TextField variant="standard" />{" "}
                  </SubTableCellStyled>
                  <SubTableCellStyled>
                    {" "}
                    <BasicDatePicker />{" "}
                  </SubTableCellStyled>
                  <SubTableCellStyled>
                    <BasicDatePicker />
                  </SubTableCellStyled>
                  <SubTableCellStyled>-</SubTableCellStyled>
                  <SubTableCellStyled>-</SubTableCellStyled>
                </TableRow>
                <TableRow>
                  <SubTableCellStyled> Analyze </SubTableCellStyled>
                  <SubTableCellStyled>5</SubTableCellStyled>
                  <SubTableCellStyled>
                    {" "}
                    <TextField variant="standard" />{" "}
                  </SubTableCellStyled>
                  <SubTableCellStyled>
                    {" "}
                    <BasicDatePicker />{" "}
                  </SubTableCellStyled>
                  <SubTableCellStyled>
                    <BasicDatePicker />
                  </SubTableCellStyled>
                  <SubTableCellStyled>-</SubTableCellStyled>
                  <SubTableCellStyled>-</SubTableCellStyled>
                </TableRow>
                <TableRow>
                  <SubTableCellStyled> Validate / Improve </SubTableCellStyled>
                  <SubTableCellStyled>5</SubTableCellStyled>
                  <SubTableCellStyled>
                    {" "}
                    <TextField variant="standard" />{" "}
                  </SubTableCellStyled>
                  <SubTableCellStyled>
                    {" "}
                    <BasicDatePicker />{" "}
                  </SubTableCellStyled>
                  <SubTableCellStyled>
                    <BasicDatePicker />
                  </SubTableCellStyled>
                  <SubTableCellStyled>-</SubTableCellStyled>
                  <SubTableCellStyled>-</SubTableCellStyled>
                </TableRow>
                <TableRow>
                  <SubTableCellStyled> Control </SubTableCellStyled>
                  <SubTableCellStyled>5</SubTableCellStyled>
                  <SubTableCellStyled>
                    {" "}
                    <TextField variant="standard" />{" "}
                  </SubTableCellStyled>
                  <SubTableCellStyled>
                    {" "}
                    <BasicDatePicker />{" "}
                  </SubTableCellStyled>
                  <SubTableCellStyled>
                    <BasicDatePicker />
                  </SubTableCellStyled>
                  <SubTableCellStyled>-</SubTableCellStyled>
                  <SubTableCellStyled>-</SubTableCellStyled>
                </TableRow>
                <TableRow>
                  <SubTableCellStyled> Total </SubTableCellStyled>
                  <SubTableCellStyled>25</SubTableCellStyled>
                  <SubTableCellStyled>
                    {" "}
                    <TextField variant="standard" />{" "}
                  </SubTableCellStyled>
                  <SubTableCellStyled>
                    {" "}
                    <BasicDatePicker />{" "}
                  </SubTableCellStyled>
                  <SubTableCellStyled>
                    <BasicDatePicker />
                  </SubTableCellStyled>
                  <SubTableCellStyled></SubTableCellStyled>
                  <SubTableCellStyled></SubTableCellStyled>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <Grid
          item
          xs={12}
          sm={6}
          style={{ textAlign: "right", marginTop: "2rem" }}
        >
          <ButtonStyle variant="contained">Save & Next</ButtonStyle>
        </Grid>
        {/* project schedule */}
      </Panel>
      <Panel value={index} index={2}>
        {/* manage resource */}
        <GridStyled item xs={12} sm={6} style={{ width: "100%" }}>
          <Grid item xs={12} sm={12} style={{ textAlign: "right" }}>
            <ButtonStyle variant="contained" onClick={handleAddClick}>
              Add Team Member
            </ButtonStyle>
          </Grid>
          {showForm && (
            <Card className="outerContainer">
              <CardContent style={{ paddingBottom: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <TextField
                      style={{ width: "100%" }}
                      id="standard-basic"
                      label="Employee Name"
                      variant="standard"
                    />
                    {/* <SelectVariants value={['']} label='Employee Name' /> */}
                  </Grid>
                  <Grid item xs={2}>
                    <SelectVariants value={[""]} label="Division" />
                  </Grid>
                  <Grid item xs={2}>
                    <SelectVariants value={[""]} label="Department" />
                  </Grid>
                  <Grid item xs={2}>
                    <SelectVariants value={[""]} label="Sub Department" />
                  </Grid>
                  <Grid item xs={2}>
                    <SelectVariants value={[""]} label="Role" />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      style={{ width: "100%" }}
                      id="standard-basic"
                      label="Number"
                      variant="standard"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      style={{ width: "100%" }}
                      id="standard-basic"
                      label="DOJ"
                      variant="standard"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      style={{ width: "100%" }}
                      id="standard-basic"
                      label="DOB"
                      variant="standard"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      style={{ width: "100%" }}
                      id="standard-basic"
                      label="Level"
                      variant="standard"
                    />
                  </Grid>
                  {/* <Grid item xs={2}>
                                        <TextField style={{ width: '100%' }} id="standard-basic" label="Status" variant="standard" />
                                    </Grid> */}

                  <Grid item xs={1}>
                    {/* <Checkbox
                                            onChange={() => handleCheckboxChange(index)} aria-label="Status"
                                            
                                            
                                        /> */}
                    <FormGroup>
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Status"
                      />
                    </FormGroup>
                  </Grid>
                  {showForm && (
                    <Grid
                      item
                      xs={3}
                      style={{ textAlign: "right", marginTop: "2rem" }}
                    >
                      <ButtonStyle
                        variant="contained"
                        style={{ marginRight: "1rem" }}
                      >
                        Save
                      </ButtonStyle>
                      <ButtonStyle
                        variant="contained"
                        onClick={handleCloseWindow}
                      >
                        Cancel
                      </ButtonStyle>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          )}
        </GridStyled>
        <TableContainer component={Paper} sx={{ width: "100%" }}>
          <Table stickyHeader aria-label="simple table">
            <TableHeadStyled>
              <TableRow>
                <SubTableCell style={{ fontWeight: "bold" }}>ID</SubTableCell>
                <SubTableCell style={{ fontWeight: "bold" }}>Name</SubTableCell>
                <SubTableCell style={{ fontWeight: "bold" }}>
                  Employee Code
                </SubTableCell>
                <SubTableCell style={{ fontWeight: "bold" }}>
                  Department
                </SubTableCell>
                <SubTableCell style={{ fontWeight: "bold" }}>
                  Certification
                </SubTableCell>
                <SubTableCell style={{ fontWeight: "bold" }}>Role</SubTableCell>
                <SubTableCell style={{ fontWeight: "bold" }}>
                  Actions
                </SubTableCell>
              </TableRow>
            </TableHeadStyled>
            <TableBody>
              {tableRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <React.Fragment key={row.id}>
                      <TableRow key={row.name}>
                        <SubTableCellStyled component="th" scope="row">
                          {row.id}
                        </SubTableCellStyled>
                        <SubTableCellStyled component="th" scope="row">
                          {row.name}
                        </SubTableCellStyled>
                        <SubTableCellStyled>{row.calories}</SubTableCellStyled>
                        <SubTableCellStyled>{row.fat}</SubTableCellStyled>
                        <SubTableCellStyled>{row.carbs}</SubTableCellStyled>
                        <SubTableCellStyled>{row.protein}</SubTableCellStyled>
                        <SubTableCellStyled style={{ textAlign: "center" }}>
                          <Tooltip title="Edit">
                            <EditIcon className="iconsStyleEdit" />
                          </Tooltip>
                          <Tooltip title="Delete">
                            <DeleteIcon className="iconsStyleDelete" />
                          </Tooltip>
                        </SubTableCellStyled>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[2, 5]}
            component="div"
            count={tableRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Panel>
    </BoxStyled>
  );
}

export default Define;
