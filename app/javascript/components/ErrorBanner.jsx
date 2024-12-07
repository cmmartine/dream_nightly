import React from "react";

export default function ErrorBanner(props) {
  const { currentError } = props;

  if(currentError !== null) {
    return(
      <div id="error-banner">
        <h1>Something went wrong</h1>
        <p>Sorry, an unexpected error has occured. Please try refreshing the page.</p>
        <p>{`${currentError}`}</p>
      </div>
    );
  };
}