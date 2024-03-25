import { Box, Button, Card, CardContent, styled } from "@mui/material";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
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
const SessionTimeout = () => {
  // states

  // constants
  const navigate = useNavigate();

  // event handlers

  // hooks

  // data operations
  const login = useCallback(async () => {
    navigate("/");
  }, [navigate]);

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
              <Box
                width={"100%"}
                display={"flex"}
                justifyContent={"center"}
                marginBottom={1}
              >
                <h4>SESSION TIMEOUT</h4>
              </Box>
              <Box
                width={"100%"}
                display={"flex"}
                justifyContent={"center"}
                marginTop={3}
              >
                <ButtonStyle variant="contained" onClick={login}>
                  GOTO Login
                </ButtonStyle>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
};

export default SessionTimeout;
