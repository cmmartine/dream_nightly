import React from "react";
import { calendarLoadingError } from '../../constants/errors';

export default function CalendarMonths(props) {
  const {
    calendarMonth,
    monthsInfo,
    handleDateChange
  } = props;

  const renderMonthsInYear = () => {
    if (!monthsInfo || monthsInfo?.length === 0) {
      return <div className='calendar-loading-error'>{calendarLoadingError}</div>
    };

    return <div className='calendar-months-view-container'>
      {monthsInfo.map((month) => (
        <button
          key={month.num}
          className={`calendar-month ${month.has_dreams ? 'highlight' : ''} ${month.is_current ? 'calendar-today' : ''} ${month.num === calendarMonth - 1 ? 'highlight-selected' : ''}`}
          aria-label='Change the month'
          onClick={() => {
            handleDateChange({ newDay: 1, newMonth: month.num })
          }}
          disabled={month.is_in_future}
        >
          {month.short_name}
        </button>
      ))}
    </div>
  };

  return (
    <div>{renderMonthsInYear()}</div>
  );
}