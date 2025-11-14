import React from "react";
import SearchResultsHeader from "./SearchResultsHeader";
import SearchResultsRow from "./SearchResultsRow";
import SearchResultsFooter from "./SearchResultsFooter";

export default function SearchResults(props) {
  const {
    currentPage,
    activeSearchPhrase,
    foundDreams,
    foundDreamsCount,
    hasNextPage,
    fetchSearch,
    clearSearch
  } = props;

  const setUpSearchResults = () => {
    if (foundDreamsCount === 0) {
      return <div>No results were found. Please try a different search phrase.</div>
    };

    const foundDreamsList = foundDreams.map((dream) => {
      return(
        <SearchResultsRow
          key={dream.id}
          dream={dream}
        />
      );
    });

    return <ul>{foundDreamsList}</ul>
  };

  return(
    <div>
      <SearchResultsHeader
        activeSearchPhrase={activeSearchPhrase}
        foundDreamsCount={foundDreamsCount}
        clearSearch={clearSearch}
      />
      {setUpSearchResults()}
      <SearchResultsFooter
        currentPage={currentPage}
        hasNextPage={hasNextPage}
        fetchSearch={fetchSearch}
      />
    </div>
  );
} 