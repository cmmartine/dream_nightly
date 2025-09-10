import React from "react";
import { useState, useEffect } from "react";
import { postDreamsFromDate } from "../api/dreamsApi";
import Dream from "./Dream";
import DreamInput from "./DreamInput";

export default function DreamsPage(props) {
  const { setError } = props;
  const [dreams, setDreams] = useState([]);
  const [dateTimeInMs, setDateTimeInMs] = useState();
  const [calendarYear, setCalendarYear] = useState();
  const [calendarMonth, setCalendarMonth] = useState();
  const [calendarDay, setCalendarDay] = useState();

  useEffect(() => {
    const today = new Date();
    changeCalendarDate(today);
    const todayInMs = convertDateTimeToMs(today);
    setDateTimeInMs(todayInMs);
    retrieveDreamsFromDate(todayInMs);
  }, []);

  const retrieveDreamsFromDate = async (dateTimeInMs) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const data = await postDreamsFromDate(dateTimeInMs, userTimeZone, setError);
    setDreams(data);
  };

  const setCalendarStateFromDate = (date) => {
    const dateYear = date.getFullYear();
    const dateMonth = formatDayOrMonth(date.getMonth() + 1);
    const dateDay = formatDayOrMonth(date.getDate());
    setCalendarYear(dateYear);
    setCalendarMonth(dateMonth);
    setCalendarDay(dateDay);
    return `${dateYear}-${dateMonth}-${dateDay}`;
  };

  const changeCalendarDate = (date) => {
    const dateForCalendar = setCalendarStateFromDate(date);
    let calendarElement = document.querySelector('input[type="date"]');
    if (calendarElement) {
      calendarElement.value = dateForCalendar;
    }
  };

  const handleDateChange = (e) => {
    const newDateTime = new Date(e.target.value);
    setCalendarStateFromDate(newDateTime);
    const newDateTimeInMs = convertDateTimeToMs(newDateTime);
    setDateTimeInMs(newDateTimeInMs);
    refetchDreams(newDateTimeInMs);
  };

  const formatDayOrMonth = (dayOrMonth) => {
    return dayOrMonth < 10 ? '0' + dayOrMonth : dayOrMonth
  };

  const convertDateTimeToMs = (dateTime) => {
    return dateTime.getTime();
  };

  const setUpDreams = () => {
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

  if (dreams.length > 0) {
    return(
      <div className='dreams-page-container'>
        <input id='calendar' type='date' data-testid='calendar' onChange={(e) => {
          handleDateChange(e);
        }}></input>
        <DreamInput refetchDreams={refetchDreams} calendarYear={calendarYear} calendarMonth={calendarMonth} calendarDay={calendarDay} convertDateTimeToMs={convertDateTimeToMs} setError={setError}/>
        {setUpDreams()}
      </div>
    );
  } else {
    return(
      <div className='dreams-page-container'>
        <input id='calendar' type='date' data-testid='calendar' onChange={(e) => {
          handleDateChange(e);
        }}></input>
        <DreamInput refetchDreams={refetchDreams} calendarYear={calendarYear} calendarMonth={calendarMonth} calendarDay={calendarDay} convertDateTimeToMs={convertDateTimeToMs} setError={setError}/>
        <div>There doesn't seem to be any dreams this day.</div>
      </div>
    )
  }
}