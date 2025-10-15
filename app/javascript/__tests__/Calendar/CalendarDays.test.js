import { render, screen, fireEvent } from "@testing-library/react";
import CalendarDays from "../../components/Calendar/CalendarDays";

describe('CalendarDays', () => {

  const calendarDay = 2;
  const handleDateChange= jest.fn();

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

  function renderCalendarDays() {
    return render(
      <CalendarDays calendarDay={calendarDay} daysInfo={daysInfo} handleDateChange={handleDateChange}/>
    )
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders a button for each day passed in', () => {
    renderCalendarDays();

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getAllByRole('button').length).toBe(2);
  })

  it('renders correctly', () => {
    const calendarDays = renderCalendarDays();
    expect(calendarDays).toMatchSnapshot();
  });

  it('calls handleDateChange when a number button is clicked', () => {
    renderCalendarDays();

    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(handleDateChange).toHaveBeenCalled();
  });
});