import React from "react";
import { useState } from "react";
import DreamInput from "./DreamInput";
import { postDeleteDream } from "../api/dreamsApi";

export default function Dream(props) {
  const { dreamInfo, removeDreamFromPage, setError } = props;
  const [expanded, setExpanded] = useState(false);
  const [dreamBody, setDreamBody] = useState(dreamInfo.body);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const dreamId = dreamInfo.id;

  function updateDreamBody(newBody) {
    setDreamBody(newBody);
  };

  function formatTimeFromMs(ms) {
    const date = new Date(ms);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  function deleteDream() {
    postDeleteDream(dreamInfo.id, setError);
    removeDreamFromPage(dreamInfo.id);
  };

  // Add scrolling to show entire block when dream is expanded

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
      <div className='dream-container'>
        <div className='dream-top-row-container'>
          <div>{formatTimeFromMs(dreamInfo.created_at)}</div>
          <div className='unexpand-btn lucide--x' data-testid='unexpand-btn' onClick={(e) => {
            e.preventDefault();
            setExpanded(false);
          }}/>
        </div>
        <div className='dream-expanded-body-container'>
          <div className='dream-body'>{dreamBody}</div>
          <DreamInput dreamBody={dreamBody} dreamId={dreamId} updateDreamBody={updateDreamBody} setError={setError}/>
          {
            !showConfirmDelete &&
            <button className='gen-btn' onClick={() => {setShowConfirmDelete(true)}}>Delete</button>
          }
          {
            showConfirmDelete &&
            <div>
              <div>Confirm dream deletion:</div>
              <button className='gen-btn' onClick={() => {setShowConfirmDelete(false)}}>Cancel</button>
              <button className='gen-btn' onClick={() => {deleteDream()}}>Delete</button>
            </div>
          }
        </div>
      </div>
    )
  }
}