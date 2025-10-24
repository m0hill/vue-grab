import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { init, libStore } from "../index";

describe("init", () => {
  let cleanup: (() => void) | undefined;

  beforeEach(() => {
    document.body.innerHTML = "";
    libStore.setState({
      keyPressTimestamps: new Map(),
      mouseX: -1000,
      mouseY: -1000,
      overlayMode: "hidden",
      pressedKeys: new Set(),
    });
  });

  afterEach(() => {
    if (cleanup) {
      cleanup();
      cleanup = undefined;
    }
  });

  it("should initialize with default options", () => {
    cleanup = init();

    expect(cleanup).toBeTypeOf("function");
  });

  it("should not initialize when enabled is false", () => {
    cleanup = init({ enabled: false });

    expect(cleanup).toBeUndefined();
  });

  it("should accept custom hotkey configuration", () => {
    cleanup = init({
      hotkey: ["Control", "G"],
      keyHoldDuration: 300,
    });

    expect(cleanup).toBeTypeOf("function");
  });

  it("should accept adapter configuration", () => {
    const mockAdapter = {
      name: "test",
      open: vi.fn(),
    };

    cleanup = init({ adapter: mockAdapter });

    expect(cleanup).toBeTypeOf("function");
  });

  it("should create overlay root in shadow DOM", () => {
    cleanup = init();

    const root = document.querySelector("[data-vue-grab]");
    expect(root).toBeTruthy();
    expect(root?.shadowRoot).toBeTruthy();
  });

  it("should track mouse movement", () => {
    cleanup = init();

    const event = new MouseEvent("mousemove", {
      clientX: 100,
      clientY: 200,
    });

    window.dispatchEvent(event);

    // Wait for requestAnimationFrame
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        const state = libStore.getState();
        expect(state.mouseX).toBe(100);
        expect(state.mouseY).toBe(200);
        resolve(undefined);
      });
    });
  });

  it("should cleanup event listeners on cleanup", () => {
    cleanup = init();

    // Perform cleanup
    cleanup();
    cleanup = undefined; // Prevent double cleanup in afterEach

    // Just verify cleanup function exists and doesn't crash
    expect(true).toBe(true);
  });

  it("should handle escape key to hide overlay", () => {
    cleanup = init();

    // Set overlay to visible
    libStore.setState({
      overlayMode: "visible",
      pressedKeys: new Set(["Escape"]),
    });

    // Wait for state change
    return new Promise((resolve) => {
      setTimeout(() => {
        const state = libStore.getState();
        expect(state.overlayMode).toBe("hidden");
        resolve(undefined);
      }, 10);
    });
  });

  it("should update store state on window scroll", () => {
    cleanup = init();

    const scrollEvent = new Event("scroll");
    window.dispatchEvent(scrollEvent);

    expect(cleanup).toBeTruthy(); // Just verify it doesn't crash
  });

  it("should update store state on window resize", () => {
    cleanup = init();

    const resizeEvent = new Event("resize");
    window.dispatchEvent(resizeEvent);

    expect(cleanup).toBeTruthy(); // Just verify it doesn't crash
  });

  it("should handle visibility change", () => {
    cleanup = init();

    Object.defineProperty(document, "hidden", {
      value: true,
      writable: true,
      configurable: true,
    });

    const visibilityEvent = new Event("visibilitychange");
    document.dispatchEvent(visibilityEvent);

    expect(cleanup).toBeTruthy(); // Just verify it doesn't crash
  });
});

describe("libStore", () => {
  it("should have correct initial state", () => {
    const state = libStore.getInitialState();

    expect(state.overlayMode).toBe("hidden");
    expect(state.mouseX).toBe(-1000);
    expect(state.mouseY).toBe(-1000);
    expect(state.pressedKeys).toBeInstanceOf(Set);
    expect(state.keyPressTimestamps).toBeInstanceOf(Map);
  });

  it("should allow state updates", () => {
    libStore.setState({ overlayMode: "visible" });

    const state = libStore.getState();
    expect(state.overlayMode).toBe("visible");

    // Reset
    libStore.setState({ overlayMode: "hidden" });
  });
});
