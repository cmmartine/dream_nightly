import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchPage from "../../components/Search";
import { ErrorContext } from "../../components/context/providers/ErrorProvider";
import * as dreamsApi from "../../api/dreamsApi";

let mockSetError = jest.fn();

describe('SearchPage', () => {
  function renderSearchPage() {
    render(
      <ErrorContext.Provider value={{ setError: mockSetError }}>
        <SearchPage/>
      </ErrorContext.Provider>
    )
  };

  describe('when a search is made', () => {
    it('shows a loading spinner', async () => {
      jest.spyOn(dreamsApi, 'getSearchDreams').mockReturnValue(new Promise(() => {}))
      renderSearchPage();

      const formInput = screen.getByRole('searchbox');
      await userEvent.type(formInput, 'test dream');

      const formBtn = screen.getByRole('button', { name: /search/i });
      userEvent.click(formBtn);

      expect(await screen.findByTestId('loading-container')).toBeInTheDocument();
    });

    it('calls the search api', async () => {
      jest.spyOn(dreamsApi, 'getSearchDreams').mockResolvedValue({ dreams: [], count: 0 })
      renderSearchPage();

      const formInput = screen.getByRole('searchbox');
      await userEvent.type(formInput, 'test dream');

      const formBtn = screen.getByRole('button', { name: /search/i });
      userEvent.click(formBtn);

      await waitFor(() => {
        expect(screen.queryByTestId('loading-container')).not.toBeInTheDocument();
        expect(dreamsApi.getSearchDreams).toHaveBeenCalled();
      });
    });
  });

  describe('input validation', () => {
    it(`shows an error and disables form submission when invalid and does not show an error and allows submission when valid`, async () => {
      renderSearchPage();

      const formInput = screen.getByRole('searchbox');
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