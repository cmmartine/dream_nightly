import React from "react";
import { useState, useEffect } from "react";
import { getUserStatus } from "../api/usersApi";
import InfoPage from "./InfoPage";
import Dropdown from "./Dropdown";
import ErrorBanner from "./ErrorBanner";

export default function Main() {
  const [userStatus, setUserStatus] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUserLoggedInStatus();
  }, []);

  async function checkUserLoggedInStatus() {
    getUserStatus(setUserStatus, setError);
  };

if(userStatus == false) {
    return(
      <div>
        <ErrorBanner currentError={error}/>
        <InfoPage/>
      </div>
    );
  } else if (userStatus == true) {
    return(
      <div>
        <ErrorBanner currentError={error}/>
        <Dropdown/>
      </div>
    );
  }
};