import { Card, CardContent } from "@mui/material";
import Box from "@mui/material/Box";

import XDetailGridWrapper from "../../../grids/XDetailPage";
import Admin from "../../Project";

// textarea

function MachineAudit() {
  return (
    <>
      <Box>
        <Card>
          <CardContent style={{ padding: "0" }}>
            <Admin
              filters={{
                master: undefined,
                isDeleted: false,
                isNew: false,
                uid: -1,
              }}
            ></Admin>
            <XDetailGridWrapper></XDetailGridWrapper>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
export default MachineAudit;
