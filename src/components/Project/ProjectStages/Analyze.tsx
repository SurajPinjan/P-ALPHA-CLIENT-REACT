import { Card, CardContent } from "@mui/material";

import {
  GridColDef,
  GridRowsProp,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { TabType, TableType } from "../../../types/types";
import FullFeaturedCrudGrid from "./AuditTable";
import { BLANK } from "../../../types/enums";

const discountOptions = [
  "Pareto",
  "P Chart",
  "Process Audit",
  "Startification",
  "Brainstorming",
  "ISO Plot",
  "AAA",
  "Process Mapping",
  "Concentration Chart",
];

// function CustomEditComponent(props: any) {
//   const { id, value, field } = props;
//   const apiRef = useGridApiContext();

//   const handleChange = (event: SelectChangeEvent<string>) => {
//     const eventValue = event.target.value; // The new value entered by the user
//     const newValue =
//       typeof eventValue === "string" ? value.split(",") : eventValue;
//     apiRef.current.setEditCellValue({
//       id,
//       field,
//       value: newValue.filter((x: string) => x !== BLANK),
//     });
//   };

//   return (
//     <Select
//       labelId="demo-multiple-name-label"
//       id="demo-multiple-name"
//       multiple
//       value={value}
//       onChange={handleChange}
//       sx={{ width: "100%" }}
//     >
//       {discountOptions.map((option) => (
//         <MenuItem key={option} value={option}>
//           {option}
//         </MenuItem>
//       ))}
//     </Select>
//   );
// }

// const CustomDiscountEditCell = (params: any) => (
//   <CustomEditComponent {...params} />
// );

// function CustomFilterInputSingleSelect(props: any) {
//   const { item, applyValue, type, focusElementRef } = props;

//   return (
//     <TextField
//       id={`contains-input-${item.id}`}
//       value={item.value}
//       onChange={(event) => applyValue({ ...item, value: event.target.value })}
//       type={type || "text"}
//       variant="standard"
//       InputLabelProps={{
//         shrink: true,
//       }}
//       inputRef={focusElementRef}
//       select
//       SelectProps={{
//         native: true,
//       }}
//     >
//       {[BLANK, ...discountOptions].map((option) => (
//         <option key={option} value={option}>
//           {option}
//         </option>
//       ))}
//     </TextField>
//   );
// }

function Analyze() {
  const initialRowsString = localStorage.getItem("ssv");
  const initialRows: GridRowsProp = JSON.parse(
    initialRowsString !== null ? initialRowsString : JSON.stringify([])
  );

  for (const row of initialRows) {
    row.toolused = [];
  }

  // for (let index = 0; index < initialRows.length; index++) {
  //   initialRows[index].toolsused = [];
  // }

  const columnsDetails: GridColDef[] = [
    {
      field: "ssv",
      headerName: "SSV's",
      width: 220,
      editable: false,
    },
    {
      field: "designvalidation",
      headerName: "Design/Validation",
      width: 180,
      editable: false,
      type: "singleSelect",
      valueOptions: ["Design", "Validation"],
    },
    {
      field: "variableattribute",
      headerName: "Variable/Attribute",
      width: 220,
      editable: false,
      type: "singleSelect",
      valueOptions: ["Variable", "Attribute"],
    },
    {
      field: "toolsused",
      headerName: "Tools Used",
      type: "singleSelect",
      width: 240,
      editable: true,
      valueOptions: discountOptions,
      valueFormatter: ({ value }: GridValueFormatterParams) =>
        value ? value.join("/") : BLANK,
      // renderEditCell: CustomDiscountEditCell,
      filterOperators: [
        {
          value: "contains",
          getApplyFilterFn: (filterItem: unknown) => {
            if (
              typeof filterItem === "object" &&
              filterItem !== null &&
              "value" in filterItem &&
              (filterItem.value == null || filterItem.value === BLANK)
            ) {
              return null;
            } else {
              return null;
            }
            // return ({ value }: unknown) => {
            //   return value.some(
            //     (cellValue: unknown) => cellValue === filterItem.value
            //   );
            // };
          },
          // InputComponent: CustomFilterInputSingleSelect,
        },
      ],
    },
    {
      field: "causes",
      headerName: "Causes",
      width: 140,
      editable: true,
      type: "singleSelect",
      valueOptions: ["Confirmed", "Not Confirmed"],
    },
  ];

  return (
    <>
      <Card className="outerContainer">
        <CardContent style={{ paddingBottom: 0 }}>
          <FullFeaturedCrudGrid
            isClicked={null}
            hasAttachment
            tableTitle="Suspected Sources Of Variation"
            initialColumns={columnsDetails}
            initialRows={initialRows}
            data={TableType.Audit}
            tab={TabType.Process}
          ></FullFeaturedCrudGrid>
        </CardContent>
      </Card>
    </>
  );
}

export default Analyze;
