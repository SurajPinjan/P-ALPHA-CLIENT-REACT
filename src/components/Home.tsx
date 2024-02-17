import React, { useCallback, useEffect, useReducer } from "react";
import "../App.css";
import SwipeableTextMobileStepper from "../commons/Dashboard/Carousel";
import { XModel, XView, getViewFromModelX } from "../models/X";
import { makeHttpCall } from "../services/ApiService";
import { ENTITY_NAME, HTTP_METHOD, OPERATION } from "../types/enums";
import {
  HttpGetAllRequestBody,
  HttpRequestData,
  HttpResponseGetAll,
} from "../types/httpTypes";
import { deepReducerFunction } from "../Reducers/deepReducer";
import store from "../services/GlobalStateService";
import { useNavigate } from "react-router-dom";

function Home() {
  // constants
  const navigate = useNavigate();
  // states
  // view refresh states
  const [banners, setBanners] = useReducer(deepReducerFunction<XView[]>, []);
  const [reset, setReset] = React.useState<boolean>(true);

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

  // Template
  return <>{reset && <SwipeableTextMobileStepper baners={banners} />}</>;
}

export default Home;
