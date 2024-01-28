import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { date } from '../types/types';


export default function BasicDatePicker(props: date) {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker label={props.label} sx={{ width: "100%" }}
        slotProps={{ textField: { variant: 'standard', } }} />
    </LocalizationProvider>
  );
}