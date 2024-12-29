import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dream from "../components/Dream";

jest.mock('../components/DreamInput', () => () => {
  const MockDreamInput = 'DreamInput';
  return <MockDreamInput data-testid='mock-dream-input'/>
});

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

    it('shows expand button', () => {
      renderDream(aDream);
      expect(screen.getByTestId('expand-btn')).toBeInTheDocument();
    });

    describe('When the expand button is clicked', () => {
      it('changes to show the unexpand button', async () => {
        renderDream(aDream);
        await userEvent.click(screen.queryByTestId('expand-btn'));
        expect(screen.queryByTestId('expand-btn')).not.toBeInTheDocument();
        expect(screen.queryByTestId('unexpand-btn')).toBeInTheDocument();
      });

      it('shows a edit dream input form', async () => {
        renderDream(aDream);
        await userEvent.click(screen.queryByTestId('expand-btn'));
        expect(await screen.findByTestId('mock-dream-input')).toBeInTheDocument();
      });

      describe('when the unexpand button is clicked', () => {
        it('changes back to showing the expand button', async () => {
          renderDream(aDream);
          await userEvent.click(screen.queryByTestId('expand-btn'));
          await userEvent.click(screen.queryByTestId('unexpand-btn'));
          expect(screen.queryByTestId('unexpand-btn')).not.toBeInTheDocument();
          expect(screen.queryByTestId('expand-btn')).toBeInTheDocument();
        });
      });
    });
  });
});