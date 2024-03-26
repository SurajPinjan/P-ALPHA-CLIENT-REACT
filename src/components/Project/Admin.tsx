import {
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import React, { useCallback, useEffect } from "react";
import {
  MasterModel,
  MasterView,
  getViewFromModelMaster,
} from "../../models/Master";
import { makeHttpCall } from "../../services/ApiService";
import { ENTITY_NAME, HTTP_METHOD, OPERATION } from "../../types/enums";
import {
  HttpGetAllRequestBody,
  HttpRequestData,
  HttpResponseGetAll,
} from "../../types/httpTypes";
import Admin from "./Project";
import store from "../../services/GlobalStateService";
import { useNavigate } from "react-router-dom";

interface AdminWrapperProps {
  udpateSwitch?: () => void;
}

const AdminWrapper: React.FC<AdminWrapperProps> = (props) => {
  // constants
  const navigate = useNavigate();
  // states
  const [masters, setMasters] = React.useState<MasterView[]>([]);
  const [filters, setFilters] = React.useState<MasterView>({
    isDeleted: false,
    isNew: false,
  });

  // constants

  // data operations

  const getDataAll = useCallback(async () => {
    const requestDataAll: HttpRequestData<HttpGetAllRequestBody> = {
      entityName: ENTITY_NAME.MASTER,
      method: HTTP_METHOD.POST,
      operation: OPERATION.GET_ALL,
      body: {
        pageSize: 10,
        pageNumber: 0,
        filters: [],
        sorts: [{ field: "uid", sort: "desc" }],
      },
    };

    const fetchData: HttpResponseGetAll<MasterModel> = await makeHttpCall<
      HttpResponseGetAll<MasterModel>,
      HttpGetAllRequestBody
    >(requestDataAll, store, navigate);

    const dat: MasterView[] = fetchData.data.map((row: MasterModel) => {
      const data: MasterView = getViewFromModelMaster(row);
      return data;
    });

    setMasters(() => dat);
  }, [navigate]);

  // anonymous functions

  // event handlers

  const formikSubmitHandler = (
    values: MasterView,
    { setSubmitting }: FormikHelpers<MasterView>
  ) => {
    console.log("Submitted values:", values);
    setFilters((old) => ({ ...old, master: values.master }));
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
              isDeleted: false,
              isNew: false,
            }}
            onSubmit={formikSubmitHandler}
          >
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <FormControl variant="standard" sx={{ minWidth: "100%" }}>
                    <InputLabel id="demo-simple-select-standard-label">
                      {" "}
                      Master
                    </InputLabel>
                    <Field
                      as={Select}
                      labelId="master"
                      name="master"
                      id="master"
                      label="master"
                    >
                      {masters.map((master) => (
                        <MenuItem key={master.uid} value={master.master}>
                          {master.master}
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
              </Grid>
              <button type="submit">Filter</button>
            </Form>
          </Formik>
        </CardContent>
      </Card>

      <Admin filters={filters} udpateSwitch={props.udpateSwitch}></Admin>
    </>
  );
};

export default AdminWrapper;
