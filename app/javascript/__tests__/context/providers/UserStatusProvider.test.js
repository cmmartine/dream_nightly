import React from "react";
import { render } from "@testing-library/react";
import { UserStatusProvider } from "../../../components/context/providers/UserStatusProvider";
import * as usersApi from '../../../api/usersApi';

describe('UserStatusProvider', () => {
  function TestComponent() {
    return <div data-testid='test-component'></div>
  };

  beforeEach(() => {
    jest.spyOn(usersApi, 'getUserStatus').mockImplementation(jest.fn());
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