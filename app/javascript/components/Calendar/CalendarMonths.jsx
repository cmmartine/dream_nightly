import React from "react";

export default function CalendarMonths(props) {
  const {
    calendarMonth,
    monthsInfo,
    handleDateChange
  } = props;

  const renderMonthsInYear = () => {
    if (!monthsInfo) return;

    return monthsInfo.map((month) => (
      <button className={`calendar-month ${month.has_dreams ? 'highlight' : ''} ${month.is_current ? 'calendar-today' : ''} ${month.num === calendarMonth - 1 ? 'highlight-selected' : ''}`} onClick={() => {
        handleDateChange({ newDay: 1, newMonth: month.num })
      }}>
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