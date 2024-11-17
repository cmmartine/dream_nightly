import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dropdown from "../components/Dropdown";
import * as usersApi from '../api/usersApi';

describe('Dropdown', () => {
  function renderDropdown() {
    return render(
      <Dropdown/>
    )
  };

  describe('When first rendered, and dropdown button has not been clicked', () => {
    describe('The nav element', () => {
      it('has a class of dropdown-closed', () => {
        renderDropdown();
        expect(screen.getByRole('navigation')).toHaveClass('dropdown-closed');
      });
    });
  });

  describe('After dropdown button has been clicked', () => {
    describe('The nav element', () => {
      it('does not have a class of dropdown-closed', async() => {
        renderDropdown();
        await userEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('navigation')).not.toHaveClass('dropdown-closed');
      });

      describe('The logout button', () => {
        beforeEach(async () => {
          jest.spyOn(usersApi, 'logout').mockImplementation(jest.fn());
        });

        it('is rendered on screen', async() => {
          renderDropdown();
          await userEvent.click(screen.getByRole('button'));
          expect(screen.getAllByRole('button')[1]).toHaveClass('logout-btn');
        });

        it('calls the usersApi logout function when clicked', async() => {
          renderDropdown();
          const openDropdown = screen.getByRole('button');
          await userEvent.click(openDropdown);
          const logoutBtn = screen.getAllByRole('button')[1];
          await(userEvent.click(logoutBtn));
          expect(usersApi.logout).toBeCalled();
        });
      })
    });
  });
});