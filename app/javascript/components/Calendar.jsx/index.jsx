import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { getCalendarDaysInfo } from '../../api/calendarApi';
import { addOutsideClickListener } from '../../util/elementUtils';
import * as NONVALID_DREAM_DATE from "../../constants/shared/NONVALID_DREAM_DATE.json"

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
    newDreamId,
    deletedDreamId,
    setError 
  } = props;
  const [daysInfo, setDaysInfo] = useState(null);
  const [monthsInfo, setMonthsInfo] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef();

  useEffect(() => {
    if (calendarYear && calendarMonth) {
      fetchCalendarSetupInfo(calendarYear, calendarMonth);
    };
  }, [calendarYear, calendarMonth, newDreamId, deletedDreamId]);

  useEffect(() => {
    setToToday();
  }, []);

  useEffect(() => {
    let cleanupFunction;
    if(showCalendar && calendarRef?.current) {
      cleanupFunction = addOutsideClickListener(calendarRef.current, () => setShowCalendar(false));
    };

    return () => {
      if (cleanupFunction) cleanupFunction();
    };
  }, [showCalendar]);

  const setToToday = () => {
    const today = new Date();
    handleDateChange({
      newYear: today.getFullYear(),
      newMonth: today.getMonth(),
      newDay: today.getDate(),
    })
  };

  const fetchCalendarSetupInfo = async (year, month) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const data = await getCalendarDaysInfo(year, month, userTimeZone, setError);
    setDaysInfo(data.days);
    setMonthsInfo(data.months);
  };

  const setCalendarStateFromDate = (year, month, day) => {
    setCalendarYear(year);
    setCalendarMonth(month + 1);
    setCalendarDay(day);
  };

  const handleDateChange = ({ newYear, newMonth, newDay }) => {
    const year = newYear != null ? newYear : calendarYear;
    const month = newMonth != null ? newMonth : calendarMonth - 1;
    const day = newDay != null ? newDay : calendarDay;
    const newDateTime = new Date(year, month, day);
    setCalendarStateFromDate(year, month, day);
    const newDateTimeInMs = convertDateTimeToMs(newDateTime);
    setDateTimeInMs(newDateTimeInMs);
  };

  const renderCalendarHeader = () => {
    return (
      <div className='calendar-header-container'>
        <div></div>
        <button className='calendar-header' aria-label={`${showCalendar ? 'Close' : 'Open'} Calendar`} onClick={() => {
          setShowCalendar((prev) => !prev);
        }}>
          {months[calendarMonth - 1]} {calendarDay} {calendarYear}
        </button>
        { 
          showCalendar ?
          <button className='calendar-reset-btn' onClick={() => {
            setToToday();
          }}>
            Today
          </button>
          :
          <div></div>
        }
      </div>
    )
  };

  const renderDaysInMonth = () => {
    if (!daysInfo) return null;

    const firstDayOfWeek = daysInfo[0].day_of_week;

    const emptyCells = Array.from({ length: firstDayOfWeek }, (_, index) => (
      <div key={`empty-${index}`} className="calendar-day empty"></div>
    ));

    const dayCells = daysInfo.map((day) => (
      <div className={`calendar-day-container`}>
        <button
          key={day.day_num}
          className={`calendar-day ${day.has_dreams ? 'highlight' : ''} ${day.is_today ? 'calendar-today' : ''}`}
          aria-label='Change the day'
          onClick={() => {
            handleDateChange({ newDay: day.num })
          }}
        >
          {day.num}
        </button>
      </div>
    ));

    return [...emptyCells, ...dayCells];
  };

  const renderMonthsInYear = () => {
    if (!monthsInfo) return;

    return monthsInfo.map((month) => (
      <button className={`calendar-month ${month.has_dreams ? 'highlight' : ''} ${month.is_current ? 'calendar-today' : ''}`} onClick={() => {
        handleDateChange({ newDay: 1, newMonth: month.num })
      }}>
        {month.short_name}
      </button>
    ));
  };

  const isPrevYearValid = () => {
    return calendarYear - 1 > Number(NONVALID_DREAM_DATE.BEFORE_YEAR);
  };

  const isNextYearValid = () => {
    const today = new Date();
    return calendarYear + 1 < today.getFullYear() + 1;
  };

  return(
    (calendarYear && calendarMonth && calendarDay) && (
      showCalendar && <div ref={calendarRef} className='calendar-container calendar-open'>
        {renderCalendarHeader()}
        <div className='calendar-year-container'>
          {
            isPrevYearValid() && 
            <button
              className="calendar-year-arrow lucide--arrow-left"
              aria-label='Previous Year'
              onClick={() => handleDateChange({ newYear: calendarYear - 1})}
            /> ||
            <div className='calendar-no-arrow'/>
          }
          {calendarYear}
          {
            isNextYearValid() && 
            <button
              className="calendar-year-arrow lucide--arrow-right"
              aria-label='Next Year'
              onClick={() => handleDateChange({ newYear: calendarYear + 1})}
            /> ||
            <div className='calendar-no-arrow'/>
          }
        </div>
        <div className='calendar-months-view-container'>
          {renderMonthsInYear()}
        </div>
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
          <div className="calendar-days-container">{renderDaysInMonth()}</div>
        </div>
      </div>
      ||
      <div ref={calendarRef} className='calendar-container calendar-closed'>
        {renderCalendarHeader()}
      </div>
    )
  )
};