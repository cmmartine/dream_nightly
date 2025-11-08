import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import DateRangeCalendar from "../../components/Search/DateRangeCalendar";
import * as NONVALID_DREAM_DATE from '../../constants/shared/NONVALID_DREAM_DATE.json';

describe('DateRangeCalendar', () => {
  const setDateTimeInMs = jest.fn();

  function renderDateRangeCalendar(calendarType='start') {
    return render(
      <DateRangeCalendar setDateTimeInMs={setDateTimeInMs} calendarType={calendarType}/>
    )
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('updates state when calendar values are changed', () => {
    renderDateRangeCalendar();
    const calendar = screen.getByLabelText('Set search start date')
    fireEvent.change(calendar, { target: { value: '2025-07-15' } });
    expect(calendar.value).toBe('2025-07-15');
    expect(setDateTimeInMs).toHaveBeenCalled();
  });

  it(`with a type of start, sets state and calendar input to 01-01-${parseInt(NONVALID_DREAM_DATE.BEFORE_YEAR) + 1}`, async () => {
    const dateString = `${parseInt(NONVALID_DREAM_DATE.BEFORE_YEAR) + 1}-01-01`;
    renderDateRangeCalendar();
    const calendar = screen.getByLabelText('Set search start date')
    expect(calendar.value).toBe(dateString);
    expect(setDateTimeInMs).toHaveBeenCalled();
  });

  it(`with a type of end, sets state and calendar input to today`, async () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = (today.getMonth() + 1).toString().padStart(2, '0');
    const dd = today.getDate().toString().padStart(2, '0');
    const todayString = `${yyyy}-${mm}-${dd}`;
    renderDateRangeCalendar('end');
    const calendar = screen.getByLabelText('Set search end date')
    expect(calendar.value).toBe(todayString);
    expect(setDateTimeInMs).toHaveBeenCalled();
  });

  describe('When a new date is selected', () => {
    it('updates state when calendar values are changed', async () => {
      renderDateRangeCalendar();
      const calendar = screen.getByLabelText('Set search start date')
      fireEvent.change(calendar, { target: { value: '2025-07-15' } });
      expect(calendar.value).toBe('2025-07-15');
      expect(setDateTimeInMs).toHaveBeenCalled();
    });
  });

  it('sets correct min and max attributes on the input', () => {
    renderDateRangeCalendar();

    const calendar = screen.getByLabelText('Set search start date');
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = (today.getMonth() + 1).toString().padStart(2, '0');
    const dd = today.getDate().toString().padStart(2, '0');
    const todayString = `${yyyy}-${mm}-${dd}`;
    const minDate = `${parseInt(NONVALID_DREAM_DATE.BEFORE_YEAR) + 1}-01-01`;

    expect(calendar).toHaveAttribute('min', minDate);
    expect(calendar).toHaveAttribute('max', todayString);
  });

  it('links aria-describedby to the hidden description span', () => {
    renderDateRangeCalendar();
    const calendar = screen.getByLabelText('Set search start date');
    const desc = screen.getByText(/select a start date/i);

    expect(calendar).toHaveAttribute('aria-describedby', desc.id);
  });
});