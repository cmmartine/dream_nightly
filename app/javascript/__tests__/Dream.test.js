import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dream from "../components/Dream";

jest.mock('../components/DreamInput', () => () => {
  const MockDreamInput = 'DreamInput';
  return <MockDreamInput data-testid='mock-dream-input'/>
});

describe('Dream', () => {
  const dreamed_at_ms = 1734869890000
  const dreamed_at_date = new Date(dreamed_at_ms)
  const dreamed_at_to_local_est = dreamed_at_date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const aDream = {
    id: 1,
    body: 'First dream',
    ai_interpretation: null,
    lucid: null,
    dreamed_at: dreamed_at_ms
  }

  const removeDreamFromPage = jest.fn();
  const setError = jest.fn();
  const scrollIntoViewMock = jest.fn();
  const handleSearchRowExpandClick = jest.fn();

  function renderDream(dreamInfo, dreamRef, isSearch) {
    return render(
      <Dream
        dreamInfo={dreamInfo}
        removeDreamFromPage={removeDreamFromPage}
        setError={setError}
        newDreamRef={dreamRef}
        isSearch={isSearch}
        handleSearchRowExpandClick={handleSearchRowExpandClick}
      />
    )
  };

  describe('When first rendered', () => {
    beforeEach(() => {
      Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
        writable: true,
        value: scrollIntoViewMock,
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    })

    it('displays the dreams created at local time', () => {
      renderDream(aDream);
      expect(screen.getByText(dreamed_at_to_local_est)).toBeInTheDocument();
    });

    it('displays the dreams body text', () => {
      renderDream(aDream);
      expect(screen.getByText(aDream.body)).toBeInTheDocument();
    });

    it('shows expand button', () => {
      renderDream(aDream);
      expect(screen.getByTestId('expand-btn')).toBeInTheDocument();
    });

    it('applies the highlight-container class when rendered with a ref', () => {
      const newDreamRef = { current: <div/> };
      renderDream(aDream, newDreamRef);
      const container = screen.getByText(aDream.body).closest('.dream-container');
      expect(container).toHaveClass('highlight-container');
    });

    it('does not apply the highlight-container class when rendered with no ref', () => {
      renderDream(aDream);
      const container = screen.getByText(aDream.body).closest('.dream-container');
      expect(container).not.toHaveClass('highlight-container');
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

      it('calls scroll to view', async () => {
        renderDream(aDream);
        await userEvent.click(screen.queryByTestId('expand-btn'));
        expect(scrollIntoViewMock).toBeCalledTimes(1);
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

  describe('when passed search props', () => {
    it('shows a minimize button and calls the minimize function passed in when clicked', async () => {
      renderDream(aDream, null, true);

      const minimizeBtn = screen.queryByTestId('minimize-btn')
      expect(minimizeBtn).toBeInTheDocument();

      await userEvent.click(minimizeBtn);
      expect(handleSearchRowExpandClick).toHaveBeenCalled();
    });
  });
});