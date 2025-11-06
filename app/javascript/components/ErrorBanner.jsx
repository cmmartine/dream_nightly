import React from "react";
import { errorPageText } from "../constants/errors";
import { useErrorContext } from "./context/providers/ErrorProvider";

export default function ErrorBanner() {
  const { error } = useErrorContext();

  if(error !== null) {
    return(
      <div id="error-banner">
        <h1>{errorPageText.header}</h1>
        <p>{errorPageText.body}</p>
        <p>{`${error.message}`}</p>
      </div>
    );
  };
}