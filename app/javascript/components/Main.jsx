import React from "react";
import { useState, useEffect } from "react";
import { getUserStatus } from "../api/usersApi";
import InfoPage from "./InfoPage";
import Dropdown from "./Dropdown";

export default function Main() {
  const [userStatus, setUserStatus] = useState(false);

  useEffect(() => {
    checkUserLoggedInStatus();
  }, []);

  function checkUserLoggedInStatus() {
    getUserStatus().then((data) => {
      setUserStatus(data.status);
    })
  };

  if(userStatus == false) {
    return(
      <InfoPage/>
    );
  } else if (userStatus == true) {
    return(
      <div>
        <Dropdown/>
      </div>
    );
  }
};