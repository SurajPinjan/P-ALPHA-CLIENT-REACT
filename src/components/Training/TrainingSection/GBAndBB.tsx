import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { AppBar } from '@mui/material';
import filepdf from '../../../assets/images/filepdf.pdf';
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 1 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function GBAndBB() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        console.log(JSON.stringify(event).indexOf('c'));
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <AppBar position="static" style={{ background: 'transparent', width: '100%', color: '#fff', marginTop: '0rem', marginBottom: '1rem' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Consolidation" {...a11yProps(0)} />
                    <Tab label="GB Executives" {...a11yProps(1)} />
                    <Tab label="BB Executives" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            {getTabPannel(0)}
            {getTabPannel(1)}
            {getTabPannel(2)}
        </Box>
    );

    function getTabPannel(index: number) {
        return <CustomTabPanel value={value} index={index}>
            <label htmlFor="file-input-1">
                <object data={filepdf} type="application/pdf" width="100%" height="500px">
                </object>
            </label>
        </CustomTabPanel>;
    }
}
export default GBAndBB;