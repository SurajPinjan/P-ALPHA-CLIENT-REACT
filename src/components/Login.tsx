import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  styled,
} from "@mui/material";
import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { makeHttpCall } from "../services/ApiService";
import store from "../services/GlobalStateService";
import {
  API_RESPONSE_CODE,
  ENTITY_NAME,
  HTTP_METHOD,
  OPERATION,
} from "../types/enums";
import {
  HttpLoginRequestBody,
  HttpRequestData,
  HttpResponseLogin,
} from "../types/httpTypes";
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
const Login = () => {
  // states
  const [disabled, setDisabled] = React.useState(false);
  const [username, setUsername] = React.useState("admin");
  const [password, setPassword] = React.useState("Password@123");
  const [loginMsg, setLoginMsg] = React.useState<string | undefined>();
  // constants
  const navigate = useNavigate();

  // event handlers

  const validateInput = () => {
    // check if input is valid
    if (username.length >= 3 && password.length >= 8) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  // hooks

  // data operations
  const login = useCallback(async () => {
    const requestDataAll: HttpRequestData<HttpLoginRequestBody> = {
      entityName: ENTITY_NAME.AUTH,
      method: HTTP_METHOD.POST,
      operation: OPERATION.LOGIN,
      body: {
        username: username,
        password: password,
      },
    };

    const fetchData: HttpResponseLogin = await makeHttpCall<
      HttpResponseLogin,
      HttpLoginRequestBody
    >(requestDataAll, store, navigate);

    setLoginMsg(fetchData.displayMsg);
    if (fetchData.responseCode == API_RESPONSE_CODE.SUCCESS_GEN) {
      // save to localstore
      localStorage.setItem("token", fetchData.token);
      if (fetchData.userInfo.uid) {
        localStorage.setItem("userid", fetchData.userInfo.uid.toString());
      }
      localStorage.setItem("userrole", fetchData.userInfo.role_name);

      if (fetchData.userInfo.permissions) {
        localStorage.setItem(
          "permissions",
          JSON.stringify(fetchData.userInfo.permissions)
        );
      }

      setTimeout(() => {
        navigate("/dashboard/problem_bank");
      }, 100);
    }
  }, [navigate, password, username]);

  //   hook
  useEffect(() => {
    // login();
  }, [login]);

  // template
  return (
    <>
      <Box
        width={"100%"}
        height={"100vh"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box width={400}>
          <Card>
            <CardContent style={{ paddingBottom: 1 }}>
              <Box
                width={"100%"}
                display={"flex"}
                justifyContent={"center"}
                marginBottom={1}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Logo_of_Titan_Company%2C_May_2018.svg/640px-Logo_of_Titan_Company%2C_May_2018.svg.png"
                  alt="Image 1"
                  width={60}
                  height={60}
                  style={{ marginRight: "10px" }}
                />
              </Box>
              <Box marginTop={1}>
                <TextField
                  onKeyUp={validateInput}
                  value={username}
                  style={{ width: "100%" }}
                  id="username"
                  label="User Name"
                  variant="standard"
                  onChange={(event: {
                    target: { value: React.SetStateAction<string> };
                  }) => {
                    setLoginMsg(undefined);
                    setUsername(event.target.value);
                  }}
                />
              </Box>
              <Box marginTop={1}>
                <TextField
                  onKeyUp={validateInput}
                  value={password}
                  type="password"
                  style={{ width: "100%" }}
                  id="password"
                  label="Password"
                  variant="standard"
                  onChange={(event: {
                    target: { value: React.SetStateAction<string> };
                  }) => {
                    setLoginMsg(undefined);
                    setPassword(event.target.value);
                  }}
                />
              </Box>
              <Box
                width={"100%"}
                display={"flex"}
                justifyContent={"center"}
                marginTop={3}
              >
                <ButtonStyle
                  disabled={disabled}
                  variant="contained"
                  onClick={login}
                >
                  Login
                </ButtonStyle>
              </Box>
              <Box textAlign={"center"} fontSize={12}>
                <div>{`Forgot Password ?`}</div>
              </Box>
              {loginMsg && <Box textAlign={"center"} color={'red'} fontSize={12}>
                <div>{loginMsg}</div>
              </Box>}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
};

export default Login;
