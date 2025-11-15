import React from "react";
import { useState } from "react";
import { formatDateStringFromBackendMs, formatTimeFromBackendMs } from "../../../util/dateTimeFormatUtil";

export default function SearchResultsRow(props) {
  const {
    dream,
  } = props;

  return(
    <div className='dream-container search-row-container'>
      <div className='search-dream-date'>{formatDateStringFromBackendMs(dream.dreamed_at)}</div>
      <div className='dream-body search-row-dream-body'>{dream.body}</div>
      <button className='expand-btn lucide--expand'/>
    </div>
  );
}