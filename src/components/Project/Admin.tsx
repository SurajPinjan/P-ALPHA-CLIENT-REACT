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

interface AdminWrapperProps {}

const AdminWrapper: React.FC<AdminWrapperProps> = () => {
  // constants

  // states
  const [masters, setMasters] = React.useState<MasterView[]>([]);
  const [filters, setFilters] = React.useState<MasterView>({
    isDeleted: false,
    isNew: false,
  });

  // constants

  // data operations

  const getDataAll = useCallback(async () => {
    const requestDataAll: HttpRequestData<HttpGetAllRequestBody<MasterModel>> =
      {
        entityName: ENTITY_NAME.MASTER,
        method: HTTP_METHOD.POST,
        operation: OPERATION.GET_ALL,
        body: {
          pageSize: 10,
          pageNumber: 0,
        },
      };

    const fetchData: HttpResponseGetAll<MasterModel> = await makeHttpCall<
      HttpResponseGetAll<MasterModel>,
      HttpGetAllRequestBody<MasterModel>
    >(requestDataAll);

    const dat: MasterView[] = fetchData.data.map((row: MasterModel) => {
      const data: MasterView = getViewFromModelMaster(row);
      return data;
    });

    setMasters(() => dat);
  }, []);

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
                    <Field as={Select} labelId="master" name="master">
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

      <Admin filters={filters}></Admin>
    </>
  );
};

export default AdminWrapper;
