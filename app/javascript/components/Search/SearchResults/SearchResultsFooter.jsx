import React from "react";
import { searchTypes } from "../../../constants/searchTypes";

export default function SearchResultsFooter(props) {
  const {
    currentPage,
    hasNextPage,
    fetchSearch
  } = props;

  return(
    <div>
      {
        currentPage - 1 > 0 &&
        <button
          aria-label={`Go to page ${currentPage - 1} results`}
          onClick={((e) => {
            e.preventDefault();
            fetchSearch(currentPage - 1, searchTypes.PAGE_CHANGE);
          })}
        >
          {currentPage - 1}
        </button>
      }
      <span aria-label={`Current page number: ${currentPage}`}>{currentPage}</span>
      {
        hasNextPage &&
        <button
          aria-label={`Go to page ${currentPage + 1} results`}
          onClick={((e) => {
            e.preventDefault();
            fetchSearch(currentPage + 1, searchTypes.PAGE_CHANGE);
          })}
        >
          {currentPage + 1}
        </button>
      }
    </div>
  );
}