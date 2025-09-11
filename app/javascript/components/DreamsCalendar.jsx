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

  useEffect(() => {
      const today = new Date();
      changeCalendarDate(today);
      const todayInMs = convertDateTimeToMs(today);
      setDateTimeInMs(todayInMs);
    }, []);
  
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
    };
  
    const formatDayOrMonth = (dayOrMonth) => {
      return dayOrMonth < 10 ? '0' + dayOrMonth : dayOrMonth
    };

  return(
    <input id='calendar' type='date' data-testid='calendar' onChange={(e) => {
          handleDateChange(e);
    }}/>
  )
} 