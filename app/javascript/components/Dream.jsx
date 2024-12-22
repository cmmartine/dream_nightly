import React from "react";
import { useState } from "react";

export default function Dream(props) {
  const { dreamInfo } = props;
  const [editingDream, setEditingDream] = useState(false);

  if (!editingDream) {
    return(
      <div className='dream-container'>
        <div className='expand-btn'>expand arrows</div>
        <div className='dream-body'>{dreamInfo.body}</div>
      </div>
    );
  } else {
    return(
      <div></div>
    )
  }
}