import React from "react";
import { useState } from "react";
import { logout } from "../api/usersApi";

export default function Dropdown() {
  const [openDropdown, setOpenDropdown] = useState(false);

    return(
      !openDropdown &&
        <nav className="dropdown dropdown-closed">
          <div className="dropdown-btn-container">
            <button className="dropdown-btn" onClick={(e) => {
              e.preventDefault();
              setOpenDropdown((prev) => !prev);
            }}>
              <span className="hamburger-icon-line top-line"/>
              <span className="hamburger-icon-line"/>
              <span className="hamburger-icon-line"/>
            </button>
          </div>
        </nav>
      ||
      <nav className="dropdown dropdown-open">
        <div className="dropdown-btn-container">
          <button className="dropdown-btn" onClick={(e) => {
            e.preventDefault();
            setOpenDropdown((prev) => !prev);
          }}>
            <span className="hamburger-close-icon-line">X</span>
          </button>
        </div>
        <div className='dropdown-items-container'>
          <button className="logout-btn" onClick={() => {
            logout();
          }}>Log Out</button>
        </div>
      </nav>
    );
};