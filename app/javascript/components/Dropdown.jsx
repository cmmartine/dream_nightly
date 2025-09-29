import React from "react";
import { useState, useEffect } from "react";
import { logout } from "../api/usersApi";

export default function Dropdown() {
  const [openDropdown, setOpenDropdown] = useState(false);

  useEffect(() => {
    if (!openDropdown) return;

    const dropdown = document.getElementsByClassName('dropdown-open')[0];
    if (!dropdown) return;

    let dropdownPosition = findElementPosition(dropdown);

    const handler = (e) => closeDropdown(e, dropdownPosition);

    document.addEventListener('click', handler);

    return() => {
      document.removeEventListener('click', handler);
    }
  }, [openDropdown]);

  const findElementPosition = (dropdown) => {
    return dropdown.getBoundingClientRect();
  };

  const closeDropdown = (e, dropdownPosition) => {
    let posX = e.clientX;
    let posY = e.clientY;
    const posXOutOfBox = posX < dropdownPosition.left || posX > dropdownPosition.right;
    const posYOutofBox = posY < dropdownPosition.top || posY > dropdownPosition.bottom;
    if (posXOutOfBox || posYOutofBox) {
      setOpenDropdown(false);
    };
  };

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
      <menu role='menu' aria-label='Opened Dropdown Menu' className="dropdown dropdown-open">
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