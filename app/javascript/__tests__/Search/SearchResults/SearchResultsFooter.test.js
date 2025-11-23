import { render, screen, fireEvent } from "@testing-library/react";
import SearchResultsFooter from "../../../components/Search/SearchResults/SearchResultsFooter";
import { searchTypes } from "../../../constants/searchTypes";

describe('SearchResultsFooter', () => {
  const mockFetchSearch = jest.fn();

  function renderSearchResultsFooter(currentPage, hasNextPage) {
    return render(
      <SearchResultsFooter
        currentPage={currentPage}
        hasNextPage={hasNextPage}
        fetchSearch={mockFetchSearch}
        foundDreamsCount={1}
      />
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const header = renderSearchResultsFooter(1, true);

    expect(header).toMatchSnapshot();
  });

  describe('Next button', () => {
    it('shows when hasNextPage is true', () => {
      renderSearchResultsFooter(1, true);

      const nextBtn = screen.getByLabelText('Go to page 2 results')
      expect(nextBtn).toBeInTheDocument();
    });

    it('does not show when hasNextPage is false', () => {
      renderSearchResultsFooter(1, false);

      const nextBtn = screen.queryByLabelText('Go to page 2 results')
      expect(screen.queryAllByRole('button').length).toBe(0);
      expect(nextBtn).not.toBeInTheDocument();
    });

    it('calls fetchSearch with correct page when clicked', () => {
      const page = 1
      renderSearchResultsFooter(page, true);

      const nextBtn = screen.getByLabelText('Go to page 2 results')
      fireEvent.click(nextBtn);

      expect(mockFetchSearch).toHaveBeenCalledWith(page + 1, searchTypes.PAGE_CHANGE);
    });
  });

  describe('Prev button', () => {
    it('shows when current page is greater than 1', () =>{
      renderSearchResultsFooter(2, false);

      const prevBtn = screen.getByLabelText('Go to page 1 results')
      expect(prevBtn).toBeInTheDocument();
    });

    it('does not show when current page is 1', () =>{
      renderSearchResultsFooter(1, false);

      const prevBtn = screen.queryByLabelText('Go to page 0 results')
      expect(screen.queryAllByRole('button').length).toBe(0);
      expect(prevBtn).not.toBeInTheDocument();
    });

    it('calls fetchSearch with correct page when clicked', () => {
      const page = 2;
      renderSearchResultsFooter(page, false);

      const prevBtn = screen.getByLabelText('Go to page 1 results')
      fireEvent.click(prevBtn);

      expect(mockFetchSearch).toHaveBeenCalledWith(page - 1, searchTypes.PAGE_CHANGE);
    });
  });
});