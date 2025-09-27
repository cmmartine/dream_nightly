import { render, screen } from "@testing-library/react";
import NotFound from "../components/NotFound";

describe("NotFound", () => {
  renderNotFoundPage = () => {
    render(<NotFound/>);
  };

  describe('on render', () => {
    it('shows the not found text', () => {
      renderNotFoundPage();
      const header = screen.getByText('404 - Page Not Found');
      const pageText = screen.getByText("The page you were looking for doesn't exist.");
      const homeLink = screen.getByRole('link');

      expect(header).toBeInTheDocument();
      expect(pageText).toBeInTheDocument();
      expect(homeLink).toBeInTheDocument();
    });
  });
});