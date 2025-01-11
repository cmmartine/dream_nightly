import { render, screen } from "@testing-library/react";
import DreamsPage from "../components/DreamsPage";
import * as dreamsApi from "../api/dreamsApi";

jest.mock('../components/Dream', () => () => {
  const MockDream = 'Dream';
  return <MockDream data-testid='mock-dream'/>
});

jest.mock('../components/DreamInput', () => () => {
  const MockDreamInput = 'DreamInput';
  return <MockDreamInput data-testid='mock-dream-input'/>
});

describe('DreamsPage', () => {
  const returnedDreams = [
    {
      id: 2,
      body: 'Second dream',
      ai_interpretation: null,
      lucid: null,
      created_at: 1734869884
    },
    {
      id: 1,
      body: 'First dream',
      ai_interpretation: null,
      lucid: null,
      created_at: 1734869880
    }
  ]

  function renderDreamsPage() {
    return render(
      <DreamsPage setError={jest.fn()}/>
    )
  };

  beforeEach(async () => {
      jest.spyOn(dreamsApi, 'postDreamsFromDate').mockReturnValue(returnedDreams);
  });

  describe('When first rendered', () => {
    describe('the calendar', () => {
      describe('For a date with month and day less than 10', () => {
        it('Correctly sets the calendars date for 01-01', async () => {
          jest.useFakeTimers().setSystemTime(new Date('January 01, 2025 00:00:00'));
          renderDreamsPage();
          const calendar = await screen.getByTestId('calendar');
          expect(calendar.value).toBe('2025-01-01')
        });

        it('Correctly sets the calendars date for 09-09', async () => {
          jest.useFakeTimers().setSystemTime(new Date('September 09, 2025 00:00:00'));
          renderDreamsPage();
          const calendar = await screen.getByTestId('calendar');
          expect(calendar.value).toBe('2025-09-09')
        });
      });

      describe('For a date with month and day 10 or greater', () => {
        it('Correctly sets the calendars date for 10-10', async () => {
          jest.useFakeTimers().setSystemTime(new Date('October 10, 2025 00:00:00'));
          renderDreamsPage();
          const calendar = await screen.getByTestId('calendar');
          expect(calendar.value).toBe('2025-10-10')
        });

        it('Correctly sets the calendars date for 12-25', async () => {
          jest.useFakeTimers().setSystemTime(new Date('December 25, 2025 00:00:00'));
          renderDreamsPage();
          const calendar = await screen.getByTestId('calendar');
          expect(calendar.value).toBe('2025-12-25')
        });
      });
    });

    it('shows all dreams returned from api call', async () => {
      renderDreamsPage();
      expect(dreamsApi.postDreamsFromDate).toBeCalled();
      expect(await screen.findAllByTestId('mock-dream')).toHaveLength(returnedDreams.length);
    });

    it('shows a new dream input form', async () => {
      renderDreamsPage();
      expect(await screen.findByTestId('mock-dream-input')).toBeInTheDocument();
    });
  });
});