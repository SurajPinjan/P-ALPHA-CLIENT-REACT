import React, { useCallback, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { deepReducerFunction } from "../Reducers/deepReducer";
import SwipeableTextMobileStepper from "../commons/Dashboard/Carousel";
import { XModel, XView, getViewFromModelX } from "../models/X";
import { makeHttpCall } from "../services/ApiService";
import store from "../services/GlobalStateService";
import { ENTITY_NAME, HTTP_METHOD, OPERATION, PERMISSION_TYPES } from "../types/enums";
import {
  HttpGetAllRequestBody,
  HttpRequestData,
  HttpResponseGetAll,
} from "../types/httpTypes";
import { useUserRole } from "../contexts/userContext";

function Home() {
  // constants
  const navigate = useNavigate();
  // states
  // view refresh states
  const [banners, setBanners] = useReducer(deepReducerFunction<XView[]>, []);
  const [reset, setReset] = React.useState<boolean>(true);

  const userRole = useUserRole();

  const can_dashboard = userRole.permissions.findIndex(
    (p) => p.permission === PERMISSION_TYPES.DASHBOARD
  );

  // data operators

  const getDataAllBanner = useCallback(async () => {
    setReset(false);
    const requestDataAll: HttpRequestData<HttpGetAllRequestBody> = {
      entityName: ENTITY_NAME.X,
      method: HTTP_METHOD.POST,
      operation: OPERATION.GET_ALL,
      body: {
        pageSize: 100,
        pageNumber: 0,
        filters: [],
        sorts: [{ field: "uid", sort: "desc" }],
      },
    };

    const fetchData: HttpResponseGetAll<XModel> = await makeHttpCall<
      HttpResponseGetAll<XModel>,
      HttpGetAllRequestBody
    >(requestDataAll, store, navigate);

    setBanners(
      fetchData.data.map((row: XModel) => {
        const data: XView = getViewFromModelX(row);
        return data;
      })
    );

    setTimeout(() => {
      setReset(true);
    }, 100);
  }, [navigate]);

  // hooks
  useEffect(() => {
    getDataAllBanner();
  }, [getDataAllBanner]);

  useEffect(() => {
    if (can_dashboard === -1) {
      navigate("/dashboard/problem_bank");
    }
  }, [can_dashboard, navigate]);

  // Template
  return <>{reset &&
    <>
      <SwipeableTextMobileStepper baners={banners} />
    </>

  }</>;
}

export default Home;