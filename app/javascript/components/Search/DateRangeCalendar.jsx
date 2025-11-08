import React, { useState, useRef, useEffect } from "react";
import * as NONVALID_DREAM_DATE from "../../constants/shared/NONVALID_DREAM_DATE.json";

export default function DateRangeCalendar(props) {
  const { setDateTimeInMs, calendarType } = props;
  const [calendarDate, setCalendarDate] = useState(null);
  const [minCalendarVal, setMinCalendarVal] = useState(null);
  const [maxCalendarVal, setMaxCalendarVal] = useState(null);
  const calendarRef = useRef();

  useEffect(() => {
    const today = new Date();
    const firstValidDate = new Date(parseInt(NONVALID_DREAM_DATE.BEFORE_YEAR) + 1, 0, 1, 0);
    setCalendarMinMax(today, firstValidDate);

    calendarType === 'start' ? handleDateChange(firstValidDate) : handleDateChange(today);
  }, []);

  const convertDateTimeToMs = (dateTime) => {
    return dateTime.getTime();
  };

  const formatDayOrMonth = (dayOrMonth) => {
    return dayOrMonth < 10 ? '0' + dayOrMonth : dayOrMonth
  };

  const formatDateForCalendar = (date) => {
    const dateYear = date.getFullYear();
    const dateMonth = formatDayOrMonth(date.getMonth() + 1);
    const dateDay = formatDayOrMonth(date.getDate());
    return `${dateYear}-${dateMonth}-${dateDay}`;
  };

  const setCalendarMinMax = (todayDate, firstValidDate) => {
    const formattedToday = formatDateForCalendar(todayDate);
    const formattedLastValidDate = formatDateForCalendar(firstValidDate);
    setMinCalendarVal(formattedLastValidDate);
    setMaxCalendarVal(formattedToday);
  };

  const changeCalendarDate = (calendarDate) => {
    setCalendarDate(formatDateForCalendar(calendarDate));
  };

  const handleDateChange = (newCalendarDate) => {
    changeCalendarDate(newCalendarDate);
    const newDateTimeInMs = convertDateTimeToMs(newCalendarDate);
    setDateTimeInMs(newDateTimeInMs);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return;

    const [year, month, day] = value.split('-').map(Number);
    const localDate = new Date(year, month - 1, day);
    handleDateChange(localDate);
  };

  return(
    <div>
      <span id={`${calendarType}-date-range-desc`} style={{ display: 'none' }}>
        {`Select a ${calendarType} date between ${minCalendarVal} and ${maxCalendarVal}.`}
      </span>
      <input
        id={`search-calendar-${calendarType}`}
        type='date'
        value={calendarDate || null}
        aria-label={`Set search ${calendarType} date`}
        aria-describedby={`${calendarType}-date-range-desc`}
        ref={calendarRef}
        onChange={(e) => {
          handleInputChange(e);
        }}
        min={minCalendarVal}
        max={maxCalendarVal}
      />
    </div>
  );
}