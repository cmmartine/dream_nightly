import React from "react";
import { calendarLoadingError } from '../../constants/errors';

export default function CalendarDays(props) {
  const {
    calendarDay,
    daysInfo,
    handleDateChange
  } = props;

  const renderDaysInMonth = () => {
    if (!daysInfo || daysInfo?.length === 0) {
      return <div className='calendar-loading-error'>{calendarLoadingError}</div>
    }

    const firstDayOfWeek = daysInfo[0].day_of_week;

    const emptyCells = Array.from({ length: firstDayOfWeek }, (_, index) => (
      <div key={`empty-${index}`} className="calendar-day empty"></div>
    ));

    const dayCells = daysInfo.map((day) => (
      <div className={`calendar-day-container`}>
        <button
          key={day.num}
          className={`calendar-day ${day.has_dreams ? 'highlight' : ''} ${day.is_today ? 'calendar-today' : ''} ${day.num === calendarDay ? 'highlight-selected' : ''}`}
          aria-label='Change the day'
          onClick={() => {
            handleDateChange({ newDay: day.num })
          }}
          disabled={day.is_in_future}
        >
          {day.num}
        </button>
      </div>
    ));

    return <div className="calendar-days-container">{[...emptyCells, ...dayCells]}</div>;
  };

  return (
    <div className='calendar-days-view-container'>
      <div className='calendar-weekdays-container'>
        <div className='calendar-weekday'>Sun</div>
        <div className='calendar-weekday'>Mon</div>
        <div className='calendar-weekday'>Tue</div>
        <div className='calendar-weekday'>Wed</div>
        <div className='calendar-weekday'>Thu</div>
        <div className='calendar-weekday'>Fri</div>
        <div className='calendar-weekday'>Sat</div>
      </div>
      {renderDaysInMonth()}
    </div>
  );
}