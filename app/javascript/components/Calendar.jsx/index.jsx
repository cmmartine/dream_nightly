import React from 'react';
import { useState, useEffect } from 'react';
import { getCalendarDaysInfo } from '../../api/calendarApi';

const months = {
  0: {
    long: 'January',
    short: 'Jan'
  },
  1: {
    long: 'February',
    short: 'Feb'
  },
  2: {
    long: 'March',
    short: 'Mar'
  },
  3: {
    long: 'April',
    short: 'Apr'
  },
  4: {
    long: 'May',
    short: 'May'
  },
  5: {
    long: 'June',
    short: 'Jun'
  },
  6: {
    long: 'July',
    short: 'Jul'
  },
  7: {
    long: 'August',
    short: 'Aug'
  },
  8: {
    long: 'September',
    short: 'Sep'
  },
  9: {
    long: 'October',
    short: 'Oct'
  },
  10: {
    long: 'November',
    short: 'Nov'
  },
  11: {
    long: 'December',
    short: 'Dec'
  }
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

  useEffect(() => {
    if (calendarYear && calendarMonth) {
      fetchCalendarSetupInfo(calendarYear, calendarMonth);
    };
  }, [calendarYear, calendarMonth]);

  useEffect(() => {
    const today = new Date();
    handleDateChange({
      newYear: today.getFullYear(),
      newMonth: today.getMonth(),
      newDay: today.getDate(),
    })
  }, []);

  const fetchCalendarSetupInfo = async (year, month) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const data = await getCalendarDaysInfo(year, month, userTimeZone, setError);
    setDaysInfo(data.days);
  };

  const setCalendarStateFromDate = (year, month, day) => {
    setCalendarYear(year);
    setCalendarMonth(month + 1);
    setCalendarDay(day);
  };

  const handleDateChange = ({ newYear, newMonth, newDay }) => {
    const year = newYear || calendarYear;
    const month = newMonth || calendarMonth - 1;
    const day = newDay || calendarDay;
    const newDateTime = new Date(year, month, day);
    setCalendarStateFromDate(year, month, day);
    const newDateTimeInMs = convertDateTimeToMs(newDateTime);
    setDateTimeInMs(newDateTimeInMs);
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
          className={`calendar-day ${day.day_has_dreams ? 'highlight' : ''} ${day.is_today ? 'calendar-today' : ''}`}
          aria-label='Change the day'
          onClick={() => {
            handleDateChange({ newDay: day.day_num })
          }}
        >
          {day.day_num}
        </button>
      </div>
    ));

    return [...emptyCells, ...dayCells];
  };

  const renderMonthsInYear = () => {
    let monthButtons = [];
    Object.keys(months).forEach((month) => {
      monthButtons.push(
        <button className='calendar-month-selector'>
          {months[month].short}
        </button>
      );
    });

    return monthButtons;
  };

  return(
    (calendarYear && calendarMonth && calendarDay) && 
    <div className='calendar-container'>
      <div className='calendar-header'>
        <button className='calendar-date'>
          {months[calendarMonth - 1].long}
        </button>
        <button className='calendar-date'>
          {calendarDay}
        </button>
        <button className='calendar-date'>
          {calendarYear}
        </button>
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
  )
};