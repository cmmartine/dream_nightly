import { getCsrfToken } from "./csrfToken";
import { apiGetFetch } from "./apiUtil";

export const getUserStatus = () => {
  return apiGetFetch('/users/status');
};

export const logout = () => {
  let csrf = getCsrfToken();
  localStorage.clear();
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