import { apiPostFetch } from "./apiUtil";

export const postDreamsFromDate = (dateInMs, userTimezone, setError) => {
  const postParams = {
    dream: {
      time_in_ms: dateInMs,
      user_timezone: userTimezone
    }
  };

  return apiPostFetch('dreams/from_date', postParams, setError);
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