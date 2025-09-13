import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import DreamsCalendar from "../components/DreamsCalendar";

describe('DreamsCalendar', () => {
  const setDateTimeInMs = jest.fn();
  const convertDateTimeToMs= jest.fn();
  const setCalendarDay= jest.fn();
  const setCalendarMonth= jest.fn();
  const setCalendarYear= jest.fn();

  function renderDreamsCalendar() {
    return render(
      <DreamsCalendar setDateTimeInMs={setDateTimeInMs} convertDateTimeToMs={convertDateTimeToMs} setCalendarDay={setCalendarDay} setCalendarMonth={setCalendarMonth} setCalendarYear={setCalendarYear}/>
    )
  };

  afterEach(async() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('updates state when calendar values are changed', async () => {
    renderDreamsCalendar();
    const calendar = await screen.getByTestId('calendar');
    fireEvent.change(calendar, { target: { value: '2025-07-15' } });
    expect(calendar.value).toBe('2025-07-15');
    expect(setCalendarDay).toHaveBeenCalled();
    expect(setCalendarMonth).toHaveBeenCalled();
    expect(setCalendarYear).toHaveBeenCalled();
    expect(setDateTimeInMs).toHaveBeenCalled();
  });

  it('sets state and calendar input to today on mount', async () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = (today.getMonth() + 1).toString().padStart(2, '0');
    const dd = today.getDate().toString().padStart(2, '0');
    const todayString = `${yyyy}-${mm}-${dd}`;
    renderDreamsCalendar();
    const calendar = await screen.getByTestId('calendar');
    expect(calendar.value).toBe(todayString);
    expect(setCalendarDay).toHaveBeenCalled();
    expect(setCalendarMonth).toHaveBeenCalled();
    expect(setCalendarYear).toHaveBeenCalled();
    expect(setDateTimeInMs).toHaveBeenCalled();
  });

  describe('For a date with month and day less than 10', () => {
    it('Correctly sets the calendars date for 01-01', async () => {
      jest.useFakeTimers().setSystemTime(new Date('January 01, 2025 00:00:00'));
      renderDreamsCalendar();
      const calendar = await screen.getByTestId('calendar');
      expect(calendar.value).toBe('2025-01-01')
    });

    it('Correctly sets the calendars date for 09-09', async () => {
      jest.useFakeTimers().setSystemTime(new Date('September 09, 2025 00:00:00'));
      renderDreamsCalendar();
      const calendar = await screen.getByTestId('calendar');
      expect(calendar.value).toBe('2025-09-09')
    });
  });

  describe('For a date with month and day 10 or greater', () => {
    it('Correctly sets the calendars date for 10-10', async () => {
      jest.useFakeTimers().setSystemTime(new Date('October 10, 2025 00:00:00'));
      renderDreamsCalendar();
      const calendar = await screen.getByTestId('calendar');
      expect(calendar.value).toBe('2025-10-10')
    });

    it('Correctly sets the calendars date for 12-25', async () => {
      jest.useFakeTimers().setSystemTime(new Date('December 25, 2025 00:00:00'));
      renderDreamsCalendar();
      const calendar = await screen.getByTestId('calendar');
      expect(calendar.value).toBe('2025-12-25')
    });
  });

  describe('When a new date is selected', () => {
    it('updates state when calendar values are changed', async () => {
      renderDreamsCalendar();
      const calendar = await screen.getByTestId('calendar');
      fireEvent.change(calendar, { target: { value: '2025-07-15' } });
      expect(calendar.value).toBe('2025-07-15');
      expect(setCalendarDay).toHaveBeenCalled();
      expect(setCalendarMonth).toHaveBeenCalled();
      expect(setCalendarYear).toHaveBeenCalled();
      expect(setDateTimeInMs).toHaveBeenCalled();
    });
  });
});