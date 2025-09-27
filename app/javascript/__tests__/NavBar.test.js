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
    it('shows the applications name', () => {
      renderNavBar();
      expect(screen.queryByText(appName)).toBeInTheDocument();
    });

    it('shows the sign up and sign in links', async() => {
      renderNavBar();
      const signInBtn = screen.getByRole('link', { name: 'Link to Sign In' });
      const signUpBtn = screen.getByRole('link', { name: 'Link to Sign Up' });

      expect(signInBtn).toBeInTheDocument();
      expect(signUpBtn).toBeInTheDocument();
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