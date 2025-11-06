import React, { createContext, useContext, useState } from "react";

export const ErrorContext = createContext();

export function ErrorProvider({ children }) {
  const [error, setError] = useState(null);

  return(
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useErrorContext() {
  return useContext(ErrorContext);
}