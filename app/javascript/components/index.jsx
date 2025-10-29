import React from "react";
import { useState } from "react"
import { useUserStatus } from "./context/providers/UserStatusProvider";
import NavBar from "./NavBar";
import Footer from "./Footer";
import LandingPage from "./LandingPage";
import DreamsPage from "./DreamsPage";
import ErrorBanner from "./ErrorBanner";

export default function Main() {
  const userStatus = useUserStatus();
  const [error, setError] = useState(null);


  if (userStatus == 'loading') {
    return(
      <div className="loading-container">
        <span className="loading" />
      </div>
    )
  } else {
    if(userStatus == false) {
      return(
        <div className='main-container'>
          <NavBar userStatus={userStatus}/>
          <ErrorBanner currentError={error}/>
          <LandingPage/>
          <Footer/>
        </div>
      );
    } else if (userStatus == true) {
      return(
          <div className='main-container'>
            <NavBar userStatus={userStatus}/>
            <ErrorBanner currentError={error}/>
            <DreamsPage setError={setError}/>
            <Footer/>
          </div>
      );
    }
  }
};