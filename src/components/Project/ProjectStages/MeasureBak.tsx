import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React, { useState } from "react";

import { Panel } from "../ProjectDetails";

import MachineAudit from "./MeasureTabs/MachineAudit";
import ProcessAudit from "./MeasureTabs/ProcessAudit";
import RejectionAudit from "./MeasureTabs/RejectionAudit";
import SSV from "./MeasureTabs/SSV";
import "./Project.scss";
import { Card, CardContent } from "@mui/material";

const Measure = () => {
  const [index, setIndex] = useState<number>(0);
  const onTabClicked = (
    _event: React.ChangeEvent<object>,
    newIndex: number
  ) => {
    setIndex(newIndex);
  };
  return (
    <>
      <Box>
        <AppBar
          position="static"
          style={{
            background: "transparent",
            width: "100%",
            color: "#fff",
            marginTop: "0rem",
            marginBottom: "1rem",
          }}
        >
          <Tabs value={index} onChange={onTabClicked}>
            <Tab label="Process Parameter Audit" style={{ color: "#000" }} />
            <Tab label="Machine/Tools HW Audit" style={{ color: "#000" }} />
            <Tab label="Rejection" style={{ color: "#000" }} />
            <Tab
              label="Suspected Sources of Variation"
              style={{ color: "#000" }}
            />
          </Tabs>
        </AppBar>
        <Panel value={index} index={0}>
          <ProcessAudit></ProcessAudit>
        </Panel>
        <Panel value={index} index={1}>
          <MachineAudit></MachineAudit>
        </Panel>

        <Panel value={index} index={2}>
          <RejectionAudit></RejectionAudit>
        </Panel>
        <Panel value={index} index={3}>
          <Box>
            <Card>
              <CardContent style={{ padding: "10" }}>
                <SSV></SSV>
              </CardContent>
            </Card>
          </Box>
        </Panel>
      </Box>
    </>
  );
};

export default Measure;
