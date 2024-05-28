import {
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { XModel, XView, getViewFromModelX } from "../../models/X";
import { XDetailView } from "../../models/XDetail";
import { makeHttpCall } from "../../services/ApiService";
import store from "../../services/GlobalStateService";
import { BLANK, ENTITY_NAME, HTTP_METHOD, OPERATION } from "../../types/enums";
import {
  HttpGetAllRequestBody,
  HttpRequestData,
  HttpResponseGetAll,
} from "../../types/httpTypes";
import XDetailGridWithState from "./XDetailGrid";
import ScrollPage from "../Autocompletes/ScrollPage";

interface XDetailGridWrapperProps { }

const XDetailGridWrapper: React.FC<XDetailGridWrapperProps> = () => {
  // constants
  const navigate = useNavigate();
  // states
  const [xs, setXs] = React.useState<XView[]>([]);
  const [y, setY] = React.useState<XDetailView>({
    columnDetail: BLANK,
    x_id: 0,
    isDeleted: false,
    isNew: false,
  });

  // constants

  // data operations

  const getDataAll = useCallback(async () => {
    const requestDataAll: HttpRequestData<HttpGetAllRequestBody> = {
      entityName: ENTITY_NAME.X,
      method: HTTP_METHOD.POST,
      operation: OPERATION.GET_ALL,
      body: {
        pageSize: 10,
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

  // anonymous functions

  // event handlers

  const formikSubmitHandler = (
    values: XDetailView,
    { setSubmitting }: FormikHelpers<XDetailView>
  ) => {
    setY((old) => ({
      ...old,
      columnDetail: values.columnDetail,
      x_id: values.x_id,
    }));
    setSubmitting(false);
  };

  // hooks
  useEffect(() => {
    getDataAll();
  }, [getDataAll]);

  // dom

  return (
    <>
      <Card sx={{ width: "100%" }} className="outerContainer">
        <CardContent>
          <Formik
            initialValues={{
              columnDetail: BLANK,
              x_id: 0,
              isDeleted: false,
              isNew: false,
              username: BLANK,
            }}
            onSubmit={formikSubmitHandler}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <FormControl variant="standard" sx={{ minWidth: "100%" }}>
                      <InputLabel id="demo-simple-select-standard-label">
                        {" "}
                        X Select
                      </InputLabel>
                      <Field
                        as={Select}
                        labelId="x_id"
                        name="x_id"
                        id="x_id"
                        label="x_id"
                        onChange={(e: SelectChangeEvent<number>) => {
                          console.log(values.isNew);
                          const foundX = xs.find(
                            (x) => x.uid === e.target.value
                          );
                          setFieldValue("columnDetail", foundX?.columnSelect);
                          setFieldValue("x_id", e.target.value);
                        }}
                      >
                        {xs.map((x) => (
                          <MenuItem key={x.uid} value={x.uid}>
                            {x.columnUText}
                          </MenuItem>
                        ))}
                      </Field>
                      <ErrorMessage
                        component="div"
                        className="error"
                        name="selectedOption"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl variant="standard" sx={{ minWidth: "100%" }}>
                      <Field
                        as={TextField}
                        labelId="columnDetail"
                        name="columnDetail"
                        type="text"
                        style={{ width: "100%" }}
                        label="Column Text"
                        variant="standard"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl variant="standard" sx={{ minWidth: "100%" }}>
                      <Field
                        as={ScrollPage}
                        labelId="user"
                        name="user"
                        style={{ width: "100%" }}
                        label="Users"
                        variant="standard"
                        onChange={(value: string) => {
                          console.log(value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <button type="submit">Save</button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>

      <XDetailGridWithState saveData={y} xOptions={xs} />
    </>
  );
};

export default XDetailGridWrapper;
