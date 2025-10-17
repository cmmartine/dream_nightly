import React from "react";
import { appName } from "../../constants/appInfo";

export default function ContactPage() {
  return(
    <div className='info-page-container'>
      <nav>
        <a id='navbar-title' className='link-btn' href='/'>{appName}</a>
      </nav>
      <div className='info-page-row'>
        <p className='info-text'>We'd love to hear from you.</p>

        <p className='info-text'>Whether you have feedback, questions, or just want to share a dream, reach out anytime.</p>

        <p className='info-text'>Email us at:</p>
        <a href="mailto:dreamnightly.app@gmail.com" className='link-btn'>dreamnightly.app@gmail.com</a>
        <p className='info-text'>Feature requests welcome</p>
      </div>
    </div>
  )
};