import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  TableFooter,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useState } from "react";
import styled from "styled-components";
import "../../App.css";
import SelectVariants from "../../commons/SelectInput";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";

const ButtonStyle = styled(Button)`
  background-color: #115e6e !important;
  color: white;
  border: none;
  margin-bottom: 10px !important;
  font-size: 14px !important;
  text-transform: capitalize !important;

  &:hover {
    background-color: #115e6e;
  }
`;

interface DataModel {
  name: string;
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
  status: string;
}

const tableSellStyle = {
  color: "white",
  fontSize: "14px",
  fontWight: "600",
};

const tableData = {
  paddingTop: "0",
  paddingBottom: "0",
};

function ProblemBank() {
  // states
  const [open, setOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [openSearchData, setOpenSearchData] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [project, setProject] = React.useState<null | HTMLElement>(null);
  const [problem, setProblem] = React.useState<null | HTMLElement>(null);

  const navigate = useNavigate();

  // non state constants
  const openmenu = Boolean(anchorEl);
  const openMenuAddProject = Boolean(project);
  const openMenuProblem = Boolean(problem);

  // event handlers
  const toggleCardVisibility = () => {
    setOpen(!open);
    setOpenSearch(true);
  };

  const GotocCharter = () => {
    navigate("/dashboard/charter_update");
  };
  const ShowSearch = () => {
    setOpenSearch(!openSearch);
    setOpen(false);
  };
  const ShowSearchData = () => {
    setOpen(open);
    setOpenSearch(false);
    setOpenSearchData(!openSearchData);
    setOpen(false);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  function createData(data: DataModel) {
    return data;
  }

  const rows = [
    createData({
      name: "Frozen yoghurt",
      calories: 159,
      fat: 6.0,
      carbs: 24,
      protein: 4.0,
      status: "Not Eligible",
    }),
  ];

  const GotoProjectDetails = () => {
    navigate("/dashboard/project_details");
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const OpenProjectMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setProject(event.currentTarget);
  };
  const OpenProblemMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setProblem(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setProject(null);
    setProblem(null);
  };
  return (
    <>
      <Box display="flex" justifyContent="flex-end">
        {openSearch && (
          <ButtonStyle variant="contained" onClick={ShowSearch}>
            Search Problem
          </ButtonStyle>
        )}

        <Box marginLeft={2}>
          {!open && (
            <ButtonStyle variant="contained" onClick={toggleCardVisibility}>
              Add New Problem
            </ButtonStyle>
          )}
        </Box>
      </Box>
      {open && (
        <Card sx={{ width: "100%" }} className="outerContainer">
          <CardContent style={{ paddingBottom: 1 }}>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              style={{ color: "#115E6E", fontSize: 18 }}
            >
              Problem Bank Registration
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <SelectVariants value={["Division"]} label="Division" />
              </Grid>
              <Grid item xs={4}>
                <SelectVariants value={["Function"]} label="Function" />
              </Grid>
              <Grid item xs={4}>
                <SelectVariants value={["Department"]} label="Department" />
              </Grid>
              <Grid item xs={4}>
                <SelectVariants
                  value={["Problem Nature"]}
                  label="Problem Nature"
                />
              </Grid>
              <Grid item xs={4}>
                <SelectVariants
                  value={["Point of Problem Identification"]}
                  label="Point of Problem Identification"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  style={{ width: "100%" }}
                  id="standard-basic"
                  label="Problem Notified by(EMP No) W/O Prefix EO"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  style={{ width: "100%" }}
                  id="standard-basic"
                  label="Problem"
                  variant="standard"
                />
              </Grid>
            </Grid>
            <Box display="flex" justifyContent="center" mt={1}>
              <ButtonStyle variant="contained" onClick={toggleCardVisibility}>
                Save
              </ButtonStyle>
            </Box>
          </CardContent>
        </Card>
      )}
      {!openSearch && (
        <Card sx={{ minWidth: 275 }} className="outerContainer">
          <CardContent style={{ paddingBottom: 1 }}>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              style={{ color: "#115E6E", fontSize: 18 }}
            >
              Search Problem
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <SelectVariants value={["Division"]} label="Division" />
              </Grid>
              <Grid item xs={4}>
                <SelectVariants value={["Function"]} label="Function" />
              </Grid>
              <Grid item xs={4}>
                <SelectVariants value={["Department"]} label="Department" />
              </Grid>
              <Grid item xs={4}>
                <SelectVariants
                  value={["Problem Nature"]}
                  label="Problem Nature"
                />
              </Grid>
              <Grid item xs={4}>
                <SelectVariants
                  value={["Point of Problem Identification"]}
                  label="Point of Problem Identification"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  style={{ width: "100%" }}
                  id="standard-basic"
                  label="Problem Notified by(EMP No) W/O Prefix EO"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  style={{ width: "100%" }}
                  id="standard-basic"
                  label="Problem"
                  variant="standard"
                />
              </Grid>
            </Grid>
            <Box display="flex" justifyContent="center" mt={1}>
              <ButtonStyle variant="contained" onClick={ShowSearchData}>
                Search
              </ButtonStyle>
            </Box>
          </CardContent>
        </Card>
      )}
      {openSearchData && (
        <Paper sx={{ overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead style={{ backgroundColor: "#00B0AB" }}>
                <TableRow>
                  <TableCell style={{ ...tableSellStyle }}>ID</TableCell>
                  <TableCell style={{ ...tableSellStyle }}>Division</TableCell>
                  <TableCell style={{ ...tableSellStyle }}>Function</TableCell>
                  <TableCell style={{ ...tableSellStyle }}>
                    Department
                  </TableCell>
                  <TableCell style={{ ...tableSellStyle }}>Problem</TableCell>
                  <TableCell style={{ ...tableSellStyle }}>
                    Problem Nature
                  </TableCell>
                  <TableCell style={{ ...tableSellStyle }}>
                    Point Of Problem
                  </TableCell>
                  <TableCell style={{ ...tableSellStyle }}>
                    Problem Notified by
                  </TableCell>
                  <TableCell style={{ ...tableSellStyle }}>Eligible</TableCell>
                  <TableCell style={{ ...tableSellStyle }}>Status</TableCell>
                  <TableCell style={{ ...tableSellStyle }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell style={tableData} component="th" scope="row">
                    01
                  </TableCell>
                  <TableCell style={tableData}>WTCH-HSR</TableCell>
                  <TableCell style={tableData}>Case_Plant</TableCell>
                  <TableCell style={tableData}>Case_Press_Shop</TableCell>
                  <TableCell style={tableData}>
                    Reduce rejection due to offset problem in round single
                    coined model and shaped model
                  </TableCell>
                  <TableCell style={tableData}>Quality</TableCell>
                  <TableCell style={tableData}>QRM_Meeting</TableCell>
                  <TableCell style={tableData}>339707</TableCell>
                  <TableCell style={tableData}>
                    <SelectVariants value={["Eligible", "NotEligible"]} />
                  </TableCell>
                  <TableCell style={tableData}>
                    <Chip
                      label="Not Eligible"
                      color="secondary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell style={tableData}>
                    {/* <Box display={'flex'}>
                                            <IconButton aria-label="edit" onClick={toggleCardVisibility} >
                                                <EditIcon style={{ color: '#115E6E' }} />
                                            </IconButton>
                                            <IconButton aria-label="delete" color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box> */}
                    <IconButton
                      aria-label="more"
                      id="basic-button"
                      aria-controls={openMenuProblem ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={openMenuProblem ? "true" : undefined}
                      onClick={OpenProblemMenu}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="basic-menu"
                      anchorEl={problem}
                      open={openMenuProblem}
                      onClose={handleClose}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      <MenuItem onClick={toggleCardVisibility}>
                        Edit Problem
                      </MenuItem>
                      <MenuItem>Delete Problem</MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell style={tableData} component="th" scope="row">
                    02
                  </TableCell>
                  <TableCell style={tableData}>WTCH-HSR</TableCell>
                  <TableCell style={tableData}>Movement Plant</TableCell>
                  <TableCell style={tableData}>Movt Heat Treatment</TableCell>
                  <TableCell style={tableData}>
                    Notch crack issue in stator - 9081
                  </TableCell>
                  <TableCell style={tableData}>Quality</TableCell>
                  <TableCell style={tableData}>QRM_Meeting</TableCell>
                  <TableCell style={tableData}>339708</TableCell>
                  <TableCell style={tableData}>
                    <SelectVariants value={["Eligible", "NotEligible"]} />
                  </TableCell>
                  <TableCell style={tableData}>
                    <Chip
                      label="Add SS Project"
                      color="success"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell style={tableData}>
                    {/* <IconButton aria-label="edit" onClick={GotocCharter} >
                                            <AddIcon style={{ color: '#115E6E' }} />
                                        </IconButton> */}
                    <IconButton
                      aria-label="more"
                      id="basic-button"
                      aria-controls={openmenu ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={openmenu ? "true" : undefined}
                      onClick={handleClick}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={openmenu}
                      onClose={handleClose}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      <MenuItem onClick={GotocCharter}>Project</MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell style={tableData} component="th" scope="row">
                    03
                  </TableCell>
                  <TableCell style={tableData}>WTCH-HSR</TableCell>
                  <TableCell style={tableData}>Movement Plant</TableCell>
                  <TableCell style={tableData}>Case_Press_Shop</TableCell>
                  <TableCell style={tableData}>
                    Dent elimination in back cover through auto process
                  </TableCell>
                  <TableCell style={tableData}>Quality</TableCell>
                  <TableCell style={tableData}>QRM_Meeting</TableCell>
                  <TableCell style={tableData}>339709</TableCell>
                  <TableCell style={tableData}>
                    <SelectVariants
                      enabled={true}
                      value={["Eligible", "NotEligible"]}
                    />
                  </TableCell>
                  <TableCell style={tableData}>
                    <Chip
                      label="Edit Charter"
                      color="success"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell style={tableData}>
                    <IconButton
                      aria-label="more"
                      id="basic-button"
                      aria-controls={
                        openMenuAddProject ? "basic-menu" : undefined
                      }
                      aria-haspopup="true"
                      aria-expanded={openMenuAddProject ? "true" : undefined}
                      onClick={OpenProjectMenu}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="basic-menu"
                      anchorEl={project}
                      open={openMenuAddProject}
                      onClose={handleClose}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      <MenuItem onClick={GotoProjectDetails}>
                        Edit Charter
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      { label: "All", value: -1 },
                    ]}
                    colSpan={11}
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: {
                        "aria-label": "rows per page",
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    //   ActionsComponent={}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </>
  );
}

export default ProblemBank;
