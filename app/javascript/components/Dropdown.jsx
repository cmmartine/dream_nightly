import React from "react";
import { useState, useEffect, useRef } from "react";
import { logout } from "../api/usersApi";
import { addOutsideClickListener } from "../util/elementUtils";

export default function Dropdown() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const openDropdownRef = useRef(null);

   useEffect(() => {
    let cleanupFunction;
    if(openDropdown && openDropdownRef?.current) {
      cleanupFunction = addOutsideClickListener(openDropdownRef.current, () => setOpenDropdown(false));
    };

    return () => {
      if (cleanupFunction) cleanupFunction();
    };
  }, [openDropdown]);

  if (!openDropdown) {
    return(
      <menu role='menu' aria-label='Closed Dropdown Menu' className="dropdown dropdown-closed">
        <div className="dropdown-btn-container" role='menuitem'>
          <button
            className="dropdown-btn"
            aria-label='Open drowndown menu'
            onClick={(e) => {
              e.preventDefault();
              setOpenDropdown((prev) => !prev);
            }}
          >
            <span className="hamburger-icon-line top-line"/>
            <span className="hamburger-icon-line"/>
            <span className="hamburger-icon-line"/>
          </button>
        </div>
      </menu>
    )
  } else {
    return (
      <menu role='menu' ref={openDropdownRef} aria-label='Opened Dropdown Menu' className="dropdown dropdown-open">
        <div className="dropdown-btn-container dropdown-btn-container-open">
          <button
            className="dropdown-btn close-dropdown-btn"
            aria-label='Close drowndown menu'
            role='menuitem'
            onClick={(e) => {
              e.preventDefault();
              setOpenDropdown((prev) => !prev);
            }}
          >
            <span className="hamburger-close-icon-line">X</span>
          </button>
        </div>
        <div className='dropdown-items-container'>
          <a
            className='link-btn dropdown-link-btn'
            href='/users/edit'
            role='menuitem'
            aria-label='Link to Edit Account'
          >
            Edit Account
          </a>
          <button
            className="link-btn dropdown-link-btn"
            role='menuitem'
            onClick={() => {
              logout();
            }}
          >
            Log Out
          </button>
        </div>
      </menu>
    )
  }
};