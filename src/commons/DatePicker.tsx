import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateProps } from "../types/types";

export default function BasicDatePicker(props: DateProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={props.label}
        value={props.value}
        sx={{ width: "100%" }}
        onChange={props.onChange}
        slotProps={{ textField: { variant: "standard" } }}
      />
    </LocalizationProvider>
  );
}
