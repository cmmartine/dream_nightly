import React from "react";
import { redirectToHome } from "../api/usersApi";

export default function NotFound() {
  return(
    <div className='not-found-page'>
      <h1>404 - Page Not Found</h1>
      <p>The page you were looking for doesn't exist.</p>
      <h3 className='link-btn' onClick={() => {
        redirectToHome();
      }}>Go to home page</h3>
    </div>
  )
};