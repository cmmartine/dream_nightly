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
       return <Dream key={dream.id} dreamInfo={dream} removeDreamFromPage={handleDreamDeletion} setError={setError}/>
    });
    return <div className='dream-list'>{dreamList}</div>
  };

  const refetchDreams = (dreamsToFetch = dateTimeInMs) => {
    retrieveDreamsFromDate(dreamsToFetch);
  };

  const handleDateChange = (e) => {
    let newDateTime = new Date(e.target.value);
    let newDateTimeInMs = convertDateTimeToMs(newDateTime);
    setDateTimeInMs(newDateTimeInMs);
    refetchDreams(newDateTimeInMs);
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
        <DreamInput refetchDreams={refetchDreams} setError={setError} dateTimeInMs={dateTimeInMs}/>
        {setUpDreams()}
      </div>
    );
  } else {
    return(
      <div className='dreams-page-container'>
        <input id='calendar' type='date' data-testid='calendar' onChange={(e) => {
          handleDateChange(e);
        }}></input>
        <DreamInput refetchDreams={refetchDreams} setError={setError} dateTimeInMs={dateTimeInMs}/>
        <div>There doesn't seem to be any dreams this day.</div>
      </div>
    )
  }
}