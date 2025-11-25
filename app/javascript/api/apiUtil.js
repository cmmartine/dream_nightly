import { getCsrfToken } from "./csrfToken";

export const apiGetFetch = async (baseUrl, setError, getParams) => {
  try {
    const url = new URL(baseUrl, window.location.origin);
    url.search = new URLSearchParams(getParams).toString();
    
    const res = await fetch(url);

    const json = await res.json();

    if (!res.ok) {
      throw new Error(`${res.status}: ${json.message}`);
    }

    return json;
  } catch (error) {
    if(setError) {
      setError(error);
    }
  }
};

export const apiPostFetch = async (url, postParams, setError) => {
  try {
    let csrf = getCsrfToken();
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRF-Token': csrf,
      },
      body: 
        JSON.stringify(postParams)
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(`${res.status}: ${json.message || res.statusText}`);
    }

    return json;
  } catch (error) {
    setError(error);
  }
};