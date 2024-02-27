import { Typography, styled } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

interface MediaToolbarProps {
  buttonTitle?: string;
  tableTitle: string;
  setIsOpenUpload: (value: React.SetStateAction<boolean>) => void;
  handleCreate: () => void;
}

export default function MediaToolbar(props: MediaToolbarProps) {
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
  const { setIsOpenUpload, buttonTitle, tableTitle } = props;

  const handleClick = () => {
    setIsOpenUpload(true);
  };

  return (
    <>
      <Box sx={{ justifyContent: "space-between", display: "flex" }}>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          style={{
            color: "#115E6E",
            fontSize: 18,
            fontWeight: 600,
            alignSelf: "center",
          }}
        >
          {tableTitle}
        </Typography>

        {buttonTitle && (
          <ButtonStyle
            variant="contained"
            onClick={handleClick}
            style={{ marginRight: "5px" }}
          >
            {buttonTitle}
          </ButtonStyle>
        )}
      </Box>
    </>
  );
}
