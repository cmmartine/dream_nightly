import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { getCalendarInfo } from '../../api/calendarApi';
import { addOutsideClickListener } from '../../util/elementUtils';
import CalendarHeader from './CalendarHeader';
import CalendarYear from './CalendarYear';
import CalendarMonths from './CalendarMonths';
import CalendarDays from './CalendarDays';
import { useVisibility } from '../context/providers/VisibilityProvider';

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
  const isVisible = useVisibility();

  useEffect(() => {
    if (calendarYear && calendarMonth) {
      fetchCalendarSetupInfo(calendarYear, calendarMonth);
    };
  }, [calendarYear, calendarMonth, newDreamId, deletedDreamId]);

  useEffect(() => {
    if (isVisible) {
      setToToday();
    }
  }, [isVisible])

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
    const data = await getCalendarInfo(year, month, userTimeZone, setError);
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

  return(
    (calendarYear && calendarMonth && calendarDay) && (
      showCalendar && <div ref={calendarRef} className='calendar-container calendar-open'>
        <CalendarHeader
          calendarDay={calendarDay}
          calendarMonth={ calendarMonth}
          calendarYear={calendarYear}
          showCalendar={showCalendar}
          setShowCalendar={setShowCalendar}
        />
        <CalendarYear
          calendarMonth={calendarMonth}
          calendarYear={calendarYear}
          handleDateChange={handleDateChange}
        />
        <CalendarMonths
          calendarMonth={calendarMonth}
          monthsInfo={monthsInfo}
          handleDateChange={handleDateChange}
        />
        <CalendarDays
          calendarDay={calendarDay}
          daysInfo={daysInfo}
          handleDateChange={handleDateChange}
        />
      </div>
      ||
      <div ref={calendarRef} className='calendar-container calendar-closed'>
        <CalendarHeader
          calendarDay={calendarDay}
          calendarMonth={ calendarMonth}
          calendarYear={calendarYear}
          showCalendar={showCalendar}
          setShowCalendar={setShowCalendar}
        />
      </div>
    )
  )
};