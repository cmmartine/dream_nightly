import React from "react";
import { useState, useEffect } from "react";
import { postCreateDream, postUpdateDream } from "../../api/dreamsApi";
import * as MAX_COUNTS from '../../constants/shared/MAX_COUNTS.json';
import { DreamDeletor } from "./DreamDeletor";

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
  const [formText, setFormText] = useState("");
  const [showDreamUpdatedMsg, setShowDreamUpdatedMsg] = useState(false);
  const [showSaveBtn, setShowSaveBtn] = useState(true);
  const [timeValue, setTimeValue] = useState(currentTime());

  useEffect(() => {
    setTimeValue(currentTime());
  }, []);

  useEffect(() => {
    const existingDreamText = checkDreamBody();
    setFormText(existingDreamText);
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
    }
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
        }}/>
        <div className='dream-input-top-row'>
          {!dreamBody && 
            <input
              id='dream-input-time'
              type='time'
              aria-label='Dream time selector'
              value={timeValue}
              onChange={e => setTimeValue(e.target.value)}
            /> || <div/>
          }
          <div className='input-char-count'>{inputMaxLength - formText.length} characters left</div>
        </div>
        <div className='dream-input-bottom-row'>
          { dreamBody && 
            <DreamDeletor
              dreamId={dreamId}
              removeDreamFromPage={removeDreamFromPage}
              setShowSaveBtn={setShowSaveBtn}
              setError={setError}
            />
          }
          {/* Update dream updating to allow time change? */}
          {!dreamBody && <div/>}
          <div>
            { showSaveBtn && 
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
            }
            {showDreamUpdatedMsg && <div className='dream-update-msg'>Dream Updated</div>}
          </div>
        </div>
      </form>
    ) ||
    disableCreation && <div className='disabled-creation-msg'>Only {MAX_COUNTS.DREAMS_IN_A_DAY} dreams can be created per day</div>
  )
}