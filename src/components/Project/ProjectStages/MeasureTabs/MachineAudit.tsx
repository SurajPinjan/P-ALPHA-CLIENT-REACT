import { Card, CardContent } from "@mui/material";
import Box from "@mui/material/Box";

import { GridRowsProp } from "@mui/x-data-grid";
import { randomCreatedDate, randomId } from "@mui/x-data-grid-generator";
import React from "react";
import FullFeaturedCrudGrid from "../AuditTable";
import { TabType, TableType } from "../MeasureBak";
import { columns, randomMachine, randomRole } from "./CommonFunctions";

// import AddIcon from '@mui/icons-material/Add';
import { GridColDef } from "@mui/x-data-grid";

const initialRows: GridRowsProp = [
  {
    id: randomId(),
    name: "Kishor Bhalerao",
    age: 25,
    joinDate: randomCreatedDate(),
    role: randomRole(),
    machine: randomMachine(),
    subData: [
      {
        id: randomId(),
        processparam: "Temprature distribution at each zone inside assembly",
        standard: "Uniform Distribution 24 +/- 2 Degree C",
        observed: "23 Degree C",
        conclusion: "Ok",
        correction: "Nil",
      },
    ],
  },
  {
    id: randomId(),
    name: "Manoj",
    age: 36,
    joinDate: randomCreatedDate(),
    role: randomRole(),
    machine: randomMachine(),
    subData: [
      {
        id: randomId(),
        processparam: "Temprature distribution at each zone inside assembly",
        standard: "Uniform Distribution 24 +/- 2 Degree C",
        observed: "23 Degree C",
        conclusion: "Ok",
        correction: "Nil",
      },
      {
        id: randomId(),
        processparam: "Stress at each zone inside assembly",
        standard: "Uniform Distribution 24 +/- 2  CMM",
        observed: "23 CMM",
        conclusion: "Ok",
        correction: "Nil",
      },
      {
        id: randomId(),
        processparam: "Stress at each zone inside assembly",
        standard: "Uniform Distribution 24 +/- 2  CMM",
        observed: "23 CMM",
        conclusion: "Ok",
        correction: "Nil",
      },
    ],
  },
  {
    id: randomId(),
    name: "Ram Deshpande",
    age: 19,
    joinDate: randomCreatedDate(),
    role: randomRole(),
    machine: randomMachine(),
    subData: [
      {
        id: randomId(),
        processparam: "Component Eblama coating condition",
        standard: "Oil",
        observed: "Coating condition normal",
        conclusion: "Ok",
        correction: "Nil",
      },
    ],
  },
  {
    id: randomId(),
    name: "Suraj Pinjan",
    age: 28,
    joinDate: randomCreatedDate(),
    role: randomRole(),
    machine: randomMachine(),
    subData: [],
  },
  {
    id: randomId(),
    name: "Abhishek Talekar",
    age: 23,
    joinDate: randomCreatedDate(),
    role: randomRole(),
    machine: randomMachine(),
    subData: [
      {
        id: randomId(),
        processparam: "How wheel pick and place unit motion",
        standard: "80mm/sec + 2",
        observed: "85.5mm/sec",
        conclusion: "Ok",
        correction: "Nil",
      },
      {
        id: randomId(),
        processparam: "Component Eblama coating condition",
        standard: "Oil",
        observed: "Coating condition normal",
        conclusion: "Ok",
        correction: "Nil",
      },
    ],
  },
];

// textarea

function MachineAudit() {
  const [isClicked, setIsClicked] = React.useState<string | null>(null);

  const columnsDetails: GridColDef[] = [
    {
      field: "processparam",
      headerName: "Machine / Tool condition",
      width: 270,
      editable: true,
    },
    {
      field: "standard",
      headerName: "Standard",
      width: 180,
      editable: true,
    },
    {
      field: "observed",
      headerName: "Observed",
      width: 180,
      editable: true,
    },
    {
      field: "conclusion",
      headerName: "Conclusion",
      width: 150,
      editable: true,
      type: "singleSelect",
      valueOptions: ["Ok", "Not Ok"],
    },
    {
      field: "correction",
      headerName: "Correction Taken",
      width: 180,
      editable: true,
    },
  ];

  const [initialRowsProcessDetails, setInitialRowsProcessDetails] =
    React.useState<GridRowsProp>([]);

  const onSelect = (subData: GridRowsProp) => {
    setInitialRowsProcessDetails(subData);
    setIsClicked(`0`);
  };

  return (
    <>
      <Box>
        <Card>
          <CardContent style={{ padding: "0" }}>
            <FullFeaturedCrudGrid
              hasAttachment={false}
              tableTitle="Audit"
              buttonTitle="Add Audit"
              initialColumns={columns}
              initialRows={initialRows}
              data={TableType.Audit}
              tab={TabType.Process}
              onSelect={onSelect}
            ></FullFeaturedCrudGrid>
            <FullFeaturedCrudGrid
              hasAttachment={false}
              tableTitle="Audit Findings"
              initialColumns={columnsDetails}
              initialRows={initialRowsProcessDetails}
              data={TableType.Detail}
              tab={TabType.Machine}
              buttonTitle="Add Finding"
              isClicked={isClicked}
            ></FullFeaturedCrudGrid>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
export default MachineAudit;
