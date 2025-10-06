import React from "react";
import { appName } from "../../constants/appInfo";

export default function PrivacyPage() {
  return(
    <div className='info-page-container'>
      <nav>
        <a id='navbar-title' className='link-btn' href='/'>{appName}</a>
      </nav>
      <div className='info-page-row'>
        <p className='info-text'>We respect your privacy.</p>

        <p className='info-text'>Dream Nightly stores only the data necessary to provide you with a secure and personalized journaling experience. Your dream entries are private by default and never shared without your consent.</p>

        <p className='info-text'>We do not use tracking cookies or third-party analytics. No ads. No profiling.</p>

        <p className='info-text'>If you have questions or concerns, feel free to reach out at dreamnightly.app@gmail.com.</p>

        <p className='info-text'>Last updated: October 6th, 2025</p>
      </div>
    </div>
  )
};