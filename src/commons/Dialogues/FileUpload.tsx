import CloseIcon from '@mui/icons-material/Close';
import { CardContent, CardMedia, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { HttpMultiPartResponseBody, HttpRequestData } from '../../types/httpTypes';
import { ENTITY_NAME, HTTP_METHOD, OPERATION } from '../../types/enums';
import { makeMultiPartHttpCall } from '../../services/ApiService';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function FileUpload(params: { urlExisting: string | undefined, onUpload: (url: string) => void, isOpen: boolean, onClose: () => void }) {
    const [open, setOpen] = React.useState(false);
    const [fullWidth] = React.useState(true);
    const [maxWidth] = React.useState<DialogProps['maxWidth']>('md');
    const [url, setUrl] = React.useState<string | undefined>(params.urlExisting);
    const [selectedFile, setSelectedFile] = React.useState<any>(null);

    const handleClose = () => {
        setOpen(false);
        setUrl(undefined);
        params.onClose();
    };

    const handleFileInputChange = async (event: any) => {
        setSelectedFile(event.target.files[0]);
    };

    const uploadFile = async () => {
        if (selectedFile != null) {
            let requestDataUpdateOne: HttpRequestData<FormData> = {
                entityName: ENTITY_NAME.FILE,
                method: HTTP_METHOD.POST,
                operation: OPERATION.UPLOAD,
                body: new FormData()
            }

            requestDataUpdateOne.body?.append("file", selectedFile);
            const data: HttpMultiPartResponseBody = await makeMultiPartHttpCall(requestDataUpdateOne);
            setUrl(data.url);
            params.onUpload(data.url);
        }

    }

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
                    <CardMedia
                        component="img"
                        height="140"
                        image={url}
                    />
                    <CardContent>
                        <Typography style={{ textAlign: "right" }} >
                            <input
                                id="file-input-1"
                                type="file"
                                accept=".png, .jpg, .jpeg"
                                onChange={handleFileInputChange}
                            />
                            <button style={{ textAlign: 'right', background: '#0d19a5', color: 'white' }} onClick={uploadFile}>Upload</button>
                            {/* <button style={{ marginRight: '10px', textAlign: 'right', background: '#b2002d', color: 'white' }}>Delete</button> */}
                        </Typography>
                    </CardContent>
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