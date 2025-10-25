import React from "react";
import { act, render, screen } from "@testing-library/react";
import { VisibilityProvider, useVisibility } from "../../../components/context/providers/VisibilityProvider";

describe("VisibilityProvider", () => {
  function TestComponent() {
    const isVisible = useVisibility();
    return <div data-testid="visibility-state">{isVisible ? "Visible" : "Hidden"}</div>;
  }

  afterEach(() => {
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'visible',
    });
  });

  it("provides the initial visibility state as true", () => {
    render(
      <VisibilityProvider>
        <TestComponent />
      </VisibilityProvider>
    );

    const visibilityState = screen.getByTestId("visibility-state");
    expect(visibilityState).toHaveTextContent("Visible");
  });

  it("updates the visibility state to false when document.visibilityState changes to hidden", () => {
    render(
      <VisibilityProvider>
        <TestComponent />
      </VisibilityProvider>
    );

    const visibilityState = screen.getByTestId("visibility-state");

    act(() => {
      Object.defineProperty(document, 'visibilityState', {
        writable: true,
        value: 'hidden'
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(visibilityState).toHaveTextContent("Hidden");
  });

  it("updates the visibility state to true when document.visibilityState changes back to visible", () => {
    render(
      <VisibilityProvider>
        <TestComponent />
      </VisibilityProvider>
    );

    const visibilityState = screen.getByTestId("visibility-state");

    act(() => {
      Object.defineProperty(document, 'visibilityState', {
        writable: true,
        value: 'hidden'
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(visibilityState).toHaveTextContent("Hidden");

    act(() => {
      Object.defineProperty(document, 'visibilityState', {
        writable: true,
        value: 'visible'
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(visibilityState).toHaveTextContent("Visible");
  });
});