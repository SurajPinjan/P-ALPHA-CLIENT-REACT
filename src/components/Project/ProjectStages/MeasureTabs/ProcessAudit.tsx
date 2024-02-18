import { Card, CardContent } from "@mui/material";
import Box from "@mui/material/Box";

import { GridRowsProp } from "@mui/x-data-grid";
import { randomCreatedDate, randomId } from "@mui/x-data-grid-generator";
import React from "react";
import FullFeaturedCrudGrid from "../AuditTable";
import { columns, randomMachine, randomRole } from "./CommonFunctions";

// import AddIcon from '@mui/icons-material/Add';
import { GridColDef } from "@mui/x-data-grid";
import { TabType, TableType } from "../../../../types/types";

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

function ProcessAudit() {
  const [isClicked, setIsClicked] = React.useState<string | null>(null);
  const [isUpdate, setIsUpdate] = React.useState<boolean>(true);
  const [initialRowsProcessDetails, setInitialRowsProcessDetails] =
    React.useState<GridRowsProp>([]);

  const columnsDetails: GridColDef[] = [
    {
      field: "processparam",
      headerName: "Process Perticulars",
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

  const onSelect = (subData: GridRowsProp) => {
    setIsUpdate(false);
    setInitialRowsProcessDetails(subData);
    setIsClicked(`0`);
    setIsUpdate(true);
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
              isClicked={null}
            ></FullFeaturedCrudGrid>
            {isUpdate && (
              <FullFeaturedCrudGrid
                hasAttachment={false}
                tableTitle="Audit Findings"
                initialColumns={columnsDetails}
                initialRows={initialRowsProcessDetails}
                data={TableType.Detail}
                tab={TabType.Process}
                buttonTitle="Add Finding"
                isClicked={isClicked}
              ></FullFeaturedCrudGrid>
            )}
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
export default ProcessAudit;
