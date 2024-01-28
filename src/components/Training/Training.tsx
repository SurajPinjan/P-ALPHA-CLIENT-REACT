
import { Card, CardContent } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import GBAndBB from './TrainingSection/GBAndBB';
import BBTraining from './TrainingSection/BBTraining';


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ padding: '0px 8px 0px 8px' }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

function Training() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        console.log(event);
        setValue(newValue);
    };

    return (
        <>
            <Card>
                <CardContent style={{ padding: '0' }}>
                    <Box
                        sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', width: '100%', overflow: 'auto', textAlign: 'left' }}>
                        <Tabs
                            orientation="vertical"
                            value={value}
                            onChange={handleChange}
                            aria-label="Vertical tabs example"
                            sx={{ width: '18.5rem', background: '#f0f8ff', }}>
                            <Tab
                                label='GD & BD Executives'
                                {...a11yProps(0)} className="tabsBg" style={{ borderBottom: '1px solid #ddd', width: '100%', alignItems: 'start' }} />
                            <Tab
                                label='BB Training Module'
                                {...a11yProps(1)} className="tabsBg" style={{ borderBottom: '1px solid #ddd', width: '100%', alignItems: 'start' }} />
                            <Tab
                                label='GB Training Module'
                                {...a11yProps(2)} className="tabsBg" style={{ borderBottom: '1px solid #ddd', width: '100%', alignItems: 'start' }} />
                            <Tab
                                label='Six Sigma Project Guide'
                                {...a11yProps(9)} className="tabsBg" style={{ borderBottom: '1px solid #ddd', width: '100%', alignItems: 'start' }} />
                            <Tab
                                label='PPT Guide'
                                {...a11yProps(4)} className="tabsBg" style={{ borderBottom: '1px solid #ddd', width: '100%', alignItems: 'start' }}
                            />
                        </Tabs>
                        <Box width={'100%'} padding={'0'}>
                            <TabPanel value={value} index={0} >
                                <GBAndBB></GBAndBB>
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <BBTraining></BBTraining>
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                                {/* <Analyze></Analyze> */}
                            </TabPanel>
                            <TabPanel value={value} index={3}>
                                {/* <Validate></Validate> */}
                            </TabPanel>
                            <TabPanel value={value} index={4}>
                                {/* <Control></Control> */}
                            </TabPanel>
                            <TabPanel value={value} index={5}>
                                {/* <ProjectReview></ProjectReview> */}
                            </TabPanel>
                        </Box>

                    </Box>
                </CardContent>
            </Card>
        </>
    );
}


export default Training
