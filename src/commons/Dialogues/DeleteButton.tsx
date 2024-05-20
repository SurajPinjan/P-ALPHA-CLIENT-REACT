import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from "@mui/icons-material/Delete";
import * as React from 'react';

//  function DeleteButton() {

interface DeleteButtonProps {
  onClick: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = (props) => {
  const radioGroupRef = React.useRef<HTMLElement>(null);
  const [open, setOpen] = React.useState(false);
  // hooks


  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleOk = () => {
    props.onClick();
    setOpen(false);
  };

  const handleDeleteClick = () => {
    setOpen(true);
  };

  return (
    <>
      <GridActionsCellItem
        icon={<DeleteIcon />}
        label="Delete"
        onClick={handleDeleteClick}
        color="inherit"
      />
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
        maxWidth="xs"
        TransitionProps={{ onEntering: handleEntering }}
        open={open}
      >
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent dividers>
          ARE YOU SURE YOU WANT TO DELETE?
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleOk}>Ok</Button>
        </DialogActions>
      </Dialog>
    </>

  );
}

export default DeleteButton;