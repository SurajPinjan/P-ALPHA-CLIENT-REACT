import Box from '@mui/material/Box';
import { GridRenderEditCellParams } from '@mui/x-data-grid';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import * as React from 'react';

const EditMonthYearCell: React.FC<GridRenderEditCellParams> = (props) => {
    const { row, value, field, api } = props;

    const handleMonthChange = (newMonth: Date | null) => {
        api.setEditCellValue({
            id: row.id,
            field,
            value: newMonth,
        }, {
            unstable_skipValidation: true,
        });
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ position: 'relative' }}>
                <DatePicker
                    value={value}
                    onChange={handleMonthChange}
                    views={['year', 'month']}
                    view="month"
                />
            </Box>
        </LocalizationProvider>
    );
};

export default EditMonthYearCell;
