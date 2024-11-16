import React from "react";
import { useState } from "react";
import { logout } from "../api/usersApi";

export default function Dropdown() {
  const [openDropdown, setOpenDropdown] = useState(false);

  if(!openDropdown) {
    return(
      <nav role="navigation" className="dropdown dropdown-closed">
        <div className="dropdown-btn-container">
          <button className="dropdown-btn" onClick={(e) => {
            e.preventDefault();
            setOpenDropdown(!openDropdown);
          }}>
            <span className="hamburger-icon-line top-line"/>
            <span className="hamburger-icon-line"/>
            <span className="hamburger-icon-line"/>
          </button>
        </div>
      </nav>
    );
  } else {
    return(
      <nav role="navigation" className="dropdown">
        <div className="dropdown-btn-container">
          <button className="dropdown-btn" onClick={(e) => {
            e.preventDefault();
            setOpenDropdown(!openDropdown);
          }}>
            <span className="hamburger-close-icon-line">X</span>
          </button>
        </div>
        <button className="logout-btn" onClick={() => {
          logout();
        }}>Log Out</button>
      </nav>
    );
  }
};