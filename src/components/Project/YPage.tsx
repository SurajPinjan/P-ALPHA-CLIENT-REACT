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
import { XModel, XView, getViewFromModelX } from "../../models/X";
import { YView } from "../../models/Y";
import { makeHttpCall } from "../../services/ApiService";
import { ENTITY_NAME, HTTP_METHOD, OPERATION } from "../../types/enums";
import {
  HttpGetAllRequestBody,
  HttpRequestData,
  HttpResponseGetAll,
} from "../../types/httpTypes";
import YGrid from "./YGrid";
import store from "../../services/GlobalStateService";
import { useNavigate } from "react-router-dom";

interface YGridWrapperProps {}

const YGridWrapper: React.FC<YGridWrapperProps> = () => {
  // constants
  const navigate = useNavigate();
  // states
  const [xs, setXs] = React.useState<XView[]>([]);
  const [y, setY] = React.useState<YView>({
    columnText: "",
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
    values: YView,
    { setSubmitting }: FormikHelpers<YView>
  ) => {
    console.log("Submitted values:", values);
    setY((old) => ({
      ...old,
      columnText: values.columnText,
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
              columnText: "",
              x_id: 0,
              isDeleted: false,
              isNew: false,
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
                          console.log(values);
                          const foundX = xs.find(
                            (x) => x.uid === e.target.value
                          );
                          setFieldValue("columnText", foundX?.columnSelect);
                          setFieldValue("x_id", e.target.value);
                        }}
                      >
                        {xs.map((x) => (
                          <MenuItem key={x.uid} value={x.uid}>
                            {x.uid}
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
                        labelId="columnText"
                        name="columnText"
                        type="text"
                        style={{ width: "100%" }}
                        label="Column Text"
                        variant="standard"
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

      <YGrid saveData={y} xOptions={xs}></YGrid>
    </>
  );
};

export default YGridWrapper;
