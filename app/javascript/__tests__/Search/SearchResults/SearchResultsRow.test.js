import { fireEvent, render, screen } from "@testing-library/react";
import SearchResultsRow from "../../../components/Search/SearchResults/SearchResultsRow";

jest.mock('../../../components/Dream', () => () => {
  const MockDream = 'mockDream';
  return <MockDream data-testid='mock-dream'/>
})

describe('SearchResultsRow', () => {
  const dreamed_at_ms = 1734869890000;
  const formatted_date = 'Dec 22 2024';

  const aDream = {
    id: 1,
    body: 'First dream',
    ai_interpretation: null,
    lucid: null,
    dreamed_at: dreamed_at_ms
  };
  
  const mockSetError = jest.fn();
  const mockHandleDreamDeletion = jest.fn();

  function renderSearchResultsRow() {
    return render(
      <SearchResultsRow
        dreamInfo={aDream}
        handleDreamDeletion={mockHandleDreamDeletion}
        setError={mockSetError}
      />
    )
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('first render is correct', () => {
    const results = renderSearchResultsRow();
    expect(results).toMatchSnapshot();

    expect(screen.getByText(aDream.body)).toBeInTheDocument();
    expect(screen.getByText(formatted_date)).toBeInTheDocument();
    expect(screen.queryByTestId('mock-dream')).not.toBeInTheDocument();
  })

  it('expands when button is clicked', () => {
    renderSearchResultsRow();

    const expandBtn = screen.getByRole('button');
    fireEvent.click(expandBtn);

    expect(screen.getByTestId('mock-dream')).toBeInTheDocument();
  });
});
