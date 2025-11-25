import React from "react";
import { render } from "@testing-library/react";
import { UserStatusProvider } from "../../../components/context/providers/UserStatusProvider";
import * as visibility from "../../../components/context/providers/VisibilityProvider";
import * as usersApi from '../../../api/usersApi';

describe('UserStatusProvider', () => {
  function TestComponent() {
    return (
      <div>
        <meta name='csrf-token'/>
        <div data-testid='test-component'></div>
      </div>
    )
  };

  beforeEach(() => {
    jest.spyOn(usersApi, 'getUserStatus').mockImplementation(
      jest.fn().mockReturnValue({ logged_in: true, token: 'token' })
    );
    jest.spyOn(visibility, 'useVisibility').mockReturnValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('checks the users logged in status', () => {
    render(
      <UserStatusProvider>
        <TestComponent/>
      </UserStatusProvider>
    );

    expect(usersApi.getUserStatus).toHaveBeenCalled();
  });
});