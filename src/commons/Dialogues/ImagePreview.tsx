import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import image2 from '../../assets/images/blue_print-2.jpg';
import { Grid } from '@mui/material';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function ImagePreview(params: { url: string | undefined, isOpen: boolean, compare?: boolean, onClose: () => void }) {
    const [open, setOpen] = React.useState(false);
    const [compare] = React.useState(params.compare);
    const [fullWidth] = React.useState(true);
    const [imageUrl] = React.useState<string | undefined>(params.url);
    const [maxWidth] = React.useState<DialogProps['maxWidth']>('md');
    const handleClose = () => {
        setOpen(false);
        params.onClose();
    };

    React.useEffect(() => {
        if (params.isOpen)
            setOpen(true);
    }, [params.isOpen]);

    return (
        <React.Fragment>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth={fullWidth}
                maxWidth={maxWidth}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Preview
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={compare ? 6 : 12}>
                            <Typography gutterBottom>
                                <img src={imageUrl} style={{ width: compare ? 400 : (400 * 2.1652) }}></img>
                            </Typography>
                        </Grid>
                        {compare && <Grid item xs={6}>
                            <Typography gutterBottom>
                                <img src={image2} style={{ width: 400 }}></img>
                            </Typography>
                        </Grid>}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Close
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </React.Fragment>
    );
}