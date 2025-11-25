import React, { createContext, useContext, useEffect, useState } from "react";
import { getUserStatus } from "../../../api/usersApi";
import { useVisibility } from "./VisibilityProvider";

const UserStatusContext = createContext();

export function UserStatusProvider({ children }) {
  const [userStatus, setUserStatus] = useState('loading');
  const isVisible = useVisibility();

  useEffect(() => {
    if(isVisible) {
      checkUserLoggedInStatus();
    };
   }, [isVisible]);

  const updateCsrfToken = (token) => {
    const csrfHeadMeta = document.querySelector("meta[name='csrf-token']");
    csrfHeadMeta.setAttribute("content", token)
  };
 
   async function checkUserLoggedInStatus() {
    const status = await getUserStatus();
    setUserStatus(status);
    updateCsrfToken(status.token);
   };

  return(
    <UserStatusContext.Provider value={userStatus}>
      {children}
    </UserStatusContext.Provider>
  )
}

export function useUserStatus() {
  return useContext(UserStatusContext);
};