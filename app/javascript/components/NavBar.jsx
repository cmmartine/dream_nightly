import React from "react";
import Dropdown from "./Dropdown";
import { redirectToSignIn, redirectToSignUp } from "../api/usersApi";
import { appName } from "../constants/appInfo";

export default function NavBar(props) {
  const { userStatus } = props;

  return(
    <nav>
      <h1>{appName}</h1>
      {
        userStatus && <Dropdown/>
      }
      {
        !userStatus && 
        <div className="session-btns-container">
          <button className="gen-btn session-btn" onClick={() => {
            redirectToSignIn();
          }}>
            Sign In
          </button>
          <button className="gen-btn session-btn" onClick={() => {
            redirectToSignUp();
          }}>
            Sign Up
          </button>
        </div>
      }
    </nav>
  )
}