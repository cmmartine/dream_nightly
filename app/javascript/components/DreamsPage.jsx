import React from "react";
import { useState, useEffect } from "react";
import { postDreamsFromDate } from "../api/dreamsApi";
import Dream from "./Dream";
import DreamInput from "./DreamInput";
import DreamsCalendar from "./DreamsCalendar";

export default function DreamsPage(props) {
  const { setError } = props;
  const [dreams, setDreams] = useState([]);
  const [dateTimeInMs, setDateTimeInMs] = useState();
  const [calendarYear, setCalendarYear] = useState();
  const [calendarMonth, setCalendarMonth] = useState();
  const [calendarDay, setCalendarDay] = useState();

  useEffect(() => {
    if(!dateTimeInMs) return;

    retrieveDreamsFromDate(dateTimeInMs);
  }, [dateTimeInMs]);

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

  const refetchDreams = (dreamsToFetch = dateTimeInMs) => {
    retrieveDreamsFromDate(dreamsToFetch);
  };

  const handleDreamDeletion = (deletedDreamId) => {
    for(let i = 0; i < dreams.length; i++) {
      if(dreams[i].id === deletedDreamId) {
        setDreams(dreams.filter((dream) => dream.id != deletedDreamId));
        break;
      }
    }
  };

  const convertDateTimeToMs = (dateTime) => {
    return dateTime.getTime();
  };

  return(
    <div className='dreams-page-container'>
      <DreamsCalendar setDateTimeInMs={setDateTimeInMs} convertDateTimeToMs={convertDateTimeToMs} setCalendarDay={setCalendarDay} setCalendarMonth={setCalendarMonth} setCalendarYear={setCalendarYear}/>
      <DreamInput refetchDreams={refetchDreams} calendarYear={calendarYear} calendarMonth={calendarMonth} calendarDay={calendarDay} convertDateTimeToMs={convertDateTimeToMs} setError={setError}/>
      {setUpDreams() || <div>There doesn't seem to be any dreams this day.</div>}
    </div>
  );
}