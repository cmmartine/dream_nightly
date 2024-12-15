import { render, screen } from "@testing-library/react";
import DreamsPage from "../components/DreamsPage";
import * as dreamsApi from "../api/dreamsApi";

describe('DreamsPage', () => {
  function renderDreamsPage() {
    return render(
      <DreamsPage setError={jest.fn()}/>
    )
  };

  describe('When first rendered', () => {
    describe('the calendar', () => {
      it('is set to todays date', async () => {
        jest.useFakeTimers().setSystemTime(new Date('December 15, 2024 00:00:00'));
        renderDreamsPage();
        const calendar = await screen.getByTestId('calendar');
        expect(calendar.value).toBe('2024-12-15')
      });
    });
  });
});