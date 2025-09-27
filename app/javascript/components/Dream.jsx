import React from "react";
import { useState, useEffect, useRef } from "react";
import DreamInput from "./DreamInput";

export default function Dream(props) {
  const { dreamInfo, removeDreamFromPage, setError, newDreamRef } = props;
  const [expanded, setExpanded] = useState(false);
  const [dreamBody, setDreamBody] = useState(dreamInfo.body);
  const [scrolledTo, setScrolledTo] = useState(false);
  const [containerClass, setContainerClass] = useState('dream-container');
  const expandedDreamRef = useRef(null);
  const dreamId = dreamInfo.id;

  useEffect(() => {
    if (expanded && !scrolledTo && expandedDreamRef?.current) {
      expandedDreamRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
      setScrolledTo(true);
    }
  }, [expanded, scrolledTo, expandedDreamRef]);

  useEffect(() => {
    if (newDreamRef?.current) {
      setContainerClass('dream-container highlight-container');
      setTimeout(() => {
        setContainerClass('dream-container');
      }, 5000);
    }
  }, [newDreamRef]);

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
      <div className={containerClass} ref={newDreamRef}>
        <div className='dream-top-row-container'>
          <div>{formatTimeFromMs(dreamInfo.created_at)}</div>
          <button
            className='expand-btn lucide--edit'
            aria-label='Open dream editor'
            data-testid='expand-btn'
            tabIndex={0}
            onClick={(e) => {
              e.preventDefault();
              setExpanded(true);
            }}
            
          />
        </div>
        <div className='dream-body'>{dreamBody}</div>
      </div>
    );
  } else {
    return(
      <div className='dream-container' ref={expandedDreamRef}>
        <div className='dream-top-row-container'>
          <div>{formatTimeFromMs(dreamInfo.created_at)}</div>
          <div className='expand-btn lucide--x' aria-label='Close dream editor' data-testid='unexpand-btn' tabIndex={0} onClick={(e) => {
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