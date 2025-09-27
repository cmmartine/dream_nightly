import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dropdown from "../components/Dropdown";
import * as usersApi from '../api/usersApi';

// Need to override this methods return to set component position, defaults to 0 in tests otherwise
jest.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(
  {
    x: 1,
    y: 1,
    bottom: 1,
    height: 1,
    left: 1,
    right: 1,
    top: 1,
    width: 1
  }
);

describe('Dropdown', () => {
  function renderDropdown() {
    return render(
      <div>
        <div data-testid='click-test'/>
        <Dropdown/>
      </div>
    )
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When first rendered, and dropdown button has not been clicked', () => {
    describe('The menu element', () => {
      it('has a class of dropdown-closed', () => {
        renderDropdown();
        expect(screen.getByRole('menu')).toHaveClass('dropdown-closed');
      });
    });
  });

  describe('After dropdown button has been clicked', () => {
    describe('The menu element', () => {
      it('does not have a class of dropdown-closed', async() => {
        renderDropdown();
        const openDropdown = screen.getByRole('button');
        await userEvent.click(openDropdown);
        expect(screen.getByRole('menu')).not.toHaveClass('dropdown-closed');
      });

      it('closes the dropdown when the area outside of the dropdown is clicked', async() => {
        renderDropdown();
        const openDropdown = screen.getByRole('button');
        await userEvent.click(openDropdown);
        expect(screen.getByRole('menu')).toHaveClass('dropdown-open');
        const clickTestDiv = screen.getByTestId('click-test');
        await userEvent.click(clickTestDiv);
        expect(screen.getByRole('menu')).toHaveClass('dropdown-closed');
      });

      it('does not reopen the dropdown when the area outside of the dropdown is clicked twice', async() => {
        renderDropdown();
        const openDropdown = screen.getByRole('button');
        await userEvent.click(openDropdown);
        expect(screen.getByRole('menu')).toHaveClass('dropdown-open');
        const clickTestDiv = screen.getByTestId('click-test');
        await userEvent.click(clickTestDiv);
        expect(screen.getByRole('menu')).toHaveClass('dropdown-closed');
        await userEvent.click(clickTestDiv);
        expect(screen.getByRole('menu')).toHaveClass('dropdown-closed');
      });

      describe('The logout button', () => {
        beforeEach(async () => {
          jest.spyOn(usersApi, 'logout').mockImplementation(jest.fn());
        });

        it('is rendered on screen', async() => {
          renderDropdown();
          const openDropdown = screen.getByRole('button');
          await userEvent.click(openDropdown);
          expect(screen.getByText('Log Out')).toBeInTheDocument();
        });

        it('calls the usersApi logout function when clicked', async() => {
          renderDropdown();
          const openDropdown = screen.getByRole('button');
          await userEvent.click(openDropdown);
          const logoutBtn = screen.getByText('Log Out');
          await(userEvent.click(logoutBtn));
          expect(usersApi.logout).toBeCalled();
        });
      })

      describe('The edit account button', () => {
        it('is rendered on screen', async() => {
          renderDropdown();
          const openDropdown = screen.getByRole('button');
          await userEvent.click(openDropdown);
          expect(screen.getByRole('menuitem', { name: 'Link to Edit Account' })).toBeInTheDocument();
        });
      });
    });
  });
});