import { MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { User, UserView, getViewFromModelUser } from '../../models/User';
import { makeHttpCall } from '../../services/ApiService';
import store from '../../services/GlobalStateService';
import { ENTITY_NAME, HTTP_METHOD, OPERATION } from '../../types/enums';
import { HttpRequestData, HttpGetAllRequestBody, HttpResponseGetAll } from '../../types/httpTypes';
import { useNavigate } from 'react-router-dom';
import { Filter } from '../../types/filterTypes';

interface Option {
  id: string;
  label: string;
}

export const InfiniteScrollSearch = () => {
  const [options, setOptions] = useState<Option[]>([]);
  const [currentPage, setCurrentPage] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const observer = useRef<IntersectionObserver | null>(null);
  const lastOptionRef = useRef<HTMLLIElement | null>(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async (page: number) => {

    const filters :Filter[] = [];

    if(searchQuery !== '') {
      filters.push({
        column_name: 'username',
        value: searchQuery,
        operator: 'LIKE',
      });
    }
    
    setIsLoading(true);
    const requestDataAll: HttpRequestData<HttpGetAllRequestBody> = {
      entityName: ENTITY_NAME.USER,
      method: HTTP_METHOD.POST,
      operation: OPERATION.GET_ALL,
      body: {
        filters: filters,
        sorts: [],
        pageNumber: page,
        pageSize: 20,
      },
    };

    try {
      const fetchData: HttpResponseGetAll<User> = await makeHttpCall<
        HttpResponseGetAll<User>,
        HttpGetAllRequestBody
      >(requestDataAll, store, navigate);

      const newOptions: Option[] = fetchData.data
        ? fetchData.data.map((row: User) => {
            const data: UserView = getViewFromModelUser(row);
            return { id: data.id, label: data.username}
          })
        : [];

        setOptions((prevOptions) => page === 0 ? newOptions : [...prevOptions, ...newOptions]);

      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [navigate, searchQuery]);

  useEffect(() => {
    setCurrentPage(0);
  }, []);

  useEffect(() => {
      fetchData(0);
  }, [searchQuery, fetchData]);

  useEffect(() => {
    if(currentPage)
    fetchData(currentPage);
  }, [currentPage, fetchData]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && !isLoading) {
        // setCurrentPage((prevPage) => prevPage + 1);
      }
    };

    observer.current = new IntersectionObserver(handleObserver);
    if (lastOptionRef.current) {
      observer.current.observe(lastOptionRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [isLoading]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(0); // Reset the current page when the search query changes
    };

  const setLastOptionRef = (element: HTMLLIElement | null) => {
    if (lastOptionRef.current) {
      observer.current?.unobserve(lastOptionRef.current);
    }
    if (element) {
      observer.current?.observe(element);
    }
    lastOptionRef.current = element;
  };

  return (
    <div>
      <TextField
        label="Search"
        value={searchQuery}
        onChange={handleSearch}
        variant="outlined"
        fullWidth
      />
      <Select fullWidth>
        {options.map((option, index) => (
          <MenuItem
            key={option.id}
            value={option.id}
            ref={index === options.length - 1 ? setLastOptionRef : null}
          >
            {option.label}
          </MenuItem>
        ))}
        {isLoading && <MenuItem disabled>Loading...</MenuItem>}
      </Select>
    </div>
  );
};
