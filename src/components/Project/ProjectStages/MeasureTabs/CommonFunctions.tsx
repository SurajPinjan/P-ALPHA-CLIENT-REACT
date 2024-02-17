import { randomArrayItem } from "@mui/x-data-grid-generator";

// import AddIcon from '@mui/icons-material/Add';
import { GridColDef } from "@mui/x-data-grid";

const roles = ["Morning Shift", "Afternoon Shift", "Night Shift"];
export const randomRole = () => {
  return randomArrayItem(roles);
};
const machine = ["Machine 1", "Machine 2", "Machine 3"];
export const randomMachine = () => {
  return randomArrayItem(machine);
};

export const columns: GridColDef[] = [
  {
    field: "joinDate",
    headerName: "Audit Date",
    type: "date",
    width: 180,
    editable: true,
  },
  { field: "name", headerName: "Operator", width: 180, editable: true },
  {
    field: "role",
    headerName: "Shift",
    width: 220,
    editable: true,
    type: "singleSelect",
    valueOptions: ["Morning Shift", "Afternoon Shift", "Night Shift"],
  },
  {
    field: "machine",
    headerName: "Machine Selected",
    width: 220,
    editable: true,
  },
];
