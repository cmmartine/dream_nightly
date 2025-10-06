import { render, screen } from "@testing-library/react";
import LandingPage from "../components/LandingPage";
import { appDescription } from "../constants/appInfo";

describe('LandingPage', () => {
  function renderLandingPage() {
    return render(
      <LandingPage/>
    )
  };

  it('shows the applications description', () => {
    renderLandingPage();
    expect(screen.queryByText(appDescription.body)).toBeInTheDocument();
  });
});