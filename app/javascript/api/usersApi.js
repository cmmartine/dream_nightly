import { getCsrfToken } from "./csrfToken";

export const getUserStatus = () => {
  return fetch('/users/status')
  .then((res) => res.json())
  .then((data) => {
    return data;
  });
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