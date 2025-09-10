import React from "react";
import { useState, useEffect } from "react";
import { postCreateDream, postUpdateDream, postDeleteDream } from "../api/dreamsApi";

export default function DreamInput(props) {
  const {
    dreamBody,
    dreamId,
    updateDreamBody,
    refetchDreams,
    calendarYear,
    calendarMonth,
    calendarDay,
    convertDateTimeToMs,
    removeDreamFromPage,
    setError 
  } = props;
  const [formText, setFormText] = useState(checkDreamBody());
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    setTimeInputValue(currentTime());
  }, []);

  const formClass = dreamBody ? 'edit-form' : null;

  function checkDreamBody() {
    return dreamBody ? dreamBody : '';
  };

  function currentTime() {
    const date = new Date();
    const hours = date.getHours();
    const formattedHours = hours.toString().length === 1 ? `0${hours}` : hours; 
    const minutes = date.getMinutes();
    return `${formattedHours}:${minutes}`;
  };

  function createdAtTimeInMs() {
    let clockElement = document.querySelector('input[type=time]');
    if (!clockElement || !clockElement.value) return null;
    const [hour, minute] = clockElement.value.split(':').map(Number);
    const dateTime = new Date(calendarYear, calendarMonth - 1, calendarDay, hour, minute);
    return convertDateTimeToMs(dateTime);
  };

  function setTimeInputValue(time) {
      let clockElement = document.querySelector('input[type=time]');
      if(clockElement) {
        clockElement.value = time;
      }
  };

  async function saveDream() {
    if (dreamBody) {
      updateDreamBody(formText);
      postUpdateDream(dreamId, formText, setError);
    } else {
       const data = await postCreateDream(formText, createdAtTimeInMs(), setError);
       data.status == 'created' ? refetchDreams() : null;
       setFormText('');
    }
  };

  function deleteDream() {
    postDeleteDream(dreamId, setError);
    removeDreamFromPage(dreamId);
  };

  return(
    <form id='dream-input-form' className={formClass}>
      <textarea id='dream-input-textarea' aria-label='enter-dream' spellCheck='true' placeHolder='Enter a dream...' value={formText} onChange={(e) => {
        setFormText(e.target.value);
      }}/>
      <div className='dream-input-bottom-row'>
        {
          dreamBody && !showConfirmDelete &&
            <button className='gen-btn' onClick={() => {setShowConfirmDelete(true)}}>Delete</button>
        }
        {
          dreamBody && showConfirmDelete &&
          <div className='confirm-delete-container'>
            <div>Confirm dream deletion?</div>
            <div>
              <button className='gen-btn confirm-delete-btn' onClick={() => {setShowConfirmDelete(false)}}>Cancel</button>
              <button className='gen-btn confirm-delete-btn' onClick={() => {deleteDream()}}>Delete</button>
            </div>
          </div>
        }
        {/* Update dream updating to allow time change? */}
        {!dreamBody && <input id='dream-input-time' type='time' aria-label='Dream time selector'/>}
        <button id='save-dream-btn' className='save-btn gen-btn' type='submit' onClick={(e) => {
          e.preventDefault();
          if (formText != '') {
            saveDream();
          }
        }}>Save</button>
      </div>
    </form>
  )
}