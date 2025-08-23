import React from "react";
import { useState, useEffect } from "react";
import { logout } from "../api/usersApi";

export default function Dropdown() {
  const [openDropdown, setOpenDropdown] = useState(false);

  useEffect(() => {
    const dropdown = document.getElementsByClassName('dropdown-open')[0];
    if (dropdown) {
      let dropdownPosition = findElementPosition(dropdown);
      document.addEventListener('click', (e) => {closeDropdown(e, dropdownPosition)});
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