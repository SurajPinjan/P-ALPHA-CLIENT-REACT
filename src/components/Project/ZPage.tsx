import React from "react";
import ZGrid from "./ZGrid";
import { Grid } from "@mui/material";
import CountCard from "../CountCard";

interface ZGridWrapperProps {}

const ZGridWrapper: React.FC<ZGridWrapperProps> = () => {
  // constants

  // dom

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <CountCard
            count="100"
            title="Xs"
            navlink="Check Details"
            description="Number of xs currently in system"
            clickHandler={() => {
              alert("clicked");
            }}
          ></CountCard>
        </Grid>
        <Grid item xs={3}>
          <CountCard
            count="100"
            title="Ys"
            clickHandler={() => {
              alert("clicked");
            }}
            navlink="Check Details"
            description="Number of ys currently in system"
          ></CountCard>
        </Grid>
        <Grid item xs={3}>
          <CountCard
            count="100"
            title="Zs"
            clickHandler={() => {
              alert("clicked");
            }}
            navlink="Check Details"
            description="Number of zs currently in system"
          ></CountCard>
        </Grid>
        <Grid item xs={3}>
          <CountCard
            count="100"
            title="As"
            clickHandler={() => {
              alert("clicked");
            }}
            navlink="Check Details"
            description="Number of zs currently in system"
          ></CountCard>
        </Grid>
      </Grid>
      <ZGrid></ZGrid>
    </>
  );
};

export default ZGridWrapper;
