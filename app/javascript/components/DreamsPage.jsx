import React from "react";
import { useState, useEffect } from "react";
import { postDreamsFromDate } from "../api/dreamsApi";
import Dream from "./Dream";
import DreamInput from "./DreamInput";

export default function DreamsPage(props) {
  const { setError } = props;
  const [dreams, setDreams] = useState([]);
  const [dateTimeInMs, setDateTimeInMs] = useState()

  useEffect(() => {
    const today = new Date();
    setCalendarDate(today);
    const todayInMs = convertDateTimeToMs(today);
    setDateTimeInMs(todayInMs);
    retrieveDreamsFromDate(todayInMs);
  }, []);

  const retrieveDreamsFromDate = async (dateTimeInMs) => {
    const data = await postDreamsFromDate(dateTimeInMs, setError);
    setDreams(data);
  };

  const setCalendarDate = (date) => {
    let calendarElement = document.querySelector('input[type="date"]');
    let dateYear = date.getFullYear();
    let dateMonth = formatDayOrMonth(date.getMonth() + 1);
    let dateDay = formatDayOrMonth(date.getDate());
    let dateForCalendar = dateYear + '-' + dateMonth + '-' + dateDay;
    calendarElement.value = dateForCalendar;
  };

  const formatDayOrMonth = (dayOrMonth) => {
    return dayOrMonth < 10 ? '0' + dayOrMonth : dayOrMonth
  };

  const convertDateTimeToMs = (dateTime) => {
    return dateTime.getTime();
  };

  const setUpDreams = () => {
    const dreamList = dreams.map((dream) => {
       return <Dream key={dream.id} dreamInfo={dream} setError={setError}/>
    });
    return <div className='dream-list'>{dreamList}</div>
  };

  const refetchDreams = () => {
    retrieveDreamsFromDate(dateTimeInMs);
  };

  if (dreams != []) {
    return(
      <div>
        <input id='calendar' type='date' data-testid='calendar'></input>
        <DreamInput refetchDreams={refetchDreams} setError={setError}/>
        {setUpDreams()}
      </div>
    );
  } else {
    return(
      <div>
        <input id='calendar' type='date' data-testid='calendar'></input>
        <DreamInput refetchDreams={refetchDreams} setError={setError}/>
        <div>There doesn't seem to be any dreams this day.</div>
      </div>
    )
  }
}