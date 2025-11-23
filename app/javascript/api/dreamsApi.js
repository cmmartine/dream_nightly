import { apiGetFetch, apiPostFetch } from "./apiUtil";

export const getDreamsFromDate = (dateInMs, userTimezone, setError) => {
  const getParams = {
    time_in_ms: dateInMs,
    user_timezone: userTimezone
  };

  return apiGetFetch('dreams/from_date', setError, getParams);
};

export const postCreateDream = (dreamBody, dateTimeInMs, userTimezone, setError) => {
  const postParams = {
    dream: {
      body: dreamBody,
      time_in_ms: dateTimeInMs,
      user_timezone: userTimezone
    }
  };

  return apiPostFetch('dreams/create', postParams, setError);
};

export const postUpdateDream = (dreamId, dreamBody, setError) => {
  const postParams = {
    dream: {
      dream_id: dreamId,
      body: dreamBody
    }
  };

  return apiPostFetch('dreams/update', postParams, setError);
};

export const postDeleteDream = (dreamId, setError) => {
  const postParams = {
    dream: {
      dream_id: dreamId
    }
  }

  apiPostFetch('dreams/destroy', postParams, setError);
};

export const getSearchDreams = (getParams, setError) => {
  return apiGetFetch('dreams/search', setError, getParams)
};