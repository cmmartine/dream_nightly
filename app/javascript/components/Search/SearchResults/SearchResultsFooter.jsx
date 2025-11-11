import React from "react";

export default function SearchResultsFooter(props) {
  const {
    currentPage,
    fetchSearch
  } = props;

  return(
    <div>
      <span>{currentPage}</span>
    </div>
  );
}