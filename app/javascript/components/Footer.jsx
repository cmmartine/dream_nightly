import React from "react";

export default function Footer() {
  return(
    <div className='footer-container'>
      <a href='/contact' className="link-btn footer-link-btn" aria-label="Link to Contact Page">
        Contact
      </a>
      <a href='/privacy' className="link-btn footer-link-btn" aria-label="Link to Privacy Page">
        Privacy
      </a>
    </div>
  )
};