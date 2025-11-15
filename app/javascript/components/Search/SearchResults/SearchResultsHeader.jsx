import React from "react";

export default function SearchResultsHeader(props) {
  const {
    activeSearchPhrase,
    foundDreamsCount,
    clearSearch
  } = props;

  return(
    <div className='search-header-container'>
      <span>{foundDreamsCount} dreams containing {activeSearchPhrase} on this page</span>
      <button
        className='gen-btn search-clear-btn'
        onClick={(e) => {
          e.preventDefault();
          clearSearch()
        }}>
        Clear search
      </button>
    </div>
  );
}