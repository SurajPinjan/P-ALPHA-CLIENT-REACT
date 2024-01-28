import { Box, Card, CardContent, Grid, TableFooter, TablePagination, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import '../../App.css';
import SelectVariants from '../../commons/SelectInput';

interface ProjectModel {
    name: string, calories: number, fat: number, carbs: number, protein: number, status: string
}

interface TableDataModel {
    to: string,
    problemBankId: string,
    bucket: string,
    category: string,
    division: string,
    function: string,
    department: string,
    projectSKU: string,
    estSaving: string,
}

interface TableModel {
    headers: string[],
    data: TableDataModel[]
}

interface SelectVariantData {
    label: string,
    value: string[]
}

const ButtonStyle = styled(Button)`
    background-color: #115E6E !important;
    color: white;
    border: none;
    margin-bottom: 10px !important;
    font-size: 14px !important;
    text-transform: capitalize !important;

    &:hover {
        background-color:#115E6E;
    }
`

const tableSellStyle = {
    paddingTop: 7,
    paddingBottom: 7,
    color: '#ffffff',
    fontSize: '14px',
    fontWight: '600',
};

const tableData = {
    paddingTop: 7,
    paddingBottom: 7,
}


function Admin() {

    // component state
    const [open, setOpen] = useState(false);
    const [openSearch, setOpenSearch] = useState(false);
    const [openSearchData, setOpenSearchData] = useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    // non state data

    const table: TableModel = {
        headers: ['Problem-Bank ID', 'Bucket', 'Category', 'Division', 'Function', 'Department', 'Project SKU', 'Estimated Saving'],
        data: [{
            to: '/dashboard/project_details',
            problemBankId: '608',
            bucket: 'Dept-Project',
            category: 'Inprocess-Quality',
            division: 'WTCH-HSR',
            function: 'Case_Plant',
            department: 'Case Press Shop',
            projectSKU: '1293749',
            estSaving: '3.3'
        },
        {
            to: '/dashboard/project_details',
            problemBankId: '618',
            bucket: 'Dept-Maintaince',
            category: 'Finished-Quality',
            division: 'GEAR-HSR',
            function: 'Case_Plant',
            department: 'Glass Forge Shop',
            projectSKU: '12943549',
            estSaving: '4.1'
        },
        {
            to: '/dashboard/project_details',
            problemBankId: '618',
            bucket: 'Dept-Maintaince',
            category: 'Finished-Quality',
            division: 'GEAR-HSR',
            function: 'Case_Plant',
            department: 'Glass Forge Shop',
            projectSKU: '12943549',
            estSaving: '4.1'
        }]
    }

    // event handlers
    const toggleCardVisibility = () => {
        setOpen(!open);
        setOpenSearch(true);
    };


    const ShowSearch = () => {
        setOpenSearch(!openSearch);
        setOpen(false);
    };

    const ShowSearchData = () => {
        setOpen(open);
        setOpenSearch(false);
        setOpenSearchData(!openSearchData);
        setOpen(false);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const handleChangePage = (
        _event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    function createData(projectModel: ProjectModel) {
        return projectModel;
    }

    const rows: ProjectModel[] = [
        createData({
            name: 'Frozen yoghurt', calories: 159, fat: 6.0, carbs: 24, protein: 4.0, status: 'Not Eligible'
        })];

    return (
        <>
            <Box display="flex" justifyContent="flex-end">
                <ButtonStyle variant='contained' onClick={ShowSearch}>Search Project</ButtonStyle>
            </Box>
            {open && (
                <Card sx={{ width: '100%', }} className="outerContainer">
                    <CardContent style={{ paddingBottom: 1 }}>
                        <Typography gutterBottom variant="h5" component="div" style={{ color: '#115E6E', fontSize: 18 }}>
                            Problem Bank Registration
                        </Typography>
                        <Grid container spacing={2} >
                            {getGridItem({
                                value: ['Function'], label: 'Function'
                            })}

                            {getGridItem({
                                value: ['Department'], label: 'Department'
                            })}
                            {getGridItem({
                                value: ['Problem Nature'], label: 'Problem Nature'
                            })}
                            {getGridItem({
                                value: ['Point of Problem Identification'], label: 'Point of Problem Identification'
                            })}
                            <Grid item xs={4}>
                                <TextField style={{ width: '100%' }} id="standard-basic" label="Problem Notified by(EMP No) W/O Prefix EO" variant="standard" />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField style={{ width: '100%' }} id="standard-basic" label="Problem" variant="standard" />
                            </Grid>
                        </Grid>
                        <Box display="flex" justifyContent="center" mt={1}>
                            <ButtonStyle variant='contained' onClick={toggleCardVisibility}>Save</ButtonStyle>
                        </Box>
                    </CardContent>
                </Card>
            )}
            {!openSearch && (
                <Card sx={{ minWidth: 275 }} className="outerContainer">
                    <CardContent style={{ paddingBottom: 1 }}>
                        <Typography gutterBottom variant="h5" component="div" style={{ color: '#115E6E', fontSize: 18 }}>
                            Search Project
                        </Typography>
                        <Grid container spacing={2} >
                            {getGridItem({
                                value: ['Bucket'], label: 'Bucket'
                            })}
                            {getGridItem({
                                value: ['Category'], label: 'Category'
                            })}
                            {getGridItem({
                                value: ['Division'], label: 'Division'
                            })}
                            {getGridItem({
                                value: ['Function'], label: 'Function'
                            })}
                            {getGridItem({
                                value: ['Department'], label: 'Department'
                            })}
                        </Grid>
                        <Box display="flex" justifyContent="center" mt={1}>
                            <ButtonStyle variant='contained' onClick={ShowSearchData}>Search</ButtonStyle>
                        </Box>
                    </CardContent>
                </Card>
            )}
            {openSearchData && (
                <Paper sx={{ overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead style={{ backgroundColor: '#00B0AB' }}>
                                <TableRow>
                                    {table.headers.map((header) => {
                                        return <TableCell style={{ ...tableSellStyle, }}>{header}</TableCell>
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {table.data.map((data) => {
                                    return <TableRow
                                        component={Link}
                                        to={data.to}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell style={tableData} component="th" scope="row">{data.problemBankId}</TableCell>
                                        <TableCell style={tableData}>{data.bucket}</TableCell>
                                        <TableCell style={tableData}>{data.category}</TableCell>
                                        <TableCell style={tableData}>{data.division}</TableCell>
                                        <TableCell style={tableData}>{data.function}</TableCell>
                                        <TableCell style={tableData}>{data.department}</TableCell>
                                        <TableCell style={tableData}>{data.projectSKU}</TableCell>
                                        <TableCell style={tableData}>{data.estSaving}</TableCell>
                                    </TableRow>
                                })}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                        colSpan={11}
                                        count={rows.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        SelectProps={{
                                            inputProps: {
                                                'aria-label': 'rows per page',
                                            },
                                            native: true,
                                        }}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    //   ActionsComponent={}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>

                </Paper>
            )
            }
        </>

    );

    function getGridItem(data: SelectVariantData) {
        return <Grid item xs={4}>
            <SelectVariants value={data.value} label={data.label} />
        </Grid>;
    }
}

export default Admin