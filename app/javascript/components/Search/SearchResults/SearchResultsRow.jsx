import React from "react";

export default function SearchResultsRow(props) {
  const {
    dream,
  } = props;

  return(
    <div>
      {dream.id}
    </div>
  );
}