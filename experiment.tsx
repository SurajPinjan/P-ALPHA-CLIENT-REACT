// filter

import * as React from "react";
import { DataGrid, GridFilterModel } from "@mui/x-data-grid";
import { createFakeServer } from "@mui/x-data-grid-generator";

const { useQuery, ...data } = createFakeServer();

export default function ServerFilterGrid() {
  const [queryOptions, setQueryOptions] = React.useState({});

  const onFilterChange = React.useCallback((filterModel: GridFilterModel) => {
    // Here you save the data you need from the filter model
    setQueryOptions({ filterModel: { ...filterModel } });
  }, []);

  const { isLoading, rows } = useQuery(queryOptions);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        {...data}
        rows={rows}
        filterMode="server"
        onFilterModelChange={onFilterChange}
        loading={isLoading}
      />
    </div>
  );
}


// pagination 

import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { createFakeServer } from '@mui/x-data-grid-generator';

const SERVER_OPTIONS = {
  useCursorPagination: false,
};

const { useQuery, ...data } = createFakeServer({}, SERVER_OPTIONS);

export default function ServerPaginationGrid() {
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });

  const { isLoading, rows, pageInfo } = useQuery(paginationModel);

  // Some API clients return undefined while loading
  // Following lines are here to prevent `rowCountState` from being undefined during the loading
  const [rowCountState, setRowCountState] = React.useState(
    pageInfo?.totalRowCount || 0,
  );
  React.useEffect(() => {
    setRowCountState((prevRowCountState) =>
      pageInfo?.totalRowCount !== undefined
        ? pageInfo?.totalRowCount
        : prevRowCountState,
    );
  }, [pageInfo?.totalRowCount, setRowCountState]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        {...data}
        rowCount={rowCountState}
        loading={isLoading}
        pageSizeOptions={[5]}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
      />
    </div>
  );
}

// sorting

import * as React from 'react';
import { DataGrid, GridSortModel } from '@mui/x-data-grid';
import { UseDemoDataOptions, createFakeServer } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

const DATASET_OPTION: UseDemoDataOptions = {
  dataSet: 'Employee',
  visibleFields: VISIBLE_FIELDS,
  rowLength: 100,
};

const { useQuery, ...data } = createFakeServer(DATASET_OPTION);

export default function ServerSortingGrid() {
  const [queryOptions, setQueryOptions] = React.useState({});

  const handleSortModelChange = React.useCallback((sortModel: GridSortModel) => {
    // Here you save the data you need from the sort model
    setQueryOptions({ sortModel: [...sortModel] });
  }, []);

  const { isLoading, rows } = useQuery(queryOptions);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        {...data}
        sortingMode="server"
        onSortModelChange={handleSortModelChange}
        loading={isLoading}
      />
    </div>
  );
}
