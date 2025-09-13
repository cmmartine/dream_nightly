import React from "react";
import { useState, useEffect } from "react";

export default function DreamsCalendar(props) {
  const {
    setDateTimeInMs,
    convertDateTimeToMs,
    setCalendarDay,
    setCalendarMonth,
    setCalendarYear
  } = props;

  const [calendarValue, setCalendarValue] = useState();

  useEffect(() => {
    const today = new Date();
    setCalendarStateFromDate(today);
    const todayInMs = convertDateTimeToMs(today);
    setDateTimeInMs(todayInMs);
  }, []);

  const setCalendarStateFromDate = (date) => {
    const dateYear = date.getFullYear();
    const dateMonth = date.getMonth() + 1;
    const dateDay = date.getDate();
    setCalendarYear(dateYear);
    setCalendarMonth(dateMonth);
    setCalendarDay(dateDay);
    const dateForCalendar = `${dateYear}-${formatDayOrMonth(dateMonth)}-${formatDayOrMonth(dateDay)}`;
    setCalendarValue(dateForCalendar);
  };

  const handleDateChange = (e) => {
    const [year, month, day] = e.target.value.split('-').map(Number);
    const newDateTime = new Date(year, month - 1, day);
    setCalendarStateFromDate(newDateTime);
    const newDateTimeInMs = convertDateTimeToMs(newDateTime);
    setDateTimeInMs(newDateTimeInMs);
  };

  const formatDayOrMonth = (dayOrMonth) => {
    return dayOrMonth < 10 ? '0' + dayOrMonth : dayOrMonth
  };

  return(
    <input id='calendar' type='date' data-testid='calendar' value={calendarValue} onChange={(e) => {
      handleDateChange(e);
    }}/>
  )
} 