import { render, screen } from "@testing-library/react";
import InfoPage from "../components/InfoPage";
import { appDescription } from "../constants/appInfo";

describe('InfoPage', () => {
  function renderInfoPage() {
    return render(
      <InfoPage/>
    )
  };

  it('shows the applications description', () => {
    renderInfoPage();
    expect(screen.queryByText(appDescription.body)).toBeInTheDocument();
  });
});