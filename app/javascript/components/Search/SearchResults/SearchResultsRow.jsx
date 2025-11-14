import React from "react";
import { useState } from "react";
import { formatDateStringFromBackendMs, formatTimeFromBackendMs } from "../../../util/dateTimeFormatUtil";

export default function SearchResultsRow(props) {
  const {
    dream,
  } = props;

  return(
    <div className='dream-container'>
      <div className='dream-top-row-container'>
        <div className='search-datetime-container'>
          {/* Make separate component for the time and date, combined with this div container from Dream */}
          <div>{formatDateStringFromBackendMs(dream.dreamed_at)}</div>
          <div>{formatTimeFromBackendMs(dream.dreamed_at)}</div>
        </div>
        <button className='expand-btn lucide--edit'/>
      </div>
      <div className='dream-body search-row-dream-body'>{dream.body}</div>
    </div>
  );
}