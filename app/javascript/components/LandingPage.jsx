import React from "react";
import { appDescription } from "../constants/appInfo";

export default function LandingPage() {
  return(
    <div className='info-page-container'>
      <div className='info-page-row'>
        <h2 className='info-text info-call-to-action'>{appDescription.callToAction}</h2>
        <p className='info-text'>{appDescription.body}</p>
        <div className='screenshot app-screenshot'/>
      </div>
      <div className='info-page-row'>
        <h3 className='info-text'>{appDescription.calendar.title}</h3>
        <div className='screenshot calendar-screenshot'/>
        <p className='info-text'>{appDescription.calendar.text}</p>
      </div>

      <div className='info-page-row'>
        <h3 className='info-text'>{appDescription.search.title}</h3>
        <div className='screenshot search-screenshot'/>
        <p className='info-text'>{appDescription.search.text}</p>
      </div>
      <div className='info-page-row'>
        <p className='info-text info-text-bottom'>{appDescription.body2}</p>
        <p className='info-text info-text-bottom'>{appDescription.body3}</p>
      </div>

    </div>
  );
};