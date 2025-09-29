import React from "react";
import { appDescription } from "../constants/appInfo";

export default function InfoPage() {
  return(
    <div className='info-page-container'>
      <h2 className='info-text info-call-to-action'>{appDescription.callToAction}</h2>
      <p className='info-text'>{appDescription.body}</p>
      <p className='info-text'>{appDescription.body2}</p>
      <p className='info-text'>{appDescription.body3}</p>
    </div>
  );
};