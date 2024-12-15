import { apiPostFetch } from "./apiUtil";

export const postDreamsFromDate = (date_in_ms, setError) => {
  const postParams = {
    dream: {
      time_in_ms: date_in_ms
    }
  };

  return apiPostFetch('dreams/from_date', postParams, setError);
};