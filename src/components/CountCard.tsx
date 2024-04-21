import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function CountCard(params: {
  count: string;
  title: string;
  description: string;
  navlink: string;
  clickHandler: () => void;
}) {
  const [count, setCount] = React.useState<string>(params.count);
  const [title, setTitle] = React.useState<string>(params.title);
  const [description, setDescription] = React.useState<string>(
    params.description
  );

  const [navlink, setNavlink] = React.useState<string>(params.navlink);

  // hooks
  React.useEffect(() => {
    if (params.count) setCount(params.count);
  }, [params.count]);

  React.useEffect(() => {
    if (params.description) setDescription(params.description);
  }, [params.description]);

  React.useEffect(() => {
    if (params.title) setTitle(params.title);
  }, [params.title]);

  React.useEffect(() => {
    if (params.navlink) setNavlink(params.navlink);
  }, [params.navlink]);

  return (
    <Card
      sx={{ minWidth: 275 }}
      style={{
        color: "white",
        background:
          "linear-gradient(90deg, #115E6E 0%, #115E6E 3%, #00b0ab 35%)",
      }}
    >
      <CardContent>
        {/* <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Word of the Day
        </Typography> */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ mb: 1.5, color: "white" }}>adjective</Typography>
          <Typography variant="h3" component="div" style={{ textAlign: "end" }}>
            {count}
          </Typography>
        </div>
        <Typography variant="body2">
          {title}
          <br />
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" type="button" onClick={params.clickHandler}>
          {navlink}
        </Button>
      </CardActions>
    </Card>
  );
}
