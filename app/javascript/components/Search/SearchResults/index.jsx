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
    clearSearch,
    setError
  } = props;

  const setUpSearchResults = () => {
    if (foundDreamsCount === 0) {
      return <div>No results were found. Please try a different search phrase.</div>
    };

    const foundDreamsList = foundDreams.map((dream) => {
      return(
        <SearchResultsRow
          key={dream.id}
          dreamInfo={dream}
          setError={setError}
        />
      );
    });

    return <ul className='search-results-list'>{foundDreamsList}</ul>
  };

  return(
    <div className='search-results-container'>
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
        foundDreamsCount={foundDreamsCount}
      />
    </div>
  );
} 