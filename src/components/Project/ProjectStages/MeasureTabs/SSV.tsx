
import CancelIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridEventListener,
    GridRowEditStopReasons,
    GridRowId,
    GridRowModel,
    GridRowModes,
    GridRowModesModel,
    GridRowsProp,
} from '@mui/x-data-grid';
import {
    randomArrayItem,
    randomId,
} from '@mui/x-data-grid-generator';
import * as React from 'react';
import styled from 'styled-components';

const roles = ['Variable', 'Attribute'];

const randomRole = () => {
    return randomArrayItem(roles);
};

const design = ['Design', 'Variation'];
const randomdesign = () => {
    return randomArrayItem(design);
};

const initialRows: GridRowsProp = [
    {
        id: randomId(),
        name: 'Assembly Process',
        design: randomdesign(),
        role: randomRole(),
    },
    {
        id: randomId(),
        name: 'Day star Hole Diameter',
        design: randomdesign(),
        role: randomRole(),
    },
    {
        id: randomId(),
        name: 'Day star Recess Depth',
        design: randomdesign(),
        role: randomRole(),
    },
    {
        id: randomId(),
        name: 'Day star Bearing Diameter',
        design: randomdesign(),
        role: randomRole(),
    },
];

interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
}


function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel } = props;

    const ButtonStyle = styled(Button)`
          background-color:#115E6E !important;
          color: #fff;
          border: none;
          margin-bottom: 10px !important;
          font-size: 14px;
          text-transform: capitalize !important;
          
          &:hover {
              background-color:#115E6E;
          }
          `;
    const handleClick = () => {
        const id = randomId();
        setRows((oldRows) => [...oldRows, { id, name: '', age: '', isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        }));
    };

    return (
        <Box sx={{ justifyContent: 'end', display: 'flex' }}>
            <ButtonStyle variant="contained" onClick={handleClick} style={{ marginRight: '5px' }}>
                Add SSV
            </ButtonStyle>
        </Box>
    );
}

export default function SSV() {
    const [rows, setRows] = React.useState(initialRows);
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } }); 
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow: GridRowModel) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns: GridColDef[] = React.useMemo(
        () =>[
        { field: 'name', headerName: "Suspected Sources of Variation (SSV's)", width: 350, editable: true },
        {
            field: 'design',
            headerName: 'Design/Variation',
            width: 220,
            editable: true,
            type: 'singleSelect',
            valueOptions: ['Design', 'Variation'],
        },
        {
            field: 'role',
            headerName: 'Variable/Attribute	',
            width: 220,
            editable: true,
            type: 'singleSelect',
            valueOptions: ['Variable', 'Attribute'],
        },

        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ], [handleSaveClick, handleDeleteClick, handleEditClick, handleCancelClick]);

    return (
        <Box
            sx={{
                width: '100%',
                '& .actions': {
                    color: 'text.secondary',
                },
                '& .textPrimary': {
                    color: 'text.primary',
                },
            }}
        >
            <DataGrid sx={{ border: 'none' }}
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slots={{
                    toolbar: EditToolbar,
                }}
                slotProps={{
                    toolbar: { setRows, setRowModesModel },
                }}
            />
        </Box>
    );
}