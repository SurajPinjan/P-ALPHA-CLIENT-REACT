import { Box } from "@mui/material";
import { GridRowsProp } from "@mui/x-data-grid";
import PermissionGrid from "./Project/PermissionGrid";
import RoleGrid from "./Project/RoleGrid";
import UserGridWithState from "../commons/Grids/UserGrid";

export interface Page {
  isLoading: boolean;
  data: GridRowsProp;
  total: number;
  page: number;
  pageSize: number;
}

const RolePermissions: React.FC = () => {
  //   dom

  return (
    <>
      <Box
        sx={{
          height: "auto",
          width: "100%",
          "& .actions": {
            color: "text.secondary",
          },
          "& .textPrimary": {
            color: "text.primary",
          },
        }}
      >
        <UserGridWithState></UserGridWithState>
      </Box>
      <Box
        sx={{
          height: "auto",
          width: "100%",
          "& .actions": {
            color: "text.secondary",
          },
          "& .textPrimary": {
            color: "text.primary",
          },
        }}
      >
        <PermissionGrid></PermissionGrid>
        <RoleGrid></RoleGrid>
      </Box>
    </>
  );
};

export default RolePermissions;
