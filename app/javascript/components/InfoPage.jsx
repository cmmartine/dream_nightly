import React from "react";
import { redirectToSignIn, redirectToSignUp } from "../api/usersApi";
import { appName, appDescription } from "../constants/infoPage";

export default function InfoPage() {
  return(
    <div>
      <div className="session-btns-container">
        <button className="session-btn" onClick={() => {
          redirectToSignIn();
        }}>
          Sign In
        </button>
        <button className="session-btn" onClick={() => {
          redirectToSignUp();
        }}>
          Sign Up
        </button>
      </div>
      <div>
        <h1>{appName}</h1>
        <p>{appDescription.body}</p>
      </div>
    </div>
  );
};