import React from "react";
import { useState, useEffect } from "react";
import { getUserStatus } from "../api/usersApi";
import NavBar from "./NavBar";
import Footer from "./Footer";
import LandingPage from "./LandingPage";
import DreamsPage from "./DreamsPage";
import ErrorBanner from "./ErrorBanner";
import ContextProviderWrapper from "./context/ContextProviderWrapper";

export default function Main() {
  const [userStatus, setUserStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUserLoggedInStatus();
  }, []);

  async function checkUserLoggedInStatus() {
    const status = await getUserStatus(setError);
    setUserStatus(status);
    setLoading(false);
  };



  if (loading == true) {
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
        <ContextProviderWrapper>
          <div className='main-container'>
            <NavBar userStatus={userStatus}/>
            <ErrorBanner currentError={error}/>
            <DreamsPage setError={setError}/>
            <Footer/>
          </div>
        </ContextProviderWrapper>
      );
    }
  }
};