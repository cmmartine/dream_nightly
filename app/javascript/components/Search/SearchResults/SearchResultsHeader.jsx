import React from "react";

export default function SearchResultsHeader(props) {
  const {
    activeSearchPhrase,
    foundDreamsCount,
    clearSearch
  } = props;

  return(
    <div>
      <span>{foundDreamsCount} dreams containing {activeSearchPhrase} on this page</span>
      <button onClick={(e) => {
        e.preventDefault();
        clearSearch()
      }}>Clear search</button>
    </div>
  );
}