import { render, screen } from "@testing-library/react";
import DreamsPage from "../components/DreamsPage";
import * as dreamsApi from "../api/dreamsApi";
import { noDreams } from "../constants/appInfo";
import { ErrorProvider } from "../components/context/providers/ErrorProvider";

jest.mock('../components/DreamInput', () => () => {
  const MockDreamInput = 'DreamInput';
  return <MockDreamInput data-testid='mock-dream-input'/>
});

let mockCalendarDate;

jest.mock('../components/Calendar', () => (props) => {
  props.setCalendarYear(mockCalendarDate.getFullYear());
  props.setCalendarMonth(mockCalendarDate.getMonth() + 1);
  props.setCalendarDay(mockCalendarDate.getDate());
  props.setDateTimeInMs(mockCalendarDate.getTime());
  return <div data-testid="mock-dreams-calendar" />;
});

describe('DreamsPage', () => {
  let dreamBody1 = 'First dream';
  let dreamBody2 = 'Second dream';

  const returnedDreams = [
    {
      id: 2,
      body: dreamBody2,
      ai_interpretation: null,
      lucid: null,
      dreamed_at: 1734869884
    },
    {
      id: 1,
      body: dreamBody1,
      ai_interpretation: null,
      lucid: null,
      dreamed_at: 1734869880
    }
  ];

  function renderDreamsPage() {
    return render(
      <ErrorProvider>
        <DreamsPage/>
      </ErrorProvider>
    )
  };

  beforeEach(() => {
    jest.spyOn(dreamsApi, 'getDreamsFromDate').mockReturnValue(returnedDreams);
    jest.spyOn(dreamsApi, 'postDeleteDream').mockReturnValue(null);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows all dreams returned from api call', async () => {
    mockCalendarDate = new Date(2025, 8, 12);
    renderDreamsPage();
    expect(dreamsApi.getDreamsFromDate).toBeCalled();
    expect(await screen.findByText(dreamBody1)).toBeInTheDocument();
    expect(await screen.findByText(dreamBody2)).toBeInTheDocument();
  });

  it('shows a new dream input form', async () => {
    mockCalendarDate = new Date(2025, 8, 12);
    renderDreamsPage();
    expect(await screen.findByTestId('mock-dream-input')).toBeInTheDocument();
  });

  it('does not show dream input form when date is invalid', () => {
    mockCalendarDate = new Date(2000, 0, 1);
    renderDreamsPage();
    expect(screen.queryByTestId('mock-dream-input')).not.toBeInTheDocument();
  });

  it('does not call dreams API for date before 2010', () => {
    mockCalendarDate = new Date(2000, 0, 1);
    renderDreamsPage();
    expect(dreamsApi.getDreamsFromDate).not.toBeCalled();
  });

  it('does not call dreams API for date after today', () => {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    mockCalendarDate = tomorrow;
    renderDreamsPage();
    expect(dreamsApi.getDreamsFromDate).not.toBeCalled();
  });

  describe('when there are no dreams', () => {
    it('shows text that no dreams were recorded', () => {
      jest.spyOn(dreamsApi, 'getDreamsFromDate').mockReturnValue([]);

      renderDreamsPage();

      expect(screen.getByText(noDreams)).toBeInTheDocument();
    })
  });
});