import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { logout } from '../api/usersApi';
import { addOutsideClickListener } from '../util/elementUtils';

export default function Dropdown() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
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

  const changeLineClasses = () => {
    (animationClass == '' || animationClass == 'line-close')? setAnimationClass('line-open') : setAnimationClass('line-close');
  };

  return (
    <nav
      ref={openDropdownRef}
      aria-label='User menu'
      className={openDropdown ? 'dropdown dropdown-open' : 'dropdown dropdown-closed'}
    >
      <div className={openDropdown ? 'dropdown-btn-container dropdown-btn-container-open' : 'dropdown-btn-container'}>
        <button
          className={openDropdown ? 'dropdown-btn close-dropdown-btn open' : 'dropdown-btn'}
          aria-haspopup="true"
          aria-expanded={openDropdown}
          aria-controls="user-menu-items"
          onClick={(e) => {
            e.preventDefault();
            setOpenDropdown((prev) => !prev);
            changeLineClasses();
          }}
        >
          <span className={`hamburger-icon-line top-line`}/>
          <span className={`hamburger-icon-line middle-line`}/>
          <span className={`hamburger-icon-line bottom-line`}/>
        </button>
      </div>
      { openDropdown && 
        <div className='dropdown-items-container'>
          <a
            className='link-btn dropdown-link-btn'
            href='/search'
          >
            Dream Search
          </a>
          <a
            className='link-btn dropdown-link-btn'
            href='/users/edit'
          >
            Edit Account
          </a>
          <button
            className='link-btn dropdown-link-btn'
            onClick={() => {
              logout();
            }}
          >
            Log Out
          </button>
        </div>
      }
    </nav>
  )
};