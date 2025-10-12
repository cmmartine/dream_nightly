import { apiGetFetch } from "./apiUtil";

export const getCalendarDaysInfo = (year, month, userTimezone, setError) => {
  const getParams = {
    year: year,
    month: month,
    user_timezone: userTimezone
  }

  return apiGetFetch('calendar/info', setError, getParams)
};
