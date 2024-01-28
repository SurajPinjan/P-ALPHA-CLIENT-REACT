import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FormProps } from '../../types/types';
import { Grid, TextField } from '@mui/material';
import SelectVariants from '../../commons/SelectInput';


function ProblemBankForm(params: FormProps) {
  const handleClose = () => {
    params.setOpen(false);
  };


  return (
    <div>
      <Dialog open={params.open} onClose={handleClose} >
        <DialogTitle>Problem Bank Registration</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} style={{ width: 580 }}>
            <Grid item xs={6}>
              <SelectVariants value={['']} label='de' />

            </Grid>
            <Grid item xs={6}>
              <SelectVariants value={['']} label='Function' />
            </Grid>
            <Grid item xs={6}>
              <SelectVariants value={['']} label='Department' />

            </Grid>
            <Grid item xs={6}>
              <SelectVariants value={['']} label='Problem Nature' />
            </Grid>
            <Grid item xs={6}>
              <SelectVariants value={['']} label='Point of Problem Identification' />
            </Grid>
            <Grid item xs={6}>
              <TextField style={{ width: '100%' }} id="standard-basic" label="Problem Notified by(EMP No) W/O Prefix EO" variant="standard" />
            </Grid>
            <Grid item xs={12}>
              <TextField style={{ width: '100%' }} id="standard-basic" label="Problem" variant="standard" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


export default ProblemBankForm