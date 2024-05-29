import { Grid, Paper, Table, TableBody, TableContainer, TableRow } from "@mui/material";
import React from "react";
import { SubTableCell, SubTableCellStyled, TableHeadStyled } from "./Project/ProjectStages/Define";
import { BLANK } from "../types/enums";

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
    BLANK
  ),
  resourceData(
    2,
    "K. Nanthakumar",
    34234,
    "Movement_Plan",
    "-",
    "Member",
    BLANK
  ),
  resourceData(3, "A.S. Sambasivan", 42353, "Quality", "BB", "Member", BLANK),
];

function GridTable() {

  // Template
  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={1}>
          <Paper style={{
            display: `flex`,
            justifyContent: `center`,
            padding: `0.5rem`
          }}>
            <img src="https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Logo_of_Titan_Company%2C_May_2018.svg/640px-Logo_of_Titan_Company%2C_May_2018.svg.png" alt="Image 1" height="40"></img>
          </Paper>
        </Grid>
        <Grid item xs={11}>
          <span style={{
            display: `flex`,
            justifyContent: `center`,
            backgroundColor: `black`,
            padding: `0.1rem`,
            color: `white`
          }}>Six Sigma</span>
          <Grid container>
            <Grid item xs={6}>
              <span style={{
                display: `flex`,
                justifyContent: `center`,
                backgroundColor: `green`,
                padding: `0.1rem`,
                color: `white`
              }}>Six Sigma</span>
            </Grid>
            <Grid item xs={6}>
              <span style={{
                display: `flex`,
                justifyContent: `center`,
                backgroundColor: `cyan`,
                padding: `0.1rem`,
                color: `black`
              }}>Six Sigma</span>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ width: "100%" }}>
            <Table stickyHeader aria-label="simple table">
              <TableBody>
                <React.Fragment key={'id'}>
                  <TableRow key={'name'} sx={{ width: '100%' }}>
                    <SubTableCellStyled component="th" scope="row" sx={{ background: "#00B0AB" }}>
                      {'id'}
                    </SubTableCellStyled>
                    <SubTableCellStyled component="th" scope="row">
                      {'name'}
                    </SubTableCellStyled>
                    <SubTableCellStyled sx={{ background: "#00B0AB" }}>{'calories'}</SubTableCellStyled>
                    <SubTableCellStyled>{'fat'}</SubTableCellStyled>
                    <SubTableCellStyled sx={{ background: "#00B0AB" }}>{'carbs'}</SubTableCellStyled>
                    <SubTableCellStyled>{'protein'}</SubTableCellStyled>
                    <SubTableCellStyled sx={{ background: "#00B0AB" }}>{'calories'}</SubTableCellStyled>
                    <SubTableCellStyled>{'fat'}</SubTableCellStyled>
                    <SubTableCellStyled sx={{ background: "#00B0AB" }}>{'calories'}</SubTableCellStyled>
                    <SubTableCellStyled>{'fat'}</SubTableCellStyled>
                  </TableRow>
                  <TableRow key={'name'}>
                    <SubTableCellStyled component="th" scope="row" sx={{ background: "#00B0AB" }}>
                      {'id'}
                    </SubTableCellStyled>
                    <SubTableCellStyled component="th" scope="row">
                      {'name'}
                    </SubTableCellStyled>
                    <SubTableCellStyled sx={{ background: "#00B0AB" }}>{'calories'}</SubTableCellStyled>
                    <SubTableCellStyled>{'fat'}</SubTableCellStyled>
                    <SubTableCellStyled sx={{ background: "#00B0AB" }}>{'calories'}</SubTableCellStyled>
                    <SubTableCellStyled>{'fat'}</SubTableCellStyled>
                    <SubTableCellStyled sx={{ background: "#00B0AB" }}>{'carbs'}</SubTableCellStyled>
                    <SubTableCellStyled>{'protein'}</SubTableCellStyled>
                    <SubTableCellStyled sx={{ background: "#00B0AB" }}>{'calories'}</SubTableCellStyled>
                    <SubTableCellStyled>{'fat'}</SubTableCellStyled>
                  </TableRow>
                </React.Fragment>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        {/* row 1 */}
        <Grid item xs={6}>
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

                </TableRow>
              </TableHeadStyled>
              <TableBody>
                {
                  tableRows.map((row) => {
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
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={6}>
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

                </TableRow>
              </TableHeadStyled>
              <TableBody>
                {
                  tableRows.map((row) => {
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

                        </TableRow>
                      </React.Fragment>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        {/* row 2 */}
        <Grid item xs={4}>
          <TableContainer component={Paper} sx={{ width: "100%" }}>
            <Table stickyHeader aria-label="simple table">
              <TableHeadStyled>
                <TableRow>
                  <SubTableCell style={{ fontWeight: "bold" }}>ID</SubTableCell>
                  <SubTableCell style={{ fontWeight: "bold" }}>Name</SubTableCell>


                </TableRow>
              </TableHeadStyled>
              <TableBody>
                {
                  tableRows.map((row) => {
                    return (
                      <React.Fragment key={row.id}>
                        <TableRow key={row.name}>
                          <SubTableCellStyled component="th" scope="row">
                            {row.id}
                          </SubTableCellStyled>
                          <SubTableCellStyled component="th" scope="row">
                            {row.name}
                          </SubTableCellStyled>

                        </TableRow>
                      </React.Fragment>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={8}>
          <TableContainer component={Paper} sx={{ width: "100%" }}>
            <Table stickyHeader aria-label="simple table">
              <TableHeadStyled>
                <TableRow>
                  <SubTableCell style={{ fontWeight: "bold" }}>ID</SubTableCell>
                  <SubTableCell style={{ fontWeight: "bold" }}>Name</SubTableCell>


                </TableRow>
              </TableHeadStyled>
              <TableBody>
                {
                  tableRows.map((row) => {
                    return (
                      <React.Fragment key={row.id}>
                        <TableRow key={row.name}>
                          <SubTableCellStyled component="th" scope="row">
                            {row.id}
                          </SubTableCellStyled>
                          <SubTableCellStyled component="th" scope="row">
                            {row.name}
                          </SubTableCellStyled>

                        </TableRow>
                      </React.Fragment>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>

        </Grid>

      </Grid>
    </>);
}

export default GridTable;
