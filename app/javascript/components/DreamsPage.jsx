import React from "react";
import { useState, useEffect } from "react";
import { postDreamsFromDate } from "../api/dreamsApi";

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
    let dateMonth = date.getMonth() + 1;
    let dateDay = date.getDate();
    let dateForCalendar = dateYear + '-' + dateMonth + '-' + dateDay;
    calendarElement.value = dateForCalendar;
  };

  const convertDateTimeToMs = (dateTime) => {
    return dateTime.getTime();
  };

  return(
    <div>
      <input id='calendar' type='date' data-testid='calendar'></input>
    </div>
  );
}