import { fireEvent, render, screen } from "@testing-library/react";
import CalendarYear from "../../components/Calendar/CalendarYear";
import * as NONVALID_DREAM_DATE from '../../constants/shared/NONVALID_DREAM_DATE.json';

describe('CalendarYear', () => {
  const handleDateChange = jest.fn();

  function renderCalendarYear(year) {
    return render(
      <CalendarYear calendarYear={year} handleDateChange={handleDateChange}/>
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('displays the year passed in', () => {
    renderCalendarYear(2025);

    expect(screen.getByText('2025')).toBeInTheDocument();
  });

  it('renders correctly', () => {
    const calendarYear = renderCalendarYear();
    expect(calendarYear).toMatchSnapshot();
  });

  it('displays prev and next arrows when the year is within the valid range', () => {
    renderCalendarYear(2024);

    expect(screen.getByLabelText('Previous Year')).toBeInTheDocument();
    expect(screen.getByLabelText('Next Year')).toBeInTheDocument();
  })

  it('does not display prev arrow when prev year would be out of range', () => {
    renderCalendarYear(Number(NONVALID_DREAM_DATE.BEFORE_YEAR) + 1);

    expect(screen.queryByLabelText('Previous Year')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Next Year')).toBeInTheDocument();
  });

  it('does not display next arrow when next year would be past current year', () => {
    const date = new Date().getFullYear();
    renderCalendarYear(date);

    expect(screen.getByLabelText('Previous Year')).toBeInTheDocument();
    expect(screen.queryByLabelText('Next Year')).not.toBeInTheDocument();
  });

  it('calls handleDateChange when the prev button is clicked', () => {
    renderCalendarYear(2024);

    fireEvent.click(screen.queryByLabelText('Previous Year'));
    expect(handleDateChange).toHaveBeenCalled();
  });

  it('calls handleDateChange when the next button is clicked', () => {
    renderCalendarYear(2024);

    fireEvent.click(screen.queryByLabelText('Next Year'));
    expect(handleDateChange).toHaveBeenCalled();
  });
});