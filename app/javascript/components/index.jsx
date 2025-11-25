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
    if(userStatus.logged_in == false) {
      return(
        <div className='main-container'>
          <NavBar userStatus={false}/>
          <ErrorBanner />
          <LandingPage/>
          <Footer/>
        </div>
      );
    } else if (userStatus.logged_in == true) {
      return(
          <div className='main-container'>
            <NavBar userStatus={true}/>
            <ErrorBanner />
            {children}
            <Footer/>
          </div>
      );
    }
  }
};