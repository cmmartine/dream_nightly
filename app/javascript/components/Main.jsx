import React from "react";
import { useState, useEffect } from "react";
import { getUserStatus } from "../api/usersApi";
import InfoPage from "./InfoPage";
import Dropdown from "./Dropdown";
import DreamsPage from "./DreamsPage";
import ErrorBanner from "./ErrorBanner";

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
      <div className="loading">loading...</div>
    )
  } else {
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
          <DreamsPage setError={setError}/>
        </div>
      );
    }
  }
};