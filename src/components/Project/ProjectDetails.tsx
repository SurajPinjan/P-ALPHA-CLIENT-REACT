import { Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import "../../App.css";
import React from "react";
import ProjectSideMenu from "./ProjectSideMenu";
// import CreateIcon from '@mui/icons-material/Create';

// tabs
export const Panel = (props: {
  value: unknown;
  index: unknown;
  children:
    | string
    | number
    | boolean
    | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
    | Iterable<React.ReactNode>
    | React.ReactPortal
    | null
    | undefined;
}) => (
  <div hidden={props.value !== props.index}>
    <Typography>{props.children}</Typography>
  </div>
);
//tabs

export const DemoPaper = styled(Paper)(({ theme }) => ({
  width: "50%", // Enclose the value in quotes
  height: "300px",
  padding: theme.spacing(2),
  ...theme.typography.body2,
  textAlign: "center",
  margin: "2rem 0 !important",
}));

function ProjectDetails() {
  return (
    <>
      <ProjectSideMenu></ProjectSideMenu>
    </>
  );
}

export default ProjectDetails;
