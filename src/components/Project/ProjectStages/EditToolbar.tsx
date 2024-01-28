import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Typography, styled } from '@mui/material';
import {
  GridRowModes,
  GridRowModesModel,
  GridRowsProp
} from '@mui/x-data-grid';
import {
  randomId
} from '@mui/x-data-grid-generator';

interface EditToolbarProps {
  buttonTitle?: string; tableTitle: string;

  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

export default function EditToolbar(props: EditToolbarProps) {
  const ButtonStyle = styled(Button)`
      background-color:#005f71;
      color: #fff;
      border: none;
      margin-bottom: 10px;
      font-size: 14px;
      text-transform: capitalize;
  
      &:hover {
          background-color:#115E6E;
      }
  `;
  const { setRows, setRowModesModel, buttonTitle, tableTitle } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [...oldRows, { id, isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <>

      <Box sx={{ justifyContent: 'space-between', display: 'flex' }}>
        <Typography gutterBottom variant="h5" component="div" style={{ color: '#115E6E', fontSize: 18, fontWeight: 600, alignSelf: 'center' }}>
          {tableTitle}
        </Typography>

        {buttonTitle && <ButtonStyle variant="contained" onClick={handleClick} style={{ marginRight: '5px' }}>
          {buttonTitle}
        </ButtonStyle>}

      </Box>

    </>

  );
}