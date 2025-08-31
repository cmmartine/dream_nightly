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
      <menu role='menu' aria-label='dropdown-menu-closed' className="dropdown dropdown-closed">
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
      </menu>
    )
  } else {
    return (
      <menu role='menu' aria-label='dropdown-menu-open' className="dropdown dropdown-open">
        <div className="dropdown-btn-container dropdown-btn-container-open">
          <button className="dropdown-btn close-dropdown-btn" onClick={(e) => {
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
      </menu>
    )
  }
};