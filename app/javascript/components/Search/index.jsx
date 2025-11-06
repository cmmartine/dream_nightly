import React from "react";
import SearchForm from "./SearchForm";
import { useSearch } from "./hooks/useSearch";
import LoadingSpinner from "../LoadingSpinner";

export default function SearchPage() {
  const search = useSearch();

  return(
    <div>
      <SearchForm {...search}/>
      {search.loading && <LoadingSpinner loading={search.loading}/>}
    </div>
  );
}