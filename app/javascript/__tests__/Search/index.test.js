import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchPage from "../../components/Search";
import { ErrorContext } from "../../components/context/providers/ErrorProvider";
import * as dreamsApi from "../../api/dreamsApi";

let mockSetError = jest.fn();

describe('SearchPage', () => {
  const dreamed_at_ms = 1734869890000;
  const firstDreamBody = 'First dream';
  const secondDreamBody = 'Second dream'
  const returnedDreamsInfo = {
    dreams: [
      {
        id: 1,
        body: firstDreamBody,
        ai_interpretation: null,
        lucid: null,
        dreamed_at: dreamed_at_ms
      }, 
      {
        id: 2,
        body: secondDreamBody,
        ai_interpretation: null,
        lucid: null,
        dreamed_at: dreamed_at_ms
      }
    ],
    count: 2
  };

  function renderSearchPage() {
    return render(
      <ErrorContext.Provider value={{ setError: mockSetError }}>
        <SearchPage/>
      </ErrorContext.Provider>
    )
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when a search is made', () => {
    it('shows a loading spinner', async () => {
      jest.spyOn(dreamsApi, 'getSearchDreams').mockReturnValue(new Promise(() => {}))
      renderSearchPage();

      const formInput = screen.getByRole('search');
      await userEvent.type(formInput, 'test dream');

      const formBtn = screen.getByRole('button', { name: /search/i });
      userEvent.click(formBtn);

      expect(await screen.findByTestId('loading-container')).toBeInTheDocument();
    });

    it('calls the search api', async () => {
      jest.spyOn(dreamsApi, 'getSearchDreams').mockResolvedValue({ dreams: [], count: 0 });
      renderSearchPage();

      const formInput = screen.getByRole('search');
      await userEvent.type(formInput, 'test dream');

      const formBtn = screen.getByRole('button', { name: /search/i });
      userEvent.click(formBtn);

      await waitFor(() => {
        expect(screen.queryByTestId('loading-container')).not.toBeInTheDocument();
        expect(dreamsApi.getSearchDreams).toHaveBeenCalled();
      });
    });

    it('shows the results header, correct number of rows, and footer when there are dreams returned', async () => {
      jest.spyOn(dreamsApi, 'getSearchDreams').mockResolvedValue(returnedDreamsInfo);
      renderSearchPage();

      const formInput = screen.getByRole('search');
      await userEvent.type(formInput, 'test dream');

      const formBtn = screen.getByRole('button', { name: /search/i });
      userEvent.click(formBtn);

      await waitFor(() => {
        expect(screen.getByText('2 dreams containing test dream on this page')).toBeInTheDocument();
        expect(screen.getByText(firstDreamBody)).toBeInTheDocument();
        expect(screen.getByText(secondDreamBody)).toBeInTheDocument();
        expect(screen.getByLabelText('Current page number: 1')).toBeInTheDocument();
      });
    });

    it('shows a no results message when no matching dreams are found', async () => {
      jest.spyOn(dreamsApi, 'getSearchDreams').mockResolvedValue({ dreams: [], count: 0 });
      renderSearchPage();

      const formInput = screen.getByRole('search');
      await userEvent.type(formInput, 'test dream');

      const formBtn = screen.getByRole('button', { name: /search/i });
      userEvent.click(formBtn);

      await waitFor(() => {
        expect(screen.getByText('No results were found. Please try a different search phrase.')).toBeInTheDocument();
      });
    });
  });

  describe('input validation', () => {
    it(`shows an error and disables form submission when invalid and does not show an error and allows submission when valid`, async () => {
      renderSearchPage();

      const formInput = screen.getByRole('search');
      await userEvent.type(formInput, 'te');

      const formBtn = screen.getByRole('button', { name: /search/i });
      const inputErrorMsg = await screen.findByText(/please enter at least/i);

      expect(inputErrorMsg).toBeVisible();
      expect(formBtn).toBeDisabled();

      await userEvent.clear(formInput);
      await userEvent.type(formInput, 'test');

      expect(await screen.queryByText(/please enter at least/i)).not.toBeInTheDocument();
      expect(formBtn).not.toBeDisabled();
    });
  });
});