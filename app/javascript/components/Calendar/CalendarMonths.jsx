import React from "react";

export default function CalendarMonths(props) {
  const {
    calendarMonth,
    monthsInfo,
    handleDateChange
  } = props;

  const renderMonthsInYear = () => {
    if (!monthsInfo) return null;

    return monthsInfo.map((month) => (
      <button
        key={month.num}
        className={`calendar-month ${month.has_dreams ? 'highlight' : ''} ${month.is_current ? 'calendar-today' : ''} ${month.num === calendarMonth - 1 ? 'highlight-selected' : ''}`}
        aria-label='Change the month'
        onClick={() => {
          handleDateChange({ newDay: 1, newMonth: month.num })
        }}
      >
        {month.short_name}
      </button>
    ));
  };

  return (
    <div className='calendar-months-view-container'>
      {renderMonthsInYear()}
    </div>
  );
}