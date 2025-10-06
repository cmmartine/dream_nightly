import React from "react";

export default function NotFound() {
  return(
    <div className='not-found-page'>
      <h1>404 - Page Not Found</h1>
      <p>The page you were looking for doesn't exist.</p>
      <a className='link-btn' href='/'>Go to home page</a>
    </div>
  )
};