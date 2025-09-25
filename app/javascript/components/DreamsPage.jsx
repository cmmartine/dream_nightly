import React from "react";
import { useState, useEffect } from "react";
import { postDreamsFromDate } from "../api/dreamsApi";
import Dream from "./Dream";
import DreamInput from "./DreamInput";
import DreamsCalendar from "./DreamsCalendar";
import * as NONVALID_DREAM_DATE from "../constants/shared/NONVALID_DREAM_DATE.json"
import * as MAX_COUNTS from '../constants/shared/MAX_COUNTS.json';

export default function DreamsPage(props) {
  const { setError } = props;
  const [dreams, setDreams] = useState([]);
  const [dateTimeInMs, setDateTimeInMs] = useState();
  const [calendarYear, setCalendarYear] = useState();
  const [calendarMonth, setCalendarMonth] = useState();
  const [calendarDay, setCalendarDay] = useState();

  useEffect(() => {
    setDreams([]);
    if(!dateTimeInMs || isDateOutsideAllowedRange()) return;
    retrieveDreamsFromDate(dateTimeInMs);
  }, [dateTimeInMs, calendarYear, calendarMonth, calendarDay]);

  const retrieveDreamsFromDate = async (dateTimeInMs) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const data = await postDreamsFromDate(dateTimeInMs, userTimeZone, setError);
    setDreams(data);
  };

  const setUpDreams = () => {
    if (!dreams) return null;

    const dreamList = dreams.map((dream) => {
       return <Dream key={dream.id} dreamInfo={dream} removeDreamFromPage={handleDreamDeletion} setError={setError}/>
    });
    return <div className='dream-list'>{dreamList}</div>
  };

  const addNewDream = (newDream) => {
    setDreams(prevDreams => [...prevDreams, newDream].sort((a, b) => b.created_at - a.created_at));
  };

  const handleDreamDeletion = (deletedDreamId) => {
    for(let i = 0; i < dreams.length; i++) {
      if(dreams[i].id === deletedDreamId) {
        setDreams(dreams.filter((dream) => dream.id != deletedDreamId));
        break;
      }
    }
  };

  const atMaximumNumDreams = () => {
    return dreams.length >= MAX_COUNTS.DREAMS_IN_A_DAY;
  };

  const convertDateTimeToMs = (dateTime) => {
    return dateTime.getTime();
  };

  function isDateOutsideAllowedRange() {
    if(!calendarYear || !calendarMonth || !calendarDay) return;

    const dateMs = new Date(calendarYear, calendarMonth - 1, calendarDay).getTime();
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const tomorrowMs = tomorrow.getTime();
    const validYear = Number(calendarYear) > Number(NONVALID_DREAM_DATE.BEFORE_YEAR);
    return !(dateMs < tomorrowMs) || !validYear;
  };

  return(
    <div className='dreams-page-container'>
      <DreamsCalendar setDateTimeInMs={setDateTimeInMs} convertDateTimeToMs={convertDateTimeToMs} setCalendarDay={setCalendarDay} setCalendarMonth={setCalendarMonth} setCalendarYear={setCalendarYear}/>
      {!isDateOutsideAllowedRange() && 
      <DreamInput addNewDream={addNewDream} calendarYear={calendarYear} calendarMonth={calendarMonth} calendarDay={calendarDay} convertDateTimeToMs={convertDateTimeToMs} disableCreation={atMaximumNumDreams()} setError={setError}/>
      }
      {setUpDreams() || <div>There doesn't seem to be any dreams this day.</div>}
    </div>
  );
}