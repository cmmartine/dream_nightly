import React from "react";
import { VisibilityProvider } from "./providers/VisibilityProvider";

export default function ContextProviderWrapper({ children }) {
  return (
    <VisibilityProvider>
      {children}
    </VisibilityProvider>
  );
};