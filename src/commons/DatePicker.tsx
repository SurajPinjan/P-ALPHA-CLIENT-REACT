import { GridRenderEditCellParams } from "@mui/x-data-grid";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const BasicDatePicker: React.FC<GridRenderEditCellParams> = (params) => {

  const { row, value, api, field, label } = params;

  const handleChange = (newValue: Date | null) => {
    // api.setEditCellValue({ id, field, value: newValue });
    api.setEditCellValue({
      id: row.id,
      field,
      value: newValue,
    }, {
      unstable_skipValidation: true,
    });
  };


  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        value={value}
        onChange={handleChange}
        maxDate={new Date()}
        label={label}
        slotProps={{ textField: { variant: "standard" } }}
      />
    </LocalizationProvider>
  );
};


export default BasicDatePicker;
