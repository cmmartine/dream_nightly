import React from "react";
import { useState, useEffect } from "react";
import { postCreateDream, postUpdateDream, postDeleteDream } from "../api/dreamsApi";
import * as MAX_COUNTS from '../constants/shared/MAX_COUNTS.json';
import { addOutsideClickListener } from "../util/elementUtils";

export default function DreamInput(props) {
  const {
    dreamBody,
    dreamId,
    updateDreamBody,
    addNewDream,
    calendarYear,
    calendarMonth,
    calendarDay,
    convertDateTimeToMs,
    removeDreamFromPage,
    disableCreation = false,
    setError 
  } = props;
  const inputMaxLength = MAX_COUNTS.DREAM_CHARS;
  const [formText, setFormText] = useState();
  const [numOfChars, setNumOfChars] = useState(0);
  const [numCharsLeft, setNumCharsLeft] = useState();
  const [showDreamUpdatedMsg, setShowDreamUpdatedMsg] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [timeValue, setTimeValue] = useState(currentTime());

  useEffect(() => {
    setTimeValue(currentTime());
  }, []);

  useEffect(() => {
    const existingDreamText = checkDreamBody();
    setFormText(existingDreamText);
    setNumOfChars(existingDreamText.length)
  }, []);

  useEffect(() => {
    setNumCharsLeft(inputMaxLength - numOfChars);
  }, [numOfChars]);

  useEffect(() => {
    const deleteConfirmContainer = document.getElementById('confirm-delete-container');
    let cleanupFunction;
    if(showConfirmDelete && deleteConfirmContainer) {
      cleanupFunction = addOutsideClickListener(deleteConfirmContainer, () => setShowConfirmDelete(false));
    };

    return () => {
      if (cleanupFunction) cleanupFunction();
    };
  }, [showConfirmDelete]);

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

  function dreamUpdateNotice() {
    setShowDreamUpdatedMsg(true);
    setTimeout(() => {
      setShowDreamUpdatedMsg(false);
    }, 3000);
  };

  async function saveDream() {
    if (dreamBody && dreamBody != formText) {
      updateDreamBody(formText);
      const updateData = await postUpdateDream(dreamId, formText, setError);
      updateData.status == 'ok' ? dreamUpdateNotice() : null;
    } else if (!dreamBody) {
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
       const data = await postCreateDream(formText, createdAtTimeInMs(), userTimeZone, setError);
       data.status == 'created' ? addNewDream(data.dream) : null;
       setFormText('');
       setNumOfChars(0);
    }
  };

  function deleteDream() {
    postDeleteDream(dreamId, setError);
    removeDreamFromPage(dreamId);
  };

  return(
    (
      !disableCreation &&
      <form id='dream-input-form' className={formClass}>
        <textarea
        id='dream-input-textarea'
        aria-label='Enter dream'
        spellCheck='true'
        placeholder='Enter a dream...'
        value={formText}
        maxLength={inputMaxLength}
        onChange={(e) => {
          e.preventDefault();
          setFormText(e.target.value);
          setNumOfChars(e.target.value.length);
        }}/>
        <div className='dream-input-top-row'>
          {!dreamBody && 
            <input
              id='dream-input-time'
              type='time'
              aria-label='Dream time selector'
              value={timeValue}
              onChange={e => setTimeValue(e.target.value)}
            /> || <div/>}
          <div className='input-char-count'>{numCharsLeft} characters left</div>
        </div>
        <div className='dream-input-bottom-row'>
          {
            dreamBody && !showConfirmDelete &&
              <button className='gen-btn' aria-label='Start dream deletion' onClick={(e) => {
                e.preventDefault();
                setShowConfirmDelete(true)
              }}>Delete</button>
          }
          {
            dreamBody && showConfirmDelete &&
            <div id='confirm-delete-container' className='confirm-delete-container'>
              <div>
                <button className='gen-btn confirm-delete-btn' aria-label='Cancel dream deletion' onClick={(e) => {
                  e.preventDefault();
                  setShowConfirmDelete(false)
                }}>Cancel</button>
                <button className='gen-btn confirm-delete-btn' aria-label='Confirm dream deletion' onClick={(e) => {
                  e.preventDefault();
                  deleteDream()
                }}>Delete</button>
              </div>
              <div className='dream-delete-confirm-msg'>Confirm dream deletion?</div>
            </div>
          }
          {/* Update dream updating to allow time change? */}
          {!dreamBody && <div/>}
          <div>
            <button
              id='save-dream-btn'
              className='gen-btn'
              type='submit'
              aria-label='Save dream'
              onClick={(e) => {
                e.preventDefault();
                if (formText != '') {
                  saveDream();
                }
              }}
            >
              Save
            </button>
            {showDreamUpdatedMsg && <div className='dream-update-msg'>Dream updated</div>}
          </div>
        </div>
      </form>
    ) ||
    disableCreation && <div className='disabled-creation-msg'>Only {MAX_COUNTS.DREAMS_IN_A_DAY} dreams can be created per day</div>
  )
}