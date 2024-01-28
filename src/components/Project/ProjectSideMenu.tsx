import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Card, CardContent, Grid } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import styled from 'styled-components';
import DefineImg from '../../assets/images/define.svg';
import DefineWhite from '../../assets/images/define_white.svg';
import MeasureImg from '../../assets/images/medium-level.svg';
import MeasureImgWhite from '../../assets/images/medium-level-white.svg';
import AnalyzeImg from '../../assets/images/analyze.svg';
import AnalyzeWhite from '../../assets/images/Vector-white.svg';
import ValidateImg from '../../assets/images/validate.svg';
import ValidateWhite from '../../assets/images/validate-white.svg';
import ControlImg from '../../assets/images/control.svg';
import ControlWhite from '../../assets/images/control-white.svg';
import ProjectImg from '../../assets/images/task-view.svg';
import ProjectWhite from '../../assets/images/task-view-white.svg';
import Analyze from './ProjectStages/Analyze';
import Control from './ProjectStages/Control';
import Define from './ProjectStages/Define';
import Measure from './ProjectStages/MeasureBak';
import ProjectReview from './ProjectStages/ProjectReview';
import Validate from './ProjectStages/Validate';


const AccordionDetailsStyle = styled(AccordionDetails)({
    padding: '0px 3px 5px !important',
});

const BoxHeader = styled(Box)({
    display: 'flex',
    justifyContent: '',
    borderBottom: '1px solid',
    borderColor: '#f5f5f5'

});

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

interface Taabs {
    label: string,
    icon: string,
    iconwhite: string,
    component: React.ComponentType<any>
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
                <Box sx={{ p: 1 }}>
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

function ProjectSideMenu() {
    // states
    const [value, setValue] = React.useState(0);

    const tabs: Taabs[] = [{ iconwhite: DefineWhite,icon: DefineImg, label: 'Define', component: Define }, { iconwhite: MeasureImgWhite,icon: MeasureImg, label: 'Measure', component: Measure }, { iconwhite: AnalyzeWhite,icon: AnalyzeImg, label: 'Analyze', component: Analyze }, { iconwhite: ValidateWhite,icon: ValidateImg, label: 'Validate / Improve', component: Validate }, { iconwhite: ControlWhite,icon: ControlImg, label: 'Control', component: Control }, { iconwhite: ProjectWhite,icon: ProjectImg, label: 'Project Review', component: ProjectReview }];

    // event handlers
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        console.log(event.isTrusted);
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
                            sx={{ width: '16.5rem', background: '#f0f8ff', }}>
                            {tabs.map((tab: Taabs, index: number) => { return tabSection(index, tab) }
                            )}
                        </Tabs>;
                        <Box width={'100%'}>
                            <Accordion square style={{ marginTop: '0' }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header" style={{ color: '#FFF' }}
                                >
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={12} className="boldTextStyle">
                                            <Typography variant="h6" className="fontWeightBold" style={{ fontSize: '16px' }}>
                                                Project ID :  TCL-SS-WTCH-23/376
                                            </Typography>
                                        </Grid></Grid>
                                </AccordionSummary>

                                <AccordionDetailsStyle>
                                    <Grid container spacing={1}>
                                        <Grid item xs>
                                            <Card>
                                                <CardContent style={{ padding: 9 }}>
                                                    <BoxHeader >
                                                        <p className="header-data-key">Bucket: </p>
                                                        <p className="header-data">Dept Projects</p>
                                                    </BoxHeader>
                                                    <BoxHeader >
                                                        <p className="header-data-key">Category: </p>
                                                        <p className="header-data">Inprogress Quality</p>
                                                    </BoxHeader>
                                                    <BoxHeader >
                                                        <p className="header-data-key">Division: </p>
                                                        <p className="header-data">WTCH-HSR</p>
                                                    </BoxHeader>
                                                    <BoxHeader >
                                                        <p className="header-data-key">Department: </p>
                                                        <p className="header-data"> Dept Projects</p>
                                                    </BoxHeader>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Card>
                                                <CardContent style={{ padding: 9 }}>
                                                    <BoxHeader >
                                                        <p className="header-data-key">Product/SKU: </p>
                                                        <p className="header-data">-</p>
                                                    </BoxHeader>
                                                    <BoxHeader >
                                                        <p className="header-data-key">Baseline: </p>
                                                        <p className="header-data">150000 PPM</p>
                                                    </BoxHeader>
                                                    <BoxHeader >
                                                        <p className="header-data-key">Target: </p>
                                                        <p className="header-data">30000 PPM</p>
                                                    </BoxHeader>
                                                    <BoxHeader >
                                                        <p className="header-data-key">Estimated Saving: </p>
                                                        <p className="header-data">Rs.Lakhs</p>
                                                    </BoxHeader>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs>
                                            <Card>
                                                <CardContent style={{ padding: 9 }}>
                                                    <BoxHeader >
                                                        <p className="header-data-key">Type of Projects: </p>
                                                        <p className="header-data">Type-4</p>
                                                    </BoxHeader>
                                                    <BoxHeader >
                                                        <p className="header-data-key">Nature of Projects:</p>
                                                        <p className="header-data">Problem solving</p>
                                                    </BoxHeader>
                                                    <BoxHeader >
                                                        <p className="header-data-key">Internal Customer:</p>
                                                        <p className="header-data">Medium</p>
                                                    </BoxHeader>
                                                    <BoxHeader >
                                                        <p className="header-data-key">External Customer:</p>
                                                        <p className="header-data">Medium</p>
                                                    </BoxHeader>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs>
                                            <Card>
                                                <CardContent style={{ padding: 9 }}>
                                                    <BoxHeader >
                                                        <p className="header-data-key">Data Oriented Analysis: </p>
                                                        <p className="header-data">Medium Data</p>
                                                    </BoxHeader>
                                                    <BoxHeader >
                                                        <p className="header-data-key">Cross Functional Rating: </p>
                                                        <p className="header-data">Medium</p>
                                                    </BoxHeader>
                                                    <BoxHeader >
                                                        <p className="header-data-key">Project Weightage: </p>
                                                        <p className="header-data">Target</p>
                                                    </BoxHeader>
                                                    <BoxHeader >
                                                        <p className="header-data-key">Project Impact: </p>
                                                        <p className="header-data">M</p>
                                                    </BoxHeader>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </AccordionDetailsStyle>
                            </Accordion>
                            {tabs.map((tab, index) => {
                                return <TabPanel value={value} index={index} >
                                    {<tab.component></tab.component>}
                                </TabPanel>
                            })}
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </>
    );

    function tabSection(index: number, tab: Taabs) {
        return <Tab
            label={<div style={{ display: 'flex', justifyContent: 'left' }}>
                {(value != index &&
                    <img src={tab.icon} alt="Control" width={20} height={20} />)}
                {(value === index && <img src={tab.iconwhite} alt="Control" width={20} height={20} />)} <div style={{ marginLeft: 9 }}>{tab.label}</div>
            </div>}
            {...a11yProps(index)} className="tabsBg" style={{ borderBottom: '1px solid #ddd', width: '100%', alignItems: 'start' }} />;
    }
}


export default ProjectSideMenu




