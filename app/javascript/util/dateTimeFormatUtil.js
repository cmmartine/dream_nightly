export function formatDateStringFromBackendMs(ms) {
  const date = new Date(ms);
  const dateYear = date.getFullYear();
  const dateMonth = date.toLocaleString('default', { month: 'short' });
  const dateDay = date.getDate();
  return `${dateMonth} ${dateDay} ${dateYear}`;
};

export function formatTimeFromBackendMs(ms) {
  const date = new Date(ms);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};