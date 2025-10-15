import React from "react";

export default function CalendarHeader(props) {
  const {
    calendarDay,
    calendarMonth,
    calendarYear,
    showCalendar,
    setShowCalendar
  } = props;

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

  return (
    <div className='calendar-header-container'>
      <div></div>
      <button className='calendar-header' aria-label={`${showCalendar ? 'Close' : 'Open'} Calendar`} onClick={() => {
        setShowCalendar((prev) => !prev);
      }}>
        {months[calendarMonth - 1]} {calendarDay} {calendarYear}
      </button>
    </div>
  );
}