import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, UserView, getViewFromModelUser } from '../../models/User'
import { makeHttpCall } from '../../services/ApiService'
import store from '../../services/GlobalStateService'
import { ENTITY_NAME, HTTP_METHOD, OPERATION } from '../../types/enums'
import { Filter } from '../../types/filterTypes'
import { HttpGetAllRequestBody, HttpRequestData, HttpResponseGetAll } from '../../types/httpTypes'
import InfiniteScrollSearch from './InfiniteScrollSearch'
import { SelectOptionProps } from './SelectTypes'
import useIntersectionObserver from './useIntersectionObserver'

const LIMIT = 5

interface ScrollPageProps {
onChange: (value: string) => void,
selectedOption: SelectOptionProps
}

function ScrollPage(props: ScrollPageProps) {
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState<SelectOptionProps>({ label: '', value: '' })
    const [userOptions, setUserOptions] = useState<SelectOptionProps[]>([])
    const [isFetchingUsers, setIsFetchingUsers] = useState(true)
    const [totalItems, setTotalItems] = useState(0)
    const [searchInput, setSearchInput] = useState('')
    const [debouncedSearchInput, setDebouncedSearchInput] = useState('')

    const handleSelect = (option: SelectOptionProps) => {
        setSearchInput(option?.label)
        setSelectedOption(option)
    }

    const transformUsersToSelectOptions = (users: UserView[]) => {
        if (!users) return []

        return users.map((user) => {
            return {
                label: `${user.username}`,
                value: user.id,
            }
        })
    }

    const { lastEntryRef, setHasMore, setPage, page } = useIntersectionObserver(isFetchingUsers)

    useEffect(() => {
        if (totalItems === 0) return
        if (!isFetchingUsers) {
            setHasMore(userOptions?.length < totalItems)
        }
    }, [userOptions, totalItems, setHasMore, isFetchingUsers])

    // const getSkipValue = () => {
    //     return (page - 1) * LIMIT
    // }

    // const getApiUrl = () => {
    //     if (debouncedSearchInput) {
    //         return `https://dummyjson.com/users/search?q=${debouncedSearchInput}&limit=${LIMIT}&skip=${getSkipValue()}`
    //     } else {
    //         return `https://dummyjson.com/users?limit=${LIMIT}&skip=${getSkipValue()}`
    //     }
    // }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setUserOptions([])
            setPage(1)
            setDebouncedSearchInput(searchInput)
        }, 500) // delay fetching by 500ms

        return () => {
            clearTimeout(timeoutId)
        }
    }, [searchInput, setPage, setDebouncedSearchInput, setUserOptions])

    // const fetchAndSetUsers = async () => {
    //     try {
    //         setIsFetchingUsers(true)
    //         const response = await fetch(getApiUrl())
    //         const data = await response.json()

    //         if (page === 1) setUserOptions([])

    //         setUserOptions((prev) => [...prev, ...transformUsersToSelectOptions(data?.users)])
    //         setTotalItems(data?.total)
    //     } catch (error) {
    //         alert('Something went wrong')
    //         console.log({ error })
    //     } finally {
    //         setIsFetchingUsers(false)
    //     }
    // }

    const getDataAll = useCallback(async () => {
        const filterArray: Filter[] = [];

        if (debouncedSearchInput) {
            filterArray.push({
                column_name: 'username',
                operator: 'LIKE',
                value: debouncedSearchInput,
            });
        }

        const requestDataAll: HttpRequestData<HttpGetAllRequestBody> = {
            entityName: ENTITY_NAME.USER,
            method: HTTP_METHOD.POST,
            operation: OPERATION.GET_ALL,
            body: {
                filters: filterArray,
                sorts: [],
                pageSize: LIMIT,
                pageNumber: page - 1,
            },
        };

        const fetchData: HttpResponseGetAll<User> = await makeHttpCall<
            HttpResponseGetAll<User>,
            HttpGetAllRequestBody
        >(requestDataAll, store, navigate);

        const dat: UserView[] = fetchData.data
            ? fetchData.data.map((row: User) => {
                const data: UserView = getViewFromModelUser(row);
                return data;
            })
            : [];

        if (page === 1) setUserOptions([])

        setUserOptions((prev) => [...prev, ...transformUsersToSelectOptions(dat)])
        setTotalItems(fetchData.totalCount)

        setIsFetchingUsers(false);

    }, [navigate,debouncedSearchInput, page, setIsFetchingUsers]);

    useEffect(() => {
        // fetchAndSetUsers()
        getDataAll()
    }, [page, getDataAll, debouncedSearchInput])

    useEffect(() => {
        if(selectedOption)
        props.onChange(selectedOption.label);
    }, [selectedOption, props.onChange])


    useEffect(() => {
        setSelectedOption(props.selectedOption);
    }, [props.selectedOption])

    return (

        <div style={{ padding: 20 }}>
            <div style={{ display: 'block', width: 200 }} >
                <span className='block mb-2 text-sm'></span>
               <InfiniteScrollSearch
                    options={userOptions}
                    selected={selectedOption}
                    placeholder='Select user'
                    handleSelect={handleSelect}
                    isFetchingOptions={isFetchingUsers}
                    lastOptionRef={lastEntryRef}
                    isSearchable={true}
                    setSearchInput={setSearchInput}
                    searchInput={searchInput}
                />
            </div>
        </div>
    )
}

export default ScrollPage