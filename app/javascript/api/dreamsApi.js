import { apiPostFetch } from "./apiUtil";

export const postDreamsFromDate = (date_in_ms, setError) => {
  const postParams = {
    dream: {
      time_in_ms: date_in_ms
    }
  };

  return apiPostFetch('dreams/from_date', postParams, setError);
};

export const postCreateDream = (dreamBody, dateTimeInMs, setError) => {
  const postParams = {
    dream: {
      body: dreamBody,
      time_in_ms: dateTimeInMs
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

  apiPostFetch('dreams/update', postParams, setError);
};