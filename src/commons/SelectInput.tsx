import * as React from "react";
import { InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import { select } from "../types/types";

const SelectVariants = (props: select) => {
  const [age, setAge] = React.useState(props.value[0]);
  const [enabled] = React.useState(props.enabled == true ? true : false);

  const handleChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setAge(event.target.value);
  };

  return (
    <FormControl variant="standard" sx={{ minWidth: "100%" }}>
      <InputLabel id="demo-simple-select-standard-label">
        {" "}
        {props.label}
      </InputLabel>
      <Select
        disabled={enabled === true}
        labelId="demo-simple-select-standard-label"
        id="demo-simple-select-standard"
        value={age}
        onChange={handleChange}
        label="Age"
        defaultValue={props.value[0]}
      >
        {props.value.map((inpute_value, inpute_index) => (
          <MenuItem value={inpute_index}>{inpute_value}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectVariants;
