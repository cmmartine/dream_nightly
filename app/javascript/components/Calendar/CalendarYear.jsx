import React from "react";
import * as NONVALID_DREAM_DATE from "../../constants/shared/NONVALID_DREAM_DATE.json"

export default function CalendarYear(props) {
  const {
    calendarMonth,
    calendarYear,
    handleDateChange
  } = props;

  const validMonthForYear = () => {
    const today = new Date();

    // If selected month is in the future (going from 2024 to 2025 on Nov but it's Oct), reset calendar to January
    if(calendarYear + 1 == today.getFullYear() && calendarMonth > today.getMonth()) {
      return 0;
    } else {
      return undefined;
    }
  };

  const isPrevYearValid = () => {
      return calendarYear - 1 > Number(NONVALID_DREAM_DATE.BEFORE_YEAR);
    };
  
  const isNextYearValid = () => {
    const today = new Date();
    return calendarYear < today.getFullYear();
  };

  return (
    <div className='calendar-year-container'>
      {
        isPrevYearValid() && 
        <button
          className="calendar-year-arrow lucide--arrow-left"
          aria-label='Previous Year'
          onClick={() => handleDateChange({ newYear: calendarYear - 1 })}
        /> ||
        <div className='calendar-no-arrow'/>
      }
      {calendarYear}
      {
        isNextYearValid() && 
        <button
          className="calendar-year-arrow lucide--arrow-right"
          aria-label='Next Year'
          onClick={() => handleDateChange({ newMonth: validMonthForYear(), newYear: calendarYear + 1 })}
        /> ||
        <div className='calendar-no-arrow'/>
      }
    </div>
  );
}