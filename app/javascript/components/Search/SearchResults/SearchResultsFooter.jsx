import React from "react";
import { searchTypes } from "../../../constants/searchTypes";

export default function SearchResultsFooter(props) {
  const {
    currentPage,
    hasNextPage,
    fetchSearch,
    foundDreamsCount
  } = props;

  if (foundDreamsCount > 0) {
    return(
      <div className='search-footer-container'>
        <div className='search-footer-btn-container'>
          {
            currentPage - 1 > 0 &&
            <button
              className='link-btn search-footer-item'
              aria-label={`Go to page ${currentPage - 1} results`}
              onClick={((e) => {
                e.preventDefault();
                fetchSearch(currentPage - 1, searchTypes.PAGE_CHANGE);
              })}
            >
              {currentPage - 1}
            </button>
            || <div className='search-footer-item'/>
          }
          <div className='search-footer-item search-footer-current-page' aria-label={`Current page number: ${currentPage}`}>{currentPage}</div>
          {
            hasNextPage &&
            <button
              className='link-btn search-footer-item'
              aria-label={`Go to page ${currentPage + 1} results`}
              onClick={((e) => {
                e.preventDefault();
                fetchSearch(currentPage + 1, searchTypes.PAGE_CHANGE);
              })}
            >
              {currentPage + 1}
            </button>
            || <div className='search-footer-item'/>
          }
        </div>
      </div>
    );
  }
}