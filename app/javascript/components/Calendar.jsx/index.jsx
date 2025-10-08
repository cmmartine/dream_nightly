import React from 'react';
import { useState, useEffect } from 'react';
import { getCalendarDaysInfo } from '../../api/calendarApi';

const months = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December'
};

export default function Calendar(props) {
  const { 
    setDateTimeInMs,
    convertDateTimeToMs,
    calendarDay,
    calendarMonth,
    calendarYear,
    setCalendarDay,
    setCalendarMonth,
    setCalendarYear,
    setError 
  } = props;
  const [daysInfo, setDaysInfo] = useState(null);
  const [calendarValue, setCalendarValue] = useState();

  useEffect(() => {
    if (calendarYear && calendarMonth) {
      fetchCalendarSetupInfo(calendarYear, calendarMonth);
    };
  }, [calendarYear, calendarMonth]);

  useEffect(() => {
    const today = new Date();
    setCalendarStateFromDate(today);
  })

  const renderDaysInMonth = () => {
    if (!daysInfo) return null;

    const firstDayOfWeek = daysInfo[0].day_of_week;

    const emptyCells = Array.from({ length: firstDayOfWeek }, (_, index) => (
      <div key={`empty-${index}`} className="calendar-day empty"></div>
    ));

    const dayCells = daysInfo.map((day) => (
      <div className={`calendar-day-container`}>
        <div
          key={day.day_num}
          className={`calendar-day ${day.day_has_dreams ? 'highlight' : ''}`}
        >
          {day.day_num}
        </div>
      </div>
    ));

    return [...emptyCells, ...dayCells];
  };

  const fetchCalendarSetupInfo = async (year, month) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const data = await getCalendarDaysInfo(year, month, userTimeZone, setError);
    setDaysInfo(data.days);
  };

  const setCalendarStateFromDate = (date) => {
    const dateYear = date.getFullYear();
    const dateMonth = date.getMonth() + 1;
    const dateDay = date.getDate();
    setCalendarYear(dateYear);
    setCalendarMonth(dateMonth);
    setCalendarDay(dateDay);
    const dateForCalendar = `${dateDay} ${months[dateMonth - 1]} ${dateYear}`;
    setCalendarValue(dateForCalendar);
  };

  const handleDateChange = (e) => {
    const [year, month, day] = e.target.value.split('-').map(Number);
    const newDateTime = new Date(year, month - 1, day);
    setCalendarStateFromDate(newDateTime);
    const newDateTimeInMs = convertDateTimeToMs(newDateTime);
    setDateTimeInMs(newDateTimeInMs);
  };

  return(
    <div className='calendar-container'>
      <div className='calendar-header'>
        <button className='prev-month'>
          left arrow
        </button>
        <button className='current-date'>
          {calendarValue}
        </button>
        <button className='next-month'>
          right arrow
        </button>
      </div>
      <div className='calendar-weekdays-container'>
        <div className='calendar-weekday'>Sun</div>
        <div className='calendar-weekday'>Mon</div>
        <div className='calendar-weekday'>Tue</div>
        <div className='calendar-weekday'>Wed</div>
        <div className='calendar-weekday'>Thu</div>
        <div className='calendar-weekday'>Fri</div>
        <div className='calendar-weekday'>Sat</div>
      </div>
      <div className="calendar-days-container">{renderDaysInMonth()}</div>
    </div>
  )
};