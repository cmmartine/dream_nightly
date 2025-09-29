export const addOutsideClickListener = (element, onClose) => {
  const elePosition = element.getBoundingClientRect();
  const handler = (e) => {
    let posX = e.clientX;
    let posY = e.clientY;
    const posXOutOfBox = posX < elePosition.left || posX > elePosition.right;
    const posYOutofBox = posY < elePosition.top || posY > elePosition.bottom;
    if (posXOutOfBox || posYOutofBox) {
      onClose();
    }
  };
  document.addEventListener('click', handler);
  return () => document.removeEventListener('click', handler);
};
