import { Box, Button, Card, CardContent, Grid, styled } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useState } from "react";

import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { randomCreatedDate, randomId } from "@mui/x-data-grid-generator";
import FullFeaturedCrudGrid from "./AuditTable";
import { TabType, TableType } from "../../../types/types";

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
  width: "1000px",
  textAlign: "left",
  // marginTop:'2rem',
});

// const tableRows = [
//     resourceData(1, '19/07/23', 'Notch Width Allocation', 'In-Progress', 'R.Jeeva', 'To valildate the notch.. ', '-', '28/07/23', '-', ''),

// ];

const tableRows: GridRowsProp = [
  {
    id: randomId(),
    reviewdate: randomCreatedDate(),
    actionpoints: "Notch Width Allocation",
    status: "Inprogress",
    responsibility: "R.Jeeva",
    targetdate: randomCreatedDate(),
    completiondate: randomCreatedDate(),
    reasonforaction: "To valildate the notch.",
    finding: "-",
  },
  {
    id: randomId(),
    reviewdate: randomCreatedDate(),
    actionpoints: "Notch Height Allocation",
    status: "Done",
    responsibility: "Sanjeevani",
    targetdate: randomCreatedDate(),
    completiondate: randomCreatedDate(),
    reasonforaction: "To valildate the notch height",
    finding: "-",
  },
  {
    id: randomId(),
    reviewdate: randomCreatedDate(),
    actionpoints: "Notch Strength",
    status: "Done",
    responsibility: "Sanjeevani",
    targetdate: randomCreatedDate(),
    completiondate: randomCreatedDate(),
    reasonforaction: "To valildate the notch strength",
    finding: "-",
  },
];

function ProjectReview() {
  // const [openSearch, setOpenSearch] = useState(false);
  // const openMenuProblem = Boolean(problem);
  // const toggleCardVisibility = () => {
  //     setOpen(!open);
  //     setOpenSearch(true);
  // };

  const columnsDetails: GridColDef[] = [
    {
      field: "reviewdate",
      headerName: "Review Date",
      width: 150,
      type: "date",
      editable: true,
    },
    {
      field: "actionpoints",
      headerName: "Action Points",
      width: 220,
      editable: true,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      editable: true,
      type: "singleSelect",
      valueOptions: ["Done", "Inprogress"],
    },
    {
      field: "responsibility",
      headerName: "Responsibility",
      width: 120,
      editable: true,
    },
    {
      field: "targetdate",
      headerName: "Target Date",
      width: 180,
      type: "date",
      editable: true,
    },
    {
      field: "completiondate",
      headerName: "Completion Date",
      width: 180,
      type: "date",
      editable: true,
    },
    {
      field: "reasonforaction",
      headerName: "Reason For Action",
      width: 220,
      editable: true,
    },
    {
      field: "finding",
      headerName: "Finding",
      width: 120,
      editable: true,
    },
  ];

  const [showCard, setShowCard] = useState(false);

  const handleAdd = () => {
    setShowCard(true);
  };
  const handleClose = () => {
    setShowCard(false); // This will close the window
  };

  return (
    <>
      <Box marginTop={2}>
        <Card>
          <CardContent>
            <Box
              sx={{
                height: "auto",
                width: "100%",
                marginLeft: "-20px",
                "& .actions": {
                  color: "text.secondary",
                },
                "& .textPrimary": {
                  color: "text.primary",
                },
              }}
            >
              <GridStyled item xs={12} sm={6} style={{ width: "100%" }}>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  style={{ textAlign: "right" }}
                  marginTop={0}
                >
                  <ButtonStyle variant="contained" onClick={handleAdd}>
                    View
                  </ButtonStyle>
                </Grid>
                <div>
                  {showCard && (
                    <BarChart
                      xAxis={[
                        {
                          scaleType: "band",
                          data: [
                            "Completed",
                            "In-Progress",
                            "Deffered",
                            "For-Info",
                          ],
                        },
                      ]}
                      series={[{ data: [1, 2, 1, 0] }]}
                      width={400}
                      height={300}
                    />
                  )}
                  {showCard && (
                    <Grid
                      item
                      xs={3}
                      style={{ textAlign: "right", marginTop: "2rem" }}
                    >
                      <ButtonStyle variant="contained" onClick={handleClose}>
                        Cancel
                      </ButtonStyle>
                    </Grid>
                  )}
                </div>
              </GridStyled>
            </Box>
            <FullFeaturedCrudGrid
              isClicked={null}
              hasAttachment={false}
              tableTitle=""
              buttonTitle="Add Review"
              initialColumns={columnsDetails}
              initialRows={tableRows}
              data={TableType.Audit}
              tab={TabType.Process}
            ></FullFeaturedCrudGrid>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

export default ProjectReview;
