import { getCsrfToken } from "./csrfToken";
import { apiGetFetch } from "./apiUtil";

export const getUserStatus = (setError) => {
  return apiGetFetch('/users/status', setError);
};

export const logout = () => {
  let csrf = getCsrfToken();
  fetch('/users/sign_out', {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
      'X-CSRF-Token': csrf,
    }
  }).then(() => {
    
    location.reload();
  });
};