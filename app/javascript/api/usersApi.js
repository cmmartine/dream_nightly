export const getUserStatus = () => {
  return fetch('/users/status')
  .then((res) => res.json())
  .then((data) => {
    return data;
  });
};