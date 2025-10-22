import { fireEvent, render, screen } from "@testing-library/react";
import CalendarMonths from "../../components/Calendar/CalendarMonths";
import { calendarLoadingError } from "../../constants/errors";

describe('CalendarMonths', () => {
  const calendarMonth = 9;
  const handleDateChange = jest.fn();

  const validMonthsInfo = [
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

  function renderCalendarMonths(monthsInfo) {
    return render(
      <CalendarMonths calendarMonth={calendarMonth} monthsInfo={monthsInfo} handleDateChange={handleDateChange}/>
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders a button for each month passed in', () => {
    renderCalendarMonths(validMonthsInfo);

    expect(screen.getByText('Oct')).toBeInTheDocument();
    expect(screen.getByText('Nov')).toBeInTheDocument();
    expect(screen.getAllByRole('button').length).toBe(2);
  });

  it('renders correctly', () => {
    const calendarMonths = renderCalendarMonths(validMonthsInfo);
    expect(calendarMonths).toMatchSnapshot();
  });

  it('calls handleDateChange when a month button is clicked', () => {
    renderCalendarMonths(validMonthsInfo);

    fireEvent.click(screen.getByText('Oct'));
    expect(handleDateChange).toHaveBeenCalled();
  });

  describe('shows a calendar loading error when', () => {
    it('monthsInfo is empty', () => {
      renderCalendarMonths([]);

      expect(screen.getByText(calendarLoadingError)).toBeInTheDocument();
    });

    it('monthsInfo is null', () => {
      renderCalendarMonths(null);

      expect(screen.getByText(calendarLoadingError)).toBeInTheDocument();
    });
  });
});