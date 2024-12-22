import { render, screen } from "@testing-library/react";
import DreamsPage from "../components/DreamsPage";
import * as dreamsApi from "../api/dreamsApi";

jest.mock('../components/Dream', () => () => {
  const MockDream = 'Dream';
  return <MockDream data-testid='mock-dream'/>
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
      it('is set to todays date', async () => {
        jest.useFakeTimers().setSystemTime(new Date('December 15, 2024 00:00:00'));
        renderDreamsPage();
        const calendar = await screen.getByTestId('calendar');
        expect(calendar.value).toBe('2024-12-15')
      });
    });

    it('shows all dreams returned from api call', async () => {
      renderDreamsPage();
      expect(dreamsApi.postDreamsFromDate).toBeCalled();
      expect(await screen.findAllByTestId('mock-dream')).toHaveLength(returnedDreams.length);
    })
  });
});