import { render, screen, fireEvent } from "@testing-library/react";
import SearchResultsHeader from "../../../components/Search/SearchResults/SearchResultsHeader";

describe('SearchResultsHeader', () => {
  const activeSearchPhrase = 'Test phrase';
  const foundDreamsCount = 10;
  const mockClearSearch = jest.fn();

  function renderSearchResultsHeader() {
    return render(
      <SearchResultsHeader
        activeSearchPhrase={activeSearchPhrase}
        foundDreamsCount={foundDreamsCount}
        clearSearch={mockClearSearch}
      />
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const header = renderSearchResultsHeader();

    expect(header).toMatchSnapshot();
  });

  it('calls clearSearch when the clear search button is clicked', () => {
    renderSearchResultsHeader();

    const clearSearchBtn = screen.getByRole('button');
    fireEvent.click(clearSearchBtn);

    expect(mockClearSearch).toHaveBeenCalled();
  });
});