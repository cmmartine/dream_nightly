import { render, screen } from "@testing-library/react";
import Dream from "../components/Dream";

describe('Dream', () => {
  const aDream = {
    id: 1,
    body: 'First dream',
    ai_interpretation: null,
    lucid: null,
    created_at: 1734869890
  }

  function renderDream(dreamInfo) {
    return render(
      <Dream dreamInfo={dreamInfo}/>
    )
  };

  describe('When first rendered', () => {
    it('displays the dreams body text', () => {
      renderDream(aDream);
      expect(screen.getByText(aDream.body)).toBeInTheDocument();
    });
  });
});