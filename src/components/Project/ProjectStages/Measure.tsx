import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import SelectVariants from "../../../commons/SelectInput";
import { makeMultiPartHttpCall } from "../../../services/ApiService";
import {
  BLANK,
  ENTITY_NAME,
  HTTP_METHOD,
  OPERATION,
} from "../../../types/enums";
import { HttpRequestData } from "../../../types/httpTypes";

const ButtonStyle = styled(Button)`
  background-color: #005f71;
  color: #fff;
  border: none;
  margin-bottom: 10px;
  font-size: 14px;
  text-transform: capitalize;

  &:hover {
    background-color: #115e6e;
  }
`;

// const FormLabel = styled(FormControlLabel)({
//     width: '100%',
// });
function MeasureTest() {
  const [inputValue, setInputValue] = useState(BLANK);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const uploadFile = async () => {
    if (selectedFile != null) {
      const requestDataUpdateOne: HttpRequestData<FormData> = {
        entityName: ENTITY_NAME.FILE,
        method: HTTP_METHOD.POST,
        operation: OPERATION.UPLOAD,
        body: new FormData(),
      };

      requestDataUpdateOne.body?.append("file", selectedFile);
      const data = await makeMultiPartHttpCall(requestDataUpdateOne);
      console.log(data);
    }
  };

  const handleFileInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files?.length) {
      setSelectedFile(event.target.files[0]);
    }
  };

  return (
    <div>
      <Box>
        <Card>
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              style={{ color: "#115E6E", fontSize: 18, fontWeight: 600 }}
            >
              Tools Used{" "}
            </Typography>
            <Button onClick={uploadFile}>upload go</Button>
          </CardContent>
        </Card>
      </Box>
      <Box marginTop={2}>
        <Card>
          <CardContent>
            <Grid container spacing={1}>
              <Grid item xs>
                <SelectVariants
                  value={["Option 1"]}
                  label="Technical Response"
                />
              </Grid>
              <Grid item xs>
                <TextField
                  value={inputValue}
                  onChange={handleInputChange}
                  variant="standard"
                  label="Specification"
                  style={{ width: "100%" }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
      <Card className="outerContainer">
        <CardContent style={{ paddingBottom: 1 }}>
          <Grid container>
            <Grid item xs={12} sm={12} style={{ textAlign: "center" }}>
              <div>
                {selectedFile && (
                  <iframe
                    title="Selected File"
                    src={URL.createObjectURL(selectedFile)}
                    width="100%"
                    height="200px"
                  ></iframe>
                )}
              </div>
            </Grid>
            <Grid item xs={12} sm={12} style={{ textAlign: "right" }}>
              <input
                id="file-input-1"
                type="file"
                accept=".pdf, .doc, .docx"
                onChange={handleFileInputChange}
              />
              <label htmlFor="file-input-1">
                <Button variant="contained" color="inherit">
                  {" "}
                  Click here to upload
                </Button>
              </label>
              <ButtonStyle style={{ marginLeft: 5 }} variant="contained">
                Save
              </ButtonStyle>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}

export default MeasureTest;
