import {
  Button,
  Card,
  CardContent,
  FormControl,
  TextField,
  Typography,
  styled
} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import { GridValidRowModel } from "@mui/x-data-grid";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { urlDecodeString } from "../services/encoderService";
const ButtonStyle = styled(Button)`
  background-color: #115e6e !important;
  color: white;
  border: none;
  margin-bottom: 10px !important;
  font-size: 14px !important;
  text-transform: capitalize !important;

  &:hover {
    background-color: #115e6e;
  }
`;
// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
// }));

export default function BasicGrid() {
  // 3rd party hooks
  // const navigate = useNavigate();
  const { data } = useParams();

  // states

  const [urlData, setUrlData] = React.useState<GridValidRowModel | undefined>();

  // const GotoProjectDetails = () => {
  //   navigate("/dashboard/project_details");
  // };

  // hooks

  useEffect(() => {
    if (data) {
      setUrlData(urlDecodeString<GridValidRowModel | undefined>(data));
    }
  }, [data]);

  useEffect(() => {
    console.log(urlData);
  }, [urlData]);

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            style={{ color: "#115E6E", fontSize: 18 }}
          ></Typography>
          <Grid container spacing={2}>
            {
              <Grid >
                {urlData && (
                  <Formik
                    initialValues={{
                      columnSelect: urlData.columnSelect,
                    }}
                    onSubmit={() => {}}
                  >
                    <Form>
                      <FormControl variant="standard" sx={{ minWidth: "100%" }}>
                        <Field
                          as={TextField}
                          labelId="columnSelect"
                          name="columnSelect"
                          type="text"
                          style={{ width: "100%" }}
                          label="Column Select"
                          variant="standard"
                        />
                        <ErrorMessage
                          component="div"
                          className="error"
                          name="selectedOption"
                        />
                      </FormControl>
                      <ButtonStyle type="submit">Save</ButtonStyle>
                    </Form>
                  </Formik>
                )}
              </Grid>
              /* <Grid xs={3}>
              <SelectVariants value={["Bucket"]} label="Bucket" />
            </Grid>
            <Grid xs={3}>
              <SelectVariants value={["Category"]} label="Category" />
            </Grid>
            <Grid xs={3}>
              {urlData && (
                <TextField
                  style={{ width: "100%" }}
                  id="standard-basic"
                  label="Division"
                  variant="standard"
                  value={urlData.columnSelect}
                />
              )}
            </Grid>
            <Grid xs={3}>
              <TextField
                style={{ width: "100%" }}
                id="standard-basic"
                label="Function"
                variant="standard"
              />
            </Grid>
            <Grid xs={3}>
              <TextField
                style={{ width: "100%" }}
                id="standard-basic"
                label="Department"
                variant="standard"
              />
            </Grid>
            <Grid xs={3}>
              <TextField
                style={{ width: "100%" }}
                id="standard-basic"
                label="Product/SKU"
                variant="standard"
              />
            </Grid>
            <Grid xs={3}>
              <TextField
                style={{ width: "100%" }}
                id="standard-basic"
                label="Baseline"
                variant="standard"
              />
            </Grid>
            <Grid xs={3}>
              <TextField
                style={{ width: "100%" }}
                id="standard-basic"
                label="Target"
                variant="standard"
              />
            </Grid>
            <Grid xs={3}>
              <TextField
                style={{ width: "100%" }}
                id="standard-basic"
                label="Estimated Saving"
                variant="standard"
              />
            </Grid>
            <Grid xs={3}>
              <SelectVariants
                value={["Type of Project"]}
                label="Type of Project"
              />
            </Grid>
            <Grid xs={3}>
              <SelectVariants
                value={["Nature of Project"]}
                label="Nature of Project"
              />
            </Grid>
            <Grid xs={3}>
              <SelectVariants
                value={["Impact on Internal Costumer"]}
                label="Impact on Internal Costumer"
              />
            </Grid>
            <Grid xs={3}>
              <SelectVariants
                value={["Impact on External Costumer"]}
                label="Impact on External Costumer"
              />
            </Grid>
            <Grid xs={3}>
              <SelectVariants
                value={["Data Oriented Analysis"]}
                label="Data Oriented Analysis"
              />
            </Grid>
            <Grid xs={3}>
              <SelectVariants
                value={["Cross Function Rating"]}
                label="Cross Function Rating"
              />
            </Grid>
            <Grid xs={3}>
              <SelectVariants
                value={["Project Status"]}
                label="Project Status"
              />
            </Grid>
            <Grid xs={9}>
              <TextField
                style={{ width: "100%" }}
                id="standard-basic"
                label="Problem"
                variant="standard"
              />
            </Grid> */
            }
          </Grid>
          {/* <Box display="flex" justifyContent="center" mt={1}>
            <ButtonStyle variant="contained" onClick={GotoProjectDetails}>
              Save
            </ButtonStyle>
          </Box> */}
        </CardContent>
      </Card>
    </Box>
  );
}
