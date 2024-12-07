import { render, screen } from "@testing-library/react";
import ErrorBanner from "../components/ErrorBanner";
import { errorPageText } from "../constants/errorPage";

describe('ErrorBanner', () => {
  function renderErrorBanner(currentError) {
    return render(
      <ErrorBanner currentError={currentError}/>
    );
  };

  describe('When passed an error', () => {
    it('renders the error banner', () => {
      const newError = new Error('Testing error');
      renderErrorBanner(newError);
      expect(screen.queryByText(errorPageText.header)).toBeInTheDocument();
      expect(screen.queryByText(errorPageText.body)).toBeInTheDocument();
      expect(screen.queryByText(`${newError}`)).toBeInTheDocument();
    })
  });

  describe('When passed null', () => {
    it('does NOT render the error banner', () => {
      renderErrorBanner(null);
      expect(screen.queryByText(errorPageText.header)).not.toBeInTheDocument();
      expect(screen.queryByText(errorPageText.body)).not.toBeInTheDocument();
    })
  });
});