import { FC, useState } from 'react'
import { SelectOptionProps, SelectProps } from './SelectTypes'
import useListenForOutsideClicks from './useListenForOutsideClicks'
import Loader from './Loader'
import { Box } from '@mui/material'


const Select: FC<SelectProps> = ({
  options,
  isFetchingOptions,
  lastOptionRef,
  isSearchable,
  searchInput,
  selected = { label: '', value: '' },
  placeholder = 'Select',
  handleSelect,
  setSearchInput,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const openDropdown = () => {
    setIsDropdownOpen(true)
  }

  const closeDropdown = () => {
    setIsDropdownOpen(false)
  }

  // const labelClassName = () => {
  //   return `block max-w-full capitalize truncate ${selected?.label ? 'text-text-tertiary' : 'text-neutral/400'}`
  // }

  // const optionClassName = (option: SelectOptionProps, index: number, isSelected: boolean) => {
  //   isSelected ||= selected?.value === option.value

  //   return `active:bg-background-selected-option relative cursor-default select-none py-2 px-4 ${options.length - 1 === index ? 'rounded-b-md' : ''
  //     } ${isSelected ? 'bg-secondary/blue/50' : ''} hover:bg-secondary/blue/50 mb-1 last-of-type:mb-[0] block text-left w-full`
  // }


  const optionStyle = (
    option: {
      value: string | number;
    },
    index: number,
    isSelected: boolean,
    options: {
      value: string | number;
    }[]
  ): React.CSSProperties => {
    const isLastOption = index === options.length - 1;
    const backgroundColor = isSelected ? 'rgba(59, 130, 246, 0.1)' : 'transparent'; // Replace with your theme colors
    // const hoverBackgroundColor = 'rgba(59, 130, 246, 0.1)'; 
    // Replace with your theme hover color

    console.log('option', option)

    const resp =  {
      position: 'relative',
      cursor: 'default',
      userSelect: 'none',
      padding: '0.5rem 1rem', // Equivalent to py-2 px-4
      marginBottom: isLastOption ? 0 : '0.25rem', // Equivalent to mb-1 last-of-type:mb-[0]
      textAlign: 'left', // Explicitly cast 'left' to satisfy TypeScript
      width: '100%',
      backgroundColor,
      borderBottomLeftRadius: isLastOption ? '0.25rem' : 0, // Equivalent to rounded-b-md
      borderBottomRightRadius: isLastOption ? '0.25rem' : 0, // Equivalent to rounded-b-md
    };

    return resp as React.CSSProperties;
  };

  const containerStyles = {
    padding: '8px 16px', // px-4 py-2
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '4px', // rounded
    width: '100%', // w-full
    fontFamily: 'Roboto, sans-serif', // font-normal
    border: '1px solid', // border border-solid
    borderColor: isDropdownOpen ? '#333' : '#e2e8f0', // border-neutral/200
    backgroundColor: 'transparent', // bg-transparent
    lineHeight: '20px', // leading-[20px]
    fontSize: '0.75rem', // text-xs
    color: '#333', // text-grey/900
  };

  const { elementRef } = useListenForOutsideClicks(closeDropdown)

  const renderNoOptions = () => {
    if (isFetchingOptions) return <Loader />

    return (
      <div style={{
        position: 'relative', // relative
        cursor: 'default', // cursor-default
        userSelect: 'none', // select-none
        paddingTop: '0.5rem', // py-2
        paddingBottom: '0.5rem', // py-2
        paddingLeft: '0.75rem', // pl-3
        paddingRight: '2.25rem', // pr-9
      }}>
        <span style={{
          fontWeight: 400, // font-normal
          display: 'block', // block
          overflow: 'hidden', // truncate
          textOverflow: 'ellipsis', // truncate
          whiteSpace: 'nowrap', // truncate
          fontSize: '0.875rem', // text-sm
          color: '#6B7280', // text-text-tertiary (adjust color value as needed)
        }}>No options here</span>
      </div>
    )
  }

  const renderOptions = (options: SelectOptionProps[]) => {
    return options?.length > 0
      ? options?.map((option, index) => {
        const isSelected = selected?.value === option.value

        return (
          <button
            type='button'
            key={String(option.value) + String(index)}
            // className={optionClassName(option, index, selected?.value === option.value)}
            style={optionStyle(option, index, isSelected, options)}
            onClick={() => {
              handleSelect(option)
              closeDropdown()
            }}
            ref={options?.length - 1 === index ? lastOptionRef : null}
          >
            <span
              title={option.label}
              style={{
                display: 'block',
                overflow: 'hidden', // truncate
                fontSize: '0.625rem', // text-[0.625rem]
                lineHeight: '0.8rem', // leading-[0.8rem]
                cursor: 'pointer',
                color: isSelected ? '#000' : '#6B7280', // text-shades/black : text-text-tertiary
                fontWeight: isSelected ? '600' : '400', // font-semibold : font-normal
              }}
            >
              {option.label}
            </span>
          </button>
        )
      })
      : renderNoOptions()
  }

  return (

    <Box sx={{ position: 'absolute', flexGrow: 1 }}>
      <button onClick={openDropdown} style={containerStyles}>
        {isSearchable ? (
          <input
            type='text'
            style={
              {
                display: 'block',
                color: '#6B7280', // text-text-tertiary
                width: '100%', // w-full
                outline: 'none',
              }
            }
            onChange={(ev) => {
              setSearchInput?.(ev.target.value)
            }}
            placeholder={placeholder}
            value={searchInput}
          />
        ) : (
          <span title={selected?.label} style={
            {
              display: 'block',
              maxWidth: '100%', // max-w-full
              textTransform: 'capitalize', // capitalize
              overflow: 'hidden', // truncate
              color: selected?.label ? '#6B7280' : '#9CA3AF', // text-text-tertiary : text-neutral/400
            }
          }>
            {selected?.label || placeholder}
          </span>
        )}
        <span style={{
          pointerEvents: 'none', // pointer-events-none
          marginLeft: '0.75rem', // ml-3
          display: 'flex',
          alignItems: 'center', // items-center
        }}>
          {/* <GreaterThanIcon className='rotate-90 text-[#96989A]' /> */}
          {`>`}
        </span>
      </button>

      {isDropdownOpen && (
        <div

          style={{
            position: 'absolute',
            zIndex: 1000,
            width: '100%', // w-full
            overflow: 'auto',
            borderRadius: '0 0 0.375rem 0.375rem', // rounded-b-md
            backgroundColor: '#F9FAFB', // bg-shades/white
            padding: '14px', // py-[14px]
            fontSize: '1rem', // text-base
            outline: 'none', // focus:outline-none
            marginTop: '0.25rem', // mt-1
            maxHeight: '160px', // max-h-40

            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.08)'
          }}
          ref={elementRef}
        >
          {renderOptions(options)}

          {isFetchingOptions && options?.length > 0 && <Loader />}
        </div>
      )}
    </Box>
  )
}

export default Select