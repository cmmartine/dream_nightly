import { renderHook, act, waitFor } from '@testing-library/react';
import { useSearch } from "../../../components/Search/hooks/useSearch";
import * as dreamsApi from "../../../api/dreamsApi";
import * as MAX_COUNTS from "../../../constants/shared/MAX_COUNTS.json";
import { ErrorContext } from '../../../components/context/providers/ErrorProvider';

jest.useFakeTimers();
jest.mock('../../../api/dreamsApi');

const mockSetError = jest.fn();

const wrapper = ({ children }) => (
  <ErrorContext.Provider value={{ setError: mockSetError }}>
    {children}
  </ErrorContext.Provider>
);

describe('useSearch', () => {
  const returnedDreams = {
    dreams: [
      {
        id: 1,
        body: 'Test body',
        ai_interpretation: null,
        lucid: false,
        dreamed_at: 1762214040000
      }
    ],
    count: 1
  }

  beforeEach(() => {
    jest.spyOn(dreamsApi, 'getSearchDreams').mockResolvedValue(returnedDreams);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default state and return values', () => {
    const { result } = renderHook(() => useSearch(), { wrapper });

    expect(result.current.searchValue).toBe('');
    expect(result.current.loading).toBe(false);
    expect(result.current.showValidationMsg).toBe(false);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.minSearchLength).toBe(MAX_COUNTS.MIN_SEARCH_LENGTH);
    expect(result.current.foundDreams).toEqual([]);
    expect(result.current.foundDreamsCount).toBe(0);
  });

  it('shows validation message for short input after debounce', () => {
    const { result } = renderHook(() => useSearch(), { wrapper });

    act(() => {
      result.current.validateInputLength('te');
      jest.advanceTimersByTime(500);
    });

    expect(result.current.showValidationMsg).toBe(true);
  });

  it('hides validation message for valid input immediately', () => {
    const { result } = renderHook(() => useSearch(), { wrapper });

    result.current.validateInputLength('lucid');

    expect(result.current.showValidationMsg).toBe(false);
  });

  it('hides validation message for empty input', () => {
    const { result } = renderHook(() => useSearch(), { wrapper });

    result.current.validateInputLength('');

    expect(result.current.showValidationMsg).toBe(false);
  });


  it('returns false if input is too short or matches active phrase', async () => {
    const { result } = renderHook(() => useSearch(), { wrapper });

    act(() => {
      result.current.setSearchValue('te');
    });

    expect(result.current.isValidSearch()).toBe(false);

    act(() => {
      result.current.setSearchValue('lucid');
    });

    expect(result.current.isValidSearch()).toBe(true);

    act(() => {
      result.current.fetchSearch(1);
      jest.advanceTimersByTime(500);
    });

    expect(result.current.isValidSearch()).toBe(false);
  });

  it('fetches search results and updates state', async () => {
    const { result } = renderHook(() => useSearch(), { wrapper });

    act(() => {
      result.current.setSearchValue('lucid');
    });

    act(() => {
      result.current.fetchSearch(2);
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.currentPage).toBe(2);
      expect(result.current.foundDreams).toEqual(returnedDreams.dreams);
      expect(result.current.foundDreamsCount).toBe(returnedDreams.count);
    })
  });


});