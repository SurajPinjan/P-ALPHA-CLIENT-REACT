import { LineChart } from "@mui/x-charts";
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { XModel, XView, getViewFromModelX } from "../../../../models/X";
import { makeHttpCall } from "../../../../services/ApiService";
import store from "../../../../services/GlobalStateService";
import { ENTITY_NAME, HTTP_METHOD, OPERATION } from "../../../../types/enums";
import {
  HttpGetAllRequestBody,
  HttpRequestData,
  HttpResponseGetAll,
} from "../../../../types/httpTypes";
import AdminWrapper from "../../Admin";

function RejectionAudit() {
  const [xs, setXs] = React.useState<XView[]>([]);
  const [updateSwitch, setUpdateSwitch] = React.useState(false);
  const navigate = useNavigate();

  // event handlers
  const toogle = () => {
    setUpdateSwitch(!updateSwitch);
  };

  // data operations
  const getDataAll = useCallback(async () => {
    const requestDataAll: HttpRequestData<HttpGetAllRequestBody> = {
      entityName: ENTITY_NAME.X,
      method: HTTP_METHOD.POST,
      operation: OPERATION.GET_ALL,
      body: {
        pageSize: 1000,
        pageNumber: 0,
        filters: [],
        sorts: [{ field: "uid", sort: "desc" }],
      },
    };

    const fetchData: HttpResponseGetAll<XModel> = await makeHttpCall<
      HttpResponseGetAll<XModel>,
      HttpGetAllRequestBody
    >(requestDataAll, store, navigate);

    const dat: XView[] = fetchData.data.map((row: XModel) => {
      const data: XView = getViewFromModelX(row);
      return data;
    });

    setXs(() => dat);
  }, [navigate]);

  React.useEffect(() => {
    getDataAll();
  }, [getDataAll, updateSwitch]);

  return (
    <>
      {xs && xs.length && (
        <LineChart
          xAxis={[
            {
              scaleType: "band",
              data: xs.map((x) => x.columnUText),
            },
          ]}
          series={[
            {
              data: xs.map((x) => x.columnNumber),
            },
          ]}
          width={500}
          height={300}
        />
      )}

      <AdminWrapper udpateSwitch={toogle}></AdminWrapper>
    </>
  );
}
export default RejectionAudit;
