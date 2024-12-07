import { getCsrfToken } from "./csrfToken";

export const getUserStatus = (setUserStatus, setError) => {
  return fetch('/users/status')
  .then((res) => res.json())
  .then((data) => {
    setUserStatus(data.status);
  })
  .catch((error) => {
    setError(error);
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

export const redirectToSignIn = () => {
  location.href = "users/sign_in"
};

export const redirectToSignUp = () => {
  location.href = "users/sign_up"
};