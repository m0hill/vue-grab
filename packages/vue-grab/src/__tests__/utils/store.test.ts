import { describe, it, expect, vi } from "vitest";
import { createStore } from "../../utils/store";

describe("createStore", () => {
  it("should create a store with initial state", () => {
    const store = createStore(() => ({ count: 0 }));
    expect(store.getState()).toEqual({ count: 0 });
  });

  it("should update state with partial state object", () => {
    const store = createStore(() => ({ count: 0, name: "test" }));
    store.setState({ count: 1 });
    expect(store.getState()).toEqual({ count: 1, name: "test" });
  });

  it("should update state with reducer function", () => {
    const store = createStore(() => ({ count: 0 }));
    store.setState((state) => ({ count: state.count + 1 }));
    expect(store.getState()).toEqual({ count: 1 });
  });

  it("should notify subscribers on state change", () => {
    const store = createStore(() => ({ count: 0 }));
    const listener = vi.fn();

    store.subscribe(listener);
    store.setState({ count: 1 });

    expect(listener).toHaveBeenCalledWith({ count: 1 }, { count: 0 });
  });

  it("should notify selective subscribers only when selected value changes", () => {
    const store = createStore(() => ({ count: 0, name: "test" }));
    const listener = vi.fn();

    store.subscribe(listener, (state) => state.count);

    // Update count - listener should be called
    store.setState({ count: 1 });
    expect(listener).toHaveBeenCalledWith(1, 0);

    listener.mockClear();

    // Update name - listener should NOT be called
    store.setState({ name: "updated" });
    expect(listener).not.toHaveBeenCalled();
  });

  it("should allow unsubscribing", () => {
    const store = createStore(() => ({ count: 0 }));
    const listener = vi.fn();

    const unsubscribe = store.subscribe(listener);
    store.setState({ count: 1 });
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    store.setState({ count: 2 });
    expect(listener).toHaveBeenCalledTimes(1); // Still only called once
  });

  it("should return initial state via getInitialState", () => {
    const initialState = { count: 0, name: "test" };
    const store = createStore(() => initialState);

    store.setState({ count: 5 });

    expect(store.getInitialState()).toEqual(initialState);
    expect(store.getState()).toEqual({ count: 5, name: "test" });
  });

  it("should handle multiple subscribers", () => {
    const store = createStore(() => ({ count: 0 }));
    const listener1 = vi.fn();
    const listener2 = vi.fn();

    store.subscribe(listener1);
    store.subscribe(listener2);

    store.setState({ count: 1 });

    expect(listener1).toHaveBeenCalledWith({ count: 1 }, { count: 0 });
    expect(listener2).toHaveBeenCalledWith({ count: 1 }, { count: 0 });
  });
});
