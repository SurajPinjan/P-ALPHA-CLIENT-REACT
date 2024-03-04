import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  styled,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { GridColDef, GridRowModes, GridRowModesModel } from "@mui/x-data-grid";
import { randomId } from "@mui/x-data-grid-generator";
import { useState } from "react";
import { Page } from "../Project";
import React from "react";

interface EditToolbarProps {
  buttonTitle?: string;
  columnList: GridColDef[];
  setClmnVisibility?: React.Dispatch<
    React.SetStateAction<{
      [key: string]: boolean;
    }>
  >;
  tableTitle: string;
  columnMultiField: string;
  setPageState: (newPageState: (oldPageState: Page) => Page) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

export default function EditToolbar(props: EditToolbarProps) {
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

  const [columnVisibility, setColumnVisibility] = useState<{
    [key: string]: boolean;
  }>(() => {
    const initialVisibility: { [key: string]: boolean } = {};
    props.columnList.forEach((column) => {
      initialVisibility[column.field] = true;
    });
    return initialVisibility;
  });

  const handleCheckboxChange = (column: string) => {
    setColumnVisibility((prevState) => ({
      ...prevState,
      [column]: !prevState[column],
    }));
  };

  const {
    setPageState,
    setRowModesModel,
    columnMultiField,
    buttonTitle,
    tableTitle,
  } = props;

  const handleClick = () => {
    const id = randomId();
    // setRows((oldRows) => [...oldRows, { id, isNew: true }]);

    setPageState((old) => ({
      ...old,
      data: [...old.data, { id, [columnMultiField]: [], isNew: true }],
    }));
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  React.useEffect(() => {
    if (props.setClmnVisibility) props.setClmnVisibility(columnVisibility);
  }, [columnVisibility, props]);

  return (
    <>
      <Box sx={{ justifyContent: "space-between", display: "flex" }}>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          style={{
            color: "#115E6E",
            fontSize: 18,
            fontWeight: 600,
            alignSelf: "center",
          }}
        >
          {tableTitle}
        </Typography>
        <FormGroup row>
          {props.columnList.map((item) => (
            <Box key={item.field} sx={{ m: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={columnVisibility[item.field]}
                    onChange={() => handleCheckboxChange(item.field)}
                  />
                }
                label={item.headerName}
              />
            </Box>
          ))}
        </FormGroup>
        {buttonTitle && (
          <ButtonStyle
            variant="contained"
            onClick={handleClick}
            style={{ marginRight: "5px" }}
          >
            {buttonTitle}
          </ButtonStyle>
        )}
      </Box>
    </>
  );
}
