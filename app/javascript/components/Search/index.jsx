import React from "react";
import SearchForm from "./SearchForm";
import SearchResults from "./SearchResults";
import { useSearch } from "./hooks/useSearch";
import LoadingSpinner from "../LoadingSpinner";

export default function SearchPage() {
  const search = useSearch();

  return(
    <div className='search-page-container'>
      <SearchForm {...search}/>
      {search.loading && <LoadingSpinner loading={search.loading}/>}
      {!search.loading && search.activeSearchPhrase && <SearchResults {...search}/>}
    </div>
  );
}