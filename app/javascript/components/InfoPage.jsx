import React from "react";
import { appDescription } from "../constants/appInfo";

export default function InfoPage() {
  return(
    <div>
      <div>
        <p>{appDescription.body}</p>
      </div>
    </div>
  );
};