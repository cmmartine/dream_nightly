import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InfoPage from "../components/InfoPage";
import * as usersApi from '../api/usersApi';
import { appName, appDescription } from "../constants/infoPage";

describe('InfoPage', () => {
  function renderInfoPage() {
    return render(
      <InfoPage/>
    )
  };

  beforeEach(async () => {
    jest.spyOn(usersApi, 'redirectToSignIn').mockImplementation(jest.fn());
    jest.spyOn(usersApi, 'redirectToSignUp').mockImplementation(jest.fn());
  });

  it('shows the applications name', () => {
    renderInfoPage();
    expect(screen.queryByText(appName)).toBeInTheDocument();
  });

  it('shows the applications description', () => {
    renderInfoPage();
    expect(screen.queryByText(appDescription.body)).toBeInTheDocument();
  });

  it('calls the usersApi redirectToSignIn function when sign in button is clicked', async() => {
    renderInfoPage();
    const signInBtn = screen.getAllByRole('button')[0];
    await userEvent.click(signInBtn);
    expect(usersApi.redirectToSignIn).toBeCalled();
  });

  it('calls the usersApi redirectToSignUp function when sign up button is clicked', async() => {
    renderInfoPage();
    const signUpBtn = screen.getAllByRole('button')[1];
    await userEvent.click(signUpBtn);
    expect(usersApi.redirectToSignUp).toBeCalled();
  });
});