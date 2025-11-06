import React from "react";

export default function LoadingSpinner({ loading }) {
  if(loading) {
    return(
      <div className="loading-container" data-testid='loading-container'>
        <span className="loading"/>
      </div>
    )
  }
};