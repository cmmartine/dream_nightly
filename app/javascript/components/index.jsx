import React from "react";
import { useUserStatus } from "./context/providers/UserStatusProvider";
import NavBar from "./NavBar";
import Footer from "./Footer";
import LandingPage from "./LandingPage";
import ErrorBanner from "./ErrorBanner";
import LoadingSpinner from "./LoadingSpinner";

export default function Main({ children }) {
  const userStatus = useUserStatus();


  if (userStatus == 'loading') {
    return(
      <LoadingSpinner loading={true}/>
    )
  } else {
    if(userStatus == false) {
      return(
        <div className='main-container'>
          <NavBar userStatus={userStatus}/>
          <ErrorBanner />
          <LandingPage/>
          <Footer/>
        </div>
      );
    } else if (userStatus == true) {
      return(
          <div className='main-container'>
            <NavBar userStatus={userStatus}/>
            <ErrorBanner />
            {children}
            <Footer/>
          </div>
      );
    }
  }
};