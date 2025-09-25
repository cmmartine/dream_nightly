import React from "react";
import { errorPageText } from "../constants/errorPage";

export default function ErrorBanner(props) {
  const { currentError } = props;

  if(currentError !== null) {
    return(
      <div id="error-banner">
        <h1>{errorPageText.header}</h1>
        <p>{errorPageText.body}</p>
        <p>{`${currentError.message}`}</p>
      </div>
    );
  };
}