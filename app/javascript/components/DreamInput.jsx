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
  const [timeValue, setTimeValue] = useState(currentTime());

  useEffect(() => {
    setTimeValue(currentTime());
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
    const formattedMinutes = minutes.toString().length === 1 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes}`;
  };

  function createdAtTimeInMs() {
    if (!timeValue) return null;
    const [hour, minute] = timeValue.split(':').map(Number);
    const dateTime = new Date(calendarYear, calendarMonth - 1, calendarDay, hour, minute);
    return convertDateTimeToMs(dateTime);
  };

  async function saveDream() {
    if (dreamBody) {
      updateDreamBody(formText);
      postUpdateDream(dreamId, formText, setError);
    } else {
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
       const data = await postCreateDream(formText, createdAtTimeInMs(), userTimeZone, setError);
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
      <textarea id='dream-input-textarea' aria-label='enter-dream' spellCheck='true' placeholder='Enter a dream...' value={formText}onChange={(e) => {
        e.preventDefault();
        setFormText(e.target.value);
      }}/>
      <div className='dream-input-bottom-row'>
        {
          dreamBody && !showConfirmDelete &&
            <button className='gen-btn' onClick={(e) => {
              e.preventDefault();
              setShowConfirmDelete(true)
            }}>Delete</button>
        }
        {
          dreamBody && showConfirmDelete &&
          <div className='confirm-delete-container'>
            <div>
              <button className='gen-btn confirm-delete-btn' onClick={(e) => {
                e.preventDefault();
                setShowConfirmDelete(false)
              }}>Cancel</button>
              <button className='gen-btn confirm-delete-btn' onClick={(e) => {
                e.preventDefault();
                deleteDream()
              }}>Delete</button>
            </div>
            <div>Confirm dream deletion?</div>
          </div>
        }
        {/* Update dream updating to allow time change? */}
        {!dreamBody && 
          <input
            id='dream-input-time'
            type='time'
            aria-label='Dream time selector'
            value={timeValue}
            onChange={e => setTimeValue(e.target.value)}
          />}
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