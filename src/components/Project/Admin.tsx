import {
  Card,
  CardContent,
  Checkbox,
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
import {
  ENTITY_NAME,
  HTTP_METHOD,
  OPERATION,
  SELECT_VALUES,
} from "../../types/enums";
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
  const [checked, setChecked] = React.useState(false);
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

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
      <div>
        <Checkbox checked={checked} onChange={handleChange} color="primary" />
        <span>{checked ? "Checked" : "Unchecked"}</span>
      </div>
      <Card sx={{ width: "100%" }} className="outerContainer">
        <CardContent>
          <Formik
            initialValues={{
              isDeleted: false,
              isNew: false,
            }}
            onSubmit={formikSubmitHandler}
          >
            {({ setValues, submitForm, values }) => (
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
                        onChange={(
                          event: React.ChangeEvent<HTMLSelectElement>
                        ) => {
                          if (checked)
                            setValues({
                              ...values,
                              master: event.target.value as SELECT_VALUES,
                            }).then(() => {
                              submitForm();
                            });
                        }}
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
            )}
          </Formik>
        </CardContent>
      </Card>

      <Admin filters={filters} udpateSwitch={props.udpateSwitch}></Admin>
    </>
  );
};

export default AdminWrapper;
