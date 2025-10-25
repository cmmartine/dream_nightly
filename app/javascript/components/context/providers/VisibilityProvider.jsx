import React, { createContext, useContext, useEffect, useState } from "react";

const VisibilityContext = createContext();

export function VisibilityProvider({ children }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <VisibilityContext.Provider value={isVisible}>
      {children}
    </VisibilityContext.Provider>
  );
}

export function useVisibility() {
  return useContext(VisibilityContext);
}