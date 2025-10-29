import React from "react";
import { UserStatusProvider } from "./providers/UserStatusProvider";
import { VisibilityProvider } from "./providers/VisibilityProvider";

export default function ContextProviderWrapper({ children }) {
  return (
    <UserStatusProvider>
      <VisibilityProvider>
        {children}
      </VisibilityProvider>
    </UserStatusProvider>
  );
};