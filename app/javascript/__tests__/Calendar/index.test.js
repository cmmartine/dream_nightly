import { render, screen, fireEvent } from "@testing-library/react";
import Calendar from "../../components/Calendar";
import * as calendarApi from '../../api/calendarApi';

describe('Calendar', () => {

  const setDateTimeInMs = jest.fn();
  const convertDateTimeToMs = jest.fn();
  const calendarDay = 2;
  const calendarMonth = 11;
  const calendarYear = 2025;
  const setCalendarDay = jest.fn();
  const setCalendarMonth = jest.fn();
  const setCalendarYear = jest.fn();
  const newDreamId = 1;
  const deletedDreamId = 1;
  const setError = jest.fn();

  const daysInfo = [
    {
      num: 1,
      has_dreams: true,
      day_of_week: 3,
      is_today: true
    },
    {
      num: 2,
      has_dreams: false,
      day_of_week: 4,
      is_today: false
    }
  ]

  const monthsInfo = [
    {
      num: 9,
      has_dreams: false,
      is_current: false,
      short_name: 'Oct'
    },
    {
      num: 10,
      has_dreams: true,
      is_current: true,
      short_name: 'Nov'
    }
  ]

  function renderCalendar() {
    return render(
      <Calendar setDateTimeInMs={setDateTimeInMs} convertDateTimeToMs={convertDateTimeToMs} calendarDay={calendarDay} calendarMonth={calendarMonth} calendarYear={calendarYear} setCalendarDay={setCalendarDay} setCalendarMonth={setCalendarMonth} setCalendarYear={setCalendarYear} newDreamId={newDreamId} deletedDreamId={deletedDreamId} setError={setError}/>
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    const mockDate = new Date('2025-11-02T10:00:00Z');
    jest.setSystemTime(mockDate);
    jest.spyOn(calendarApi, 'getCalendarInfo').mockResolvedValue({
      days: daysInfo,
      months: monthsInfo
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it("renders the calendar header and the calendar is closed", () => {
    renderCalendar();
    const headerButton = screen.getByRole("button", { name: /open calendar/i });
    expect(headerButton).toBeInTheDocument();

    expect(screen.getByText("November 2 2025")).toBeInTheDocument();

    expect(screen.queryByText("October")).not.toBeInTheDocument();
    expect(screen.queryByText("1")).not.toBeInTheDocument();
  });

  it("opens the calendar when the header is clicked", async () => {
    renderCalendar();
    const headerButton = screen.getByRole("button", { name: /open calendar/i });
    expect(headerButton).toBeInTheDocument();

    fireEvent.click(headerButton);

    await screen.findByText("Oct");
    await screen.findByText("1");

    expect(screen.getByText("November 2 2025")).toBeInTheDocument();
    expect(screen.getByText("Mon")).toBeInTheDocument();
    expect(screen.getByText("Fri")).toBeInTheDocument();
    expect(screen.getByText("Oct")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("calls setDateTimeInMs when a day is selected", async () => {
    renderCalendar();
    const headerButton = screen.getByRole("button", { name: /open calendar/i });

    fireEvent.click(headerButton);

    await screen.findByText("1");
    fireEvent.click(screen.getByText("1"));
    expect(setDateTimeInMs).toHaveBeenCalled();
  });

  it("fetches calendar data when the month changes", async () => {
    renderCalendar();
    const headerButton = screen.getByRole("button", { name: /open calendar/i });

    fireEvent.click(headerButton);

    await screen.findByText("Oct");
    fireEvent.click(screen.getByText("Oct"));
    expect(setCalendarMonth).toHaveBeenCalledWith(10);
    expect(calendarApi.getCalendarInfo).toHaveBeenCalled();
  });

  it("fetches calendar data when the year changes", async () => {
    renderCalendar();
    const headerButton = screen.getByRole("button", { name: /open calendar/i });

    fireEvent.click(headerButton);

    await screen.findByText("Oct");
    fireEvent.click(screen.getByLabelText("Previous Year"));
    expect(setCalendarYear).toHaveBeenCalledWith(2024);
    expect(calendarApi.getCalendarInfo).toHaveBeenCalled();
  });

  it('closes the calendar when clicking outside', () => {
    renderCalendar();
    const headerButton = screen.getByRole('button', { name: /open calendar/i });
    fireEvent.click(headerButton);
    fireEvent.click(document.body);
    expect(screen.queryByText('Oct')).not.toBeInTheDocument();
  });

  it('resets to January when navigating into the current year from a future month', async () => {
    const futureMonth = 11; // December
    const futureYear = 2024;
    render(
      <Calendar
        setDateTimeInMs={setDateTimeInMs}
        convertDateTimeToMs={convertDateTimeToMs}
        calendarDay={calendarDay}
        calendarMonth={futureMonth}
        calendarYear={futureYear}
        setCalendarDay={setCalendarDay}
        setCalendarMonth={setCalendarMonth}
        setCalendarYear={setCalendarYear}
        newDreamId={newDreamId}
        deletedDreamId={deletedDreamId}
        setError={setError}
      />
    );

    const headerButton = screen.getByRole("button", { name: /open calendar/i });
    fireEvent.click(headerButton);

    // Move forward into 2025 while on December
    const nextYearButton = await screen.findByLabelText("Next Year");
    fireEvent.click(nextYearButton);

    expect(setCalendarYear).toHaveBeenCalledWith(2025);

    // setCalendarState from date adds 1, so 1 is January here
    expect(setCalendarMonth).toHaveBeenCalledWith(1);
    expect(calendarApi.getCalendarInfo).toHaveBeenCalled();
  });
});