import React from "react";
import { UserStatusProvider } from "./providers/UserStatusProvider";
import { VisibilityProvider } from "./providers/VisibilityProvider";
import { ErrorProvider } from "./providers/ErrorProvider";

export default function ContextProviderWrapper({ children }) {
  return (
    <VisibilityProvider>
      <UserStatusProvider>
        <ErrorProvider>
            {children}
        </ErrorProvider>
      </UserStatusProvider>
    </VisibilityProvider>
  );
};