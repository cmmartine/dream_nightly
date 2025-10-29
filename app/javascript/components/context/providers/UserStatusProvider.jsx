import React, { createContext, useContext, useEffect, useState } from "react";
import { getUserStatus } from "../../../api/usersApi";

const UserStatusContext = createContext();

export function UserStatusProvider({ children }) {
  const [userStatus, setUserStatus] = useState('loading');

  useEffect(() => {
     checkUserLoggedInStatus();
   }, []);
 
   async function checkUserLoggedInStatus() {
     const status = await getUserStatus();
     setUserStatus(status);
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