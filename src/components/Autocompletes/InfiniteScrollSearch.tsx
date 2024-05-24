import Autocomplete, { AutocompleteRenderOptionState } from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { throttle } from 'lodash';
import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { User, UserView, getViewFromModelUser } from '../../models/User';
import { makeHttpCall } from '../../services/ApiService';
import store from '../../services/GlobalStateService';
import { ENTITY_NAME, HTTP_METHOD, OPERATION } from '../../types/enums';
import { HttpGetAllRequestBody, HttpRequestData, HttpResponseGetAll } from '../../types/httpTypes';
import { useNavigate } from 'react-router-dom';

const DEFAULT_PAGE_SIZE = 20;

// State Variables
interface Option {
  label: string;
  value: string;
}

const InfiniteScrollSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string>('');
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listboxRef = useRef<HTMLUListElement | null>(null);

  // Hooks
 
  // API Functions
  const getDataAll = useCallback(async (reset = false) => {
    setLoading(true);
    const offset = reset ? 0 : options.length;
    const requestDataAll: HttpRequestData<HttpGetAllRequestBody> = {
      entityName: ENTITY_NAME.USER,
      method: HTTP_METHOD.POST,
      operation: OPERATION.GET_ALL,
      body: {
        filters: [{
          column_name: 'username',
          operator: 'LIKE',
          value: searchValue,
        }],
        sorts: [],
        pageNumber: offset,
        pageSize: DEFAULT_PAGE_SIZE,
      },
    };

    try {
      const fetchData: HttpResponseGetAll<User> = await makeHttpCall<
        HttpResponseGetAll<User>,
        HttpGetAllRequestBody
      >(requestDataAll, store, navigate);

      const newOptions = fetchData.data
        ? fetchData.data.map((row: User) => {
            const data: UserView = getViewFromModelUser(row);
            return { label: data.username, value: data.id };
          })
        : [];

      setOptions((prevOptions) => reset ? newOptions : [...prevOptions, ...newOptions]);
      setHasMore(fetchData.totalCount > offset + newOptions.length);
    } catch (error) {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [navigate, options.length, searchValue]);

  // Event Handler Functions
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      getDataAll();
    }
  }, [loading, hasMore, getDataAll]);

  const handleScroll = useCallback(throttle(() => {
    if (listboxRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listboxRef.current;
      if (scrollHeight - scrollTop === clientHeight) {
        loadMore();
      }
    }
  }, 200), [loadMore]);

  useEffect(() => {
    return () => {
      handleScroll.cancel();
    };
  }, [handleScroll]);

  useEffect(() => {
    if (searchValue.trim() === '') {
      setOptions([]);
      setHasMore(true);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setOptions([]);
      getDataAll(true);
    }, 500);

    // Cleanup on unmount
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchValue, getDataAll]);


  const renderOption = (props: React.HTMLAttributes<HTMLLIElement>, option: Option, state: AutocompleteRenderOptionState) => {
    console.log(state.index);
    return (
      <li {...props} key={option.value}>
        {option.label}
      </li>
    );
  };

  // UI Code Block
  const ListboxComponent = useMemo(
    () =>
      forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>((props, ref) => (
        <ul
          {...props}
          ref={(node) => {
            listboxRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              (ref as React.MutableRefObject<HTMLUListElement | null>).current = node;
            }
          }}
          style={{ maxHeight: 300, overflow: 'auto' }}
          onScroll={handleScroll}
        />
      )),
    [handleScroll]
  );

  return (
    <Autocomplete<Option, false, false, false>
      options={options}
      getOptionLabel={(option) => option.label}
      loading={loading}
      loadingText={<CircularProgress size={20} />}
      noOptionsText="No options found"
      onInputChange={(event, newValue) => {
        console.log(event.isTrusted);
        setSearchValue(newValue);
      }}
      renderInput={(params) => <TextField {...params} label="Search" variant="outlined" />}
      renderOption={renderOption}
      ListboxComponent={ListboxComponent}
    />
  );
};

export default InfiniteScrollSearch;
