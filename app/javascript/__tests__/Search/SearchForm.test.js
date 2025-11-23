import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchForm from "../../components/Search/SearchForm";

jest.mock('../../components/Search/DateRangeCalendar', () => () => {
  return <div data-testid='mock-range-calendar'/>
});

describe('SearchForm', () => {

  const mockSetSearchValue = jest.fn();
  const mockSetStartDateInMs = jest.fn();
  const mockSetEndDateInMs = jest.fn();
  const mockValidateInputLength = jest.fn();
  const mockIsValidSearch = jest.fn();
  const mockFetchSearch = jest.fn();

  const mockUseSearch = ({ searchValue = '', loading = false, showValidationMsg = false }) => {
    return {
      searchValue: searchValue,
      setSearchValue: mockSetSearchValue,
      setStartDateInMs: mockSetStartDateInMs,
      setEndDateInMs: mockSetEndDateInMs,
      loading: loading,
      minSearchLength: 3,
      showValidationMsg: showValidationMsg,
      validateInputLength: mockValidateInputLength,
      isValidSearch: mockIsValidSearch,
      fetchSearch: mockFetchSearch
    }
  }

  function renderSearchForm(mockSearchObj) {
    return render(
      <SearchForm {...mockSearchObj}/>
    )
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls setSearchValue and validateInputLength on change', async () => {
    const mockSearchObj = mockUseSearch({})
    renderSearchForm(mockSearchObj);

    const formInput = screen.getByRole('search');
    await userEvent.type(formInput, '1');

    expect(mockSetSearchValue).toHaveBeenCalled();
    expect(mockValidateInputLength).toHaveBeenCalled();
  });

  it('calls validateInputLength on blur', () => {
    const mockSearchObj = mockUseSearch({})
    renderSearchForm(mockSearchObj);

    const formInput = screen.getByRole('search');
    fireEvent.click(formInput);
    fireEvent.blur(formInput);

    expect(mockValidateInputLength).toHaveBeenCalled();
  });

  it('shows an alert message when showValidationMsg is true', () => {
    const mockSearchObj = mockUseSearch({ showValidationMsg: true })
    renderSearchForm(mockSearchObj);

    const alert = screen.queryByRole('alert');

    expect(alert).toBeInTheDocument();
  });

  it('does not show an alert message when showValidationMsg is false', () => {
    const mockSearchObj = mockUseSearch({ showValidationMsg: false })
    renderSearchForm(mockSearchObj);

    const alert = screen.queryByRole('alert');

    expect(alert).not.toBeInTheDocument();
  });

  it('disables form submission when isValidSearch is false', () => {
    mockIsValidSearch.mockReturnValue(false);
    const mockSearchObj = mockUseSearch({})
    renderSearchForm(mockSearchObj);

    const submitBtn = screen.getByRole('button', { name: 'Search' });
    expect(submitBtn).toBeDisabled();
  });

  it('show two DateRangeCalendars', () => {
    const mockSearchObj = mockUseSearch({})
    renderSearchForm(mockSearchObj);

    const calendars = screen.getAllByTestId('mock-range-calendar');
    expect(calendars.length).toEqual(2);
  });
});