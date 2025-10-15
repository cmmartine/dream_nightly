import { render, screen, fireEvent } from "@testing-library/react";
import CalendarHeader from "../../components/Calendar/CalendarHeader";

describe('CalendarHeader', () => {
  const calendarDay = 2
  const calendarMonth = 10
  const calendarYear = 2025
  const showCalendar = false;
  const setShowCalendar = jest.fn();

  function renderCalendarHeader() {
    return render(
      <CalendarHeader calendarDay={calendarDay} calendarMonth={calendarMonth} calendarYear={calendarYear} showCalendar={showCalendar} setShowCalendar={setShowCalendar}/>
    );
  };

  it('shows the date', () => {
    renderCalendarHeader();

    expect(screen.getByText(`October ${calendarDay} ${calendarYear}`)).toBeInTheDocument();
  });

  it('calls setShowCalendar when clicked', () => {
    renderCalendarHeader();

    fireEvent.click(screen.getByLabelText('Open Calendar'));
    expect(setShowCalendar).toHaveBeenCalled();
  });
});