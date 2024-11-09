import React from "react";
import { useState, useEffect } from "react";
import { getUserStatus } from "../api/usersApi";

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
      <div>User not logged in</div>
    );
  } else if (userStatus == true) {
    return(
      <div>User is logged in</div>
    );
  }
};