import React from "react";
import DateRangeCalendar from "./DateRangeCalendar";

export default function SearchForm(props) {
  const {
    searchValue,
    setSearchValue,
    setStartDateInMs,
    setEndDateInMs,
    loading,
    minSearchLength,
    showValidationMsg,
    validateInputLength,
    isValidSearch,
    fetchSearch
  } = props;

  return(
    <form
      id='search-form'
      onSubmit={(e) => {
        e.preventDefault();
        fetchSearch(1)
      }}
    >
      <div className='search-input-container'>
        <input
          id='search-input'
          type='search'
          value={searchValue}
          onChange={(e) => {
            e.preventDefault();
            const newValue = e.target.value;
            setSearchValue(newValue);
            validateInputLength(newValue);
          }}
          onBlur={() => validateInputLength(searchValue)}
          aria-describedby='search-validation-msg'
        />
        {
          showValidationMsg && 
          <span
            id='search-validation-msg'
            role='alert'
            aria-live='polite'
          >
            Please enter at least {minSearchLength} characters
          </span>
        }
      </div>
      <DateRangeCalendar
        setDateTimeInMs={setStartDateInMs}
        calendarType='start'
      />
      <DateRangeCalendar
        setDateTimeInMs={setEndDateInMs}
        calendarType='end'
      />
      <button className='gen-btn' disabled={!isValidSearch() || loading}>Search</button>
    </form>
  );
}