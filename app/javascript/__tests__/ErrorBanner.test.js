import { render, screen } from "@testing-library/react";
import ErrorBanner from "../components/ErrorBanner";
import { errorPageText } from "../constants/errors";
import { ErrorContext } from "../components/context/providers/ErrorProvider";

describe('ErrorBanner', () => {
  function renderErrorBanner(mockError) {
    return render(
      <ErrorContext.Provider value={{ error: mockError }}>
        <ErrorBanner/>
      </ErrorContext.Provider>
    );
  };

  describe('When passed an error', () => {
    it('renders the error banner', () => {
      const newError = new Error({ message: 'Testing error' });
      renderErrorBanner(newError);
      expect(screen.queryByText(errorPageText.header)).toBeInTheDocument();
      expect(screen.queryByText(errorPageText.body)).toBeInTheDocument();
      expect(screen.queryByText(`${newError.message}`)).toBeInTheDocument();
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