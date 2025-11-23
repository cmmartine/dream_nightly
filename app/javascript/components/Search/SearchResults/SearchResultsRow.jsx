import React from "react";
import { useState } from "react";
import { formatDateStringFromBackendMs } from "../../../util/dateTimeFormatUtil";
import Dream from "../../Dream";

export default function SearchResultsRow(props) {
  const {
    dreamInfo,
    handleDreamDeletion,
    setError
  } = props;

  const [expanded, setExpanded] = useState(false);

  const handleSearchRowExpandClick = () => {
    setExpanded((prev) => !prev);
  };

  if (!expanded) {
    return(
      <div className='dream-container search-row-container'>
        <div className='search-dream-date'>{formatDateStringFromBackendMs(dreamInfo.dreamed_at)}</div>
        <div className='dream-body search-row-dream-body'>{dreamInfo.body}</div>
        <button className='expand-btn lucide--expand' onClick={handleSearchRowExpandClick}/>
      </div>
    );
  } else {
    return(
      <Dream
        dreamInfo={dreamInfo}
        isSearch={true}
        handleSearchRowExpandClick={handleSearchRowExpandClick}
        removeDreamFromPage={handleDreamDeletion}
        setError={setError}
      />
    )
  }
}