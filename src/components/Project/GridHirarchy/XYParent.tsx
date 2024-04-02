import { Card, CardContent } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { useParams } from "react-router-dom";
import { XModel } from "../../../models/X";
import XGrid from "./XGrid";
import YGridWithState from "./YGrid";
import { urlDecodeString } from "../../../services/encoderService";

function XYParent() {
  const { data } = useParams();
  const [urlData, setUrlData] = React.useState<XModel | undefined>();
  const [isPrestine, setIsPrestine] = React.useState<boolean>(true);

  console.log(urlData);

  React.useEffect(() => {
    if (data) {
      setUrlData(urlDecodeString<XModel>(data));
    }
  }, [data]);

  return (
    <>
      <Box>
        <Card>
          <CardContent>
            <XGrid
              isCompare={false}
              x_id={-1}
              clickHandler={() => {
                setIsPrestine(false);
              }}
            />
            <YGridWithState isPrestine={isPrestine} x_id={-1}></YGridWithState>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
export default XYParent;
