export const addOutsideClickListener = (element, onClose) => {
  const handler = (e) => {
    if (!element.contains(e.target)) {
      onClose();
    }
  };
  document.addEventListener('click', handler, true);
  return () => document.removeEventListener('click', handler, true);
};