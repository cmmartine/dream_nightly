import React from "react";
import { useState, useEffect, useRef } from "react";
import DreamInput from "./DreamInput";

export default function Dream(props) {
  const { dreamInfo, removeDreamFromPage, setError } = props;
  const [expanded, setExpanded] = useState(false);
  const [dreamBody, setDreamBody] = useState(dreamInfo.body);
  const [scrolledTo, setScrolledTo] = useState(false);
  const expandedDreamRef = useRef(null);
  const dreamId = dreamInfo.id;

  const handleScroll = (refCurrent) => {
    refCurrent.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  useEffect(() => {
    if (expanded && !scrolledTo && expandedDreamRef?.current) {
      handleScroll(expandedDreamRef.current)
      setScrolledTo(true);
    }
  }, [expanded, scrolledTo, expandedDreamRef]);

  function updateDreamBody(newBody) {
    setDreamBody(newBody);
  };

  function formatTimeFromMs(ms) {
    const date = new Date(ms);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  function handleUnexpand() {
    setExpanded(false);
    setScrolledTo(false);
  };

  if (!expanded) {
    return(
      <div className='dream-container'>
        <div className='dream-top-row-container'>
          <div>{formatTimeFromMs(dreamInfo.created_at)}</div>
          <div className='expand-btn lucide--edit' data-testid='expand-btn' onClick={(e) => {
            e.preventDefault();
            setExpanded(true);
          }}/>
        </div>
        <div className='dream-body'>{dreamBody}</div>
      </div>
    );
  } else {
    return(
      <div className='dream-container' ref={expandedDreamRef}>
        <div className='dream-top-row-container'>
          <div>{formatTimeFromMs(dreamInfo.created_at)}</div>
          <div className='unexpand-btn lucide--x' data-testid='unexpand-btn' onClick={(e) => {
            e.preventDefault();
            handleUnexpand();
          }}/>
        </div>
        <div className='dream-expanded-body-container'>
          <div className='dream-body'>{dreamBody}</div>
          <DreamInput dreamBody={dreamBody} dreamId={dreamId} updateDreamBody={updateDreamBody} removeDreamFromPage={removeDreamFromPage} setError={setError}/>
        </div>
      </div>
    )
  }
}