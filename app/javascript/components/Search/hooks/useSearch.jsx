import React, { useState, useRef } from "react";
import { getSearchDreams } from "../../../api/dreamsApi";
import { useErrorContext } from "../../context/providers/ErrorProvider";
import * as MAX_COUNTS from "../../../constants/shared/MAX_COUNTS.json";

export const useSearch = () => {
  const { setError } = useErrorContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [startDateInMs, setStartDateInMs] = useState();
  const [endDateInMs, setEndDateInMs] = useState();
  const [activeSearchPhrase, setActiveSearchPhrase] = useState('');
  const [foundDreams, setFoundDreams] = useState([]);
  const [foundDreamsCount, setFoundDreamsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showValidationMsg, setShowValidationMsg] = useState(false);

  const validateTimeoutRef = useRef(null);
  const fetchTimeoutRef = useRef(null);

  const minSearchLength = MAX_COUNTS.MIN_SEARCH_LENGTH;

  const validateInputLength = (value) => {
    if(validateTimeoutRef?.current) {
      clearTimeout(validateTimeoutRef.current)
    }

    if(value.length === 0 || value.length >= minSearchLength) {
      setShowValidationMsg(false);
      return;
    }

    validateTimeoutRef.current = setTimeout(() => {
      setShowValidationMsg(true);
    }, 500);
  };

  const isValidSearch = () => {
    return (!searchValue || searchValue.length >= minSearchLength) && searchValue != activeSearchPhrase
  };

  const fetchSearch = (page) => {
    if(fetchTimeoutRef?.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    fetchTimeoutRef.current = setTimeout(async () => {
      setCurrentPage(page)
      setActiveSearchPhrase(searchValue);
      setLoading(true);

      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const data = await getSearchDreams(
        {
          from_date: startDateInMs,
          to_date: endDateInMs,
          search_phrase: searchValue,
          page: page,
          user_timezone: userTimeZone 
        },
        setError
      );

      setFoundDreams(data.dreams || []);
      // Count only for current page
      setFoundDreamsCount(data.count || 0);
      setLoading(false);
    }, 500);
  };

  return {
    currentPage,
    searchValue,
    setSearchValue,
    setStartDateInMs,
    setEndDateInMs,
    foundDreams,
    foundDreamsCount,
    loading,
    minSearchLength,
    showValidationMsg,
    validateInputLength,
    isValidSearch,
    fetchSearch
  };
};