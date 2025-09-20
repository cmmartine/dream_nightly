import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NotFound from "../components/NotFound";
import * as usersApi from '../api/usersApi';

describe("NotFound", () => {
  renderNotFoundPage = () => {
    render(<NotFound/>);
  };

  describe('clicking the back to home button', () => {
    beforeEach(() => {
      jest.spyOn(usersApi, 'redirectToHome').mockImplementation(jest.fn());
    });

    it('calls redirectToHome', async () => {
      renderNotFoundPage();
      const homeLink = screen.getByText('Go to home page');
      await userEvent.click(homeLink);

      expect(usersApi.redirectToHome).toHaveBeenCalled();
    });
  });
});