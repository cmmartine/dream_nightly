import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NavBar from "../components/NavBar";
import * as usersApi from '../api/usersApi';
import { appName } from "../constants/appInfo";

jest.mock('../components/Dropdown', () => () => {
  const MockDropdown = 'Dropdown';
  return <MockDropdown data-testid='mock-dropdown'/>
});

describe('NavBar', () => {
  function renderNavBar(userStatus = false) {
    return render(
      <NavBar userStatus={userStatus}/>
    )
  };

  describe('when the user is NOT signed in', () => {
    beforeEach(() => {
      jest.spyOn(usersApi, 'redirectToSignIn').mockImplementation(jest.fn());
      jest.spyOn(usersApi, 'redirectToSignUp').mockImplementation(jest.fn());
    });

    it('shows the applications name', () => {
      renderNavBar();
      expect(screen.queryByText(appName)).toBeInTheDocument();
    });

    it('calls the usersApi redirectToSignIn function when sign in button is clicked', async() => {
      renderNavBar();
      const signInBtn = screen.getAllByRole('button')[0];
      await userEvent.click(signInBtn);
      expect(usersApi.redirectToSignIn).toBeCalled();
    });

    it('calls the usersApi redirectToSignUp function when sign up button is clicked', async() => {
      renderNavBar();
      const signUpBtn = screen.getAllByRole('button')[1];
      await userEvent.click(signUpBtn);
      expect(usersApi.redirectToSignUp).toBeCalled();
    });

    it('does not render the dropdown', async() => {
      renderNavBar();
      expect(await screen.queryByTestId('mock-dropdown')).not.toBeInTheDocument();
    })
  });

  describe('when the user is signed in', () => {
    it('shows the applications name', () => {
      renderNavBar();
      expect(screen.queryByText(appName)).toBeInTheDocument();
    });

    it('renders the Dropdown', async() => {
      renderNavBar(true);
      expect(await screen.findByTestId('mock-dropdown')).toBeInTheDocument();
    })

    it('does not render the sign in or sign up buttons', async() => {
      renderNavBar(true);
      expect(await screen.queryByText('Sign In')).not.toBeInTheDocument();
      expect(await screen.queryByText('Sign Up')).not.toBeInTheDocument();
    })
  })
});