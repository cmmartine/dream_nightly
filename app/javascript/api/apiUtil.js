import { getCsrfToken } from "./csrfToken";

export const apiGetFetch = async (url, setError) => {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`GET ${url} error: ${res.status}`);
    }

    const json = await res.json();
    return json;
  } catch (error) {
    setError(error);
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

    if (!res.ok) {
      throw new Error(`POST ${url} error: ${res.status}`);
    }

    if (res.status !== 204) {
      const json = await res.json();
      return json;
    }
  } catch (error) {
    setError(error);
  }
};