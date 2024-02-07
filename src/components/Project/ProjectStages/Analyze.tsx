import { Card, CardContent, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";

import { GridColDef, GridRowsProp, GridValueFormatterParams, useGridApiContext } from "@mui/x-data-grid";
import FullFeaturedCrudGrid from "./AuditTable";
import { TabType, TableType } from "./MeasureBak";

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

function CustomEditComponent(props: {
  id: string;
  value: string;
  field: string;
}) {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();

  const handleChange = (event: SelectChangeEvent<string>) => {
    const eventValue = event.target.value; // The new value entered by the user
    const newValue =
      typeof eventValue === "string" ? value.split(",") : eventValue;
    apiRef.current.setEditCellValue({
      id,
      field,
      value: newValue.filter((x: string) => x !== ""),
    });
  };

  return (
    <Select
      labelId="demo-multiple-name-label"
      id="demo-multiple-name"
      multiple
      value={value}
      onChange={handleChange}
      sx={{ width: "100%" }}
    >
      {discountOptions.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  );
}
const CustomDiscountEditCell = (params: any) => (
  <CustomEditComponent {...params} />
);

function CustomFilterInputSingleSelect(props: any) {
  const { item, applyValue, type, focusElementRef } = props;

  return (
    <TextField
      id={`contains-input-${item.id}`}
      value={item.value}
      onChange={(event) => applyValue({ ...item, value: event.target.value })}
      type={type || "text"}
      variant="standard"
      InputLabelProps={{
        shrink: true,
      }}
      inputRef={focusElementRef}
      select
      SelectProps={{
        native: true,
      }}
    >
      {["", ...discountOptions].map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </TextField>
  );
}

function Analyze() {
  const initialRowsString = localStorage.getItem("ssv");
  const initialRows: GridRowsProp = JSON.parse(
    initialRowsString !== null ? initialRowsString : JSON.stringify([])
  );

  for (let index = 0; index < initialRows.length; index++) {
    initialRows[index].toolsused = [];
  }

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
      valueFormatter: ({ value }: GridValueFormatterParams) => (value ? value.join("/") : ""),
      renderEditCell: CustomDiscountEditCell,
      filterOperators: [
        {
          value: "contains",
          getApplyFilterFn: (filterItem: any) => {
            if (filterItem.value == null || filterItem.value === "") {
              return null;
            }
            return ({ value }: any) => {
              return value.some(
                (cellValue: any) => cellValue === filterItem.value
              );
            };
          },
          InputComponent: CustomFilterInputSingleSelect,
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
          {/* <Grid container>
                        <Grid item xs={12} sm={12} style={{ textAlign: "center" }}>
                            <div>
                                {file && (
                                    file.type.startsWith('image/') ? (
                                        <img src={URL.createObjectURL(file)} alt="Selected Image" style={{ width: '300px', height: '200px' }} />
                                    ) : (
                                        <iframe src={URL.createObjectURL(file)} title="Selected File" width="100%" height="200px"></iframe>
                                    )
                                )}
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12} style={{ textAlign: "right" }}>
                            <input
                                style={{ display: 'none' }}
                                id="file-input-1"
                                type="file"
                                accept=".pdf, .doc, .docx"
                                onChange={onFileChange}
                            />
                            <ButtonStyle style={{ marginLeft: 5 }} variant="contained">Save</ButtonStyle>
                            <label htmlFor="file-input-1">
                                <ButtonStyle variant="contained" color="inherit"> Click here to upload</ButtonStyle>
                            </label>
                        </Grid>
                    </Grid> */}
        </CardContent>
      </Card>
    </>
  );
}

export default Analyze;
