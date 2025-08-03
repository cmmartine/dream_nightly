import React from "react";
import { useState } from "react";
import DreamInput from "./DreamInput";

export default function Dream(props) {
  const { dreamInfo, setError } = props;
  const [expanded, setExpanded] = useState(false);
  const [dreamBody, setDreamBody] = useState(dreamInfo.body);
  const dreamId = dreamInfo.id;

  function updateDreamBody(newBody) {
    setDreamBody(newBody);
  };

  if (!expanded) {
    return(
      <div className='dream-container'>
        <div className='dream-body'>{dreamBody}</div>
        <div className='expand-btn lucide--expand' data-testid='expand-btn' onClick={(e) => {
          e.preventDefault();
          setExpanded(true);
        }}/>
      </div>
    );
  } else {
    return(
      <div className='dream-container'>
        <div className='dream-expanded-body-container'>
          <div className='dream-body'>{dreamBody}</div>
          <DreamInput dreamBody={dreamBody} dreamId={dreamId} updateDreamBody={updateDreamBody} setError={setError}/>
        </div>
        <div className='unexpand-btn lucide--x' data-testid='unexpand-btn' onClick={(e) => {
          e.preventDefault();
          setExpanded(false);
        }}/>
      </div>
    )
  }
}