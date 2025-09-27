import React from "react";
import Dropdown from "./Dropdown";
import { appName } from "../constants/appInfo";

export default function NavBar(props) {
  const { userStatus } = props;

  return(
    <nav>
      <a id='navbar-title' className='link-btn' href='/'>{appName}</a>
      {
        userStatus && <Dropdown/>
      }
      {
        !userStatus && 
        <div className="session-btns-container">
          <a href='users/sign_in' className="link-btn" aria-label="Link to Sign In">
            Sign In
          </a>
          <a href='users/sign_up' className="link-btn" aria-label="Link to Sign Up">
            Sign Up
          </a>
        </div>
      }
    </nav>
  )
}