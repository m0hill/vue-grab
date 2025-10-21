import {
  Hotkey,
  isKeyPressed,
  trackHotkeys,
  watchKeyHeldFor,
} from "./hotkeys.js";
import { createSelectionOverlay, showCopyIndicator } from "./overlay.js";
import { copyTextToClipboard } from "./utils/copy-text.js";
import {
  filterStack,
  getHTMLSnippet,
  getStack,
  serializeStack,
} from "./utils/data.js";
import { isElementVisible } from "./utils/is-element-visible.js";
import { ATTRIBUTE_NAME, mountRoot } from "./utils/mount-root.js";
import { scheduleRunWhenIdle } from "./utils/schedule-run-when-idle.js";
import { createStore } from "./utils/store.js";
import { throttle } from "./utils/throttle.js";

export interface Options {
  enabled?: boolean;
  /**
   * hotkey to trigger the overlay
   *
   * default: "Meta"
   */
  hotkey?: Hotkey | Hotkey[];

  /**
   * time required (ms) to hold the key to trigger the overlay
   *
   * default: 1000
   */
  keyHoldDuration?: number;
}

const THROTTLE_DELAY = 16;

interface LibStore {
  keyPressTimestamps: Map<Hotkey, number>;
  mouseX: number;
  mouseY: number;
  overlayMode: "copying" | "hidden" | "visible";
  pressedKeys: Set<Hotkey>;
}

export const libStore = createStore<LibStore>(() => ({
  keyPressTimestamps: new Map(),
  mouseX: -1000,
  mouseY: -1000,
  overlayMode: "hidden",
  pressedKeys: new Set(),
}));

export const init = (options: Options = {}) => {
  if (options.enabled === false) {
    return;
  }

  const resolvedOptions: Required<Options> = {
    enabled: true,
    hotkey: "Meta",
    keyHoldDuration: 500,
    ...options,
  };

  const root = mountRoot();
  const selectionOverlay = createSelectionOverlay(root);
  let hoveredElement: Element | null = null;
  let isCopying = false;

  const checkIsActivationHotkeyPressed = () => {
    if (Array.isArray(resolvedOptions.hotkey)) {
      for (const key of resolvedOptions.hotkey) {
        if (!isKeyPressed(key)) {
          return false;
        }
      }
      return true;
    }
    return isKeyPressed(resolvedOptions.hotkey);
  };

  const isCopyHotkeyPressed = () => {
    return isKeyPressed("Meta") && isKeyPressed("C");
  };

  let cleanupActivationHotkeyWatcher: (() => void) | null = null;

  const handleKeyStateChange = (pressedKeys: Set<Hotkey>) => {
    const { overlayMode } = libStore.getState();

    if (pressedKeys.has("Escape") || pressedKeys.has("Esc")) {
      libStore.setState((state) => {
        const nextPressedKeys = new Set(state.pressedKeys);
        nextPressedKeys.delete("Escape");
        nextPressedKeys.delete("Esc");
        const nextTimestamps = new Map(state.keyPressTimestamps);
        nextTimestamps.delete("Escape");
        nextTimestamps.delete("Esc");

        const activationKeys = Array.isArray(resolvedOptions.hotkey)
          ? resolvedOptions.hotkey
          : [resolvedOptions.hotkey];
        for (const activationKey of activationKeys) {
          if (activationKey.length === 1) {
            nextPressedKeys.delete(activationKey.toLowerCase());
            nextPressedKeys.delete(activationKey.toUpperCase());
            nextTimestamps.delete(activationKey.toLowerCase());
            nextTimestamps.delete(activationKey.toUpperCase());
          } else {
            nextPressedKeys.delete(activationKey);
            nextTimestamps.delete(activationKey);
          }
        }

        return {
          ...state,
          keyPressTimestamps: nextTimestamps,
          overlayMode: "hidden",
          pressedKeys: nextPressedKeys,
        };
      });
      if (cleanupActivationHotkeyWatcher) {
        cleanupActivationHotkeyWatcher();
        cleanupActivationHotkeyWatcher = null;
      }
      return;
    }

    if (isCopyHotkeyPressed() && overlayMode === "visible") {
      libStore.setState((state) => ({
        ...state,
        overlayMode: "copying",
      }));
      return;
    }

    const isActivationHotkeyPressed = checkIsActivationHotkeyPressed();

    if (!isActivationHotkeyPressed) {
      if (cleanupActivationHotkeyWatcher) {
        cleanupActivationHotkeyWatcher();
        cleanupActivationHotkeyWatcher = null;
      }

      if (overlayMode !== "hidden") {
        libStore.setState((state) => ({
          ...state,
          overlayMode: "hidden",
        }));
      }

      return;
    }

    if (overlayMode === "hidden" && !cleanupActivationHotkeyWatcher) {
      cleanupActivationHotkeyWatcher = watchKeyHeldFor(
        resolvedOptions.hotkey,
        resolvedOptions.keyHoldDuration,
        () => {
          libStore.setState((state) => ({
            ...state,
            overlayMode: "visible",
          }));
          cleanupActivationHotkeyWatcher = null;
        }
      );
    }
  };

  const cleanupKeyStateChangeSubscription = libStore.subscribe(
    handleKeyStateChange,
    (state) => state.pressedKeys
  );

  const handleMouseMove = throttle((event: MouseEvent) => {
    libStore.setState((state) => ({
      ...state,
      mouseX: event.clientX,
      mouseY: event.clientY,
    }));
  }, THROTTLE_DELAY);

  const handleMouseDown = (event: MouseEvent) => {
    if (event.button !== 0) {
      return;
    }

    const { overlayMode } = libStore.getState();

    if (overlayMode === "hidden") {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    libStore.setState((state) => ({
      ...state,
      overlayMode: "copying",
    }));
  };

  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mousedown", handleMouseDown);
  const cleanupTrackHotkeys = trackHotkeys();

  const getElementAtPosition = (x: number, y: number): Element | null => {
    const elements = document.elementsFromPoint(x, y);

    for (const element of elements) {
      if (element.closest(`[${ATTRIBUTE_NAME}]`)) {
        continue;
      }

      const computedStyle = window.getComputedStyle(element);
      if (!isElementVisible(element, computedStyle)) {
        continue;
      }

      return element;
    }

    return null;
  };

  const handleCopy = async (element: Element) => {
    const rect = element.getBoundingClientRect();
    const cleanupCopyIndicator = showCopyIndicator(rect.left, rect.top);

    try {
      const stack = await getStack(element);
      const htmlSnippet = getHTMLSnippet(element);

      let text = htmlSnippet;

      if (stack) {
        const filteredStack = filterStack(stack);
        const serializedStack = serializeStack(filteredStack);
        text = `${serializedStack}\n\n${htmlSnippet}`;
      }

      await copyTextToClipboard(`\n${text}`);
      const tagName = (element.tagName || "").toLowerCase();
      cleanupCopyIndicator(tagName);
    } catch {
      cleanupCopyIndicator();
    }
  };

  const handleRender = throttle((state: LibStore) => {
    const { mouseX, mouseY, overlayMode } = state;

    if (overlayMode === "hidden") {
      if (selectionOverlay.isVisible()) {
        selectionOverlay.hide();
        hoveredElement = null;
      }
      return;
    }

    if (overlayMode === "copying" && hoveredElement) {
      const computedStyle = window.getComputedStyle(hoveredElement);
      const rect = hoveredElement.getBoundingClientRect();
      selectionOverlay.update({
        borderRadius: computedStyle.borderRadius || "0px",
        height: rect.height,
        transform: computedStyle.transform || "none",
        width: rect.width,
        x: rect.left,
        y: rect.top,
      });
      if (!selectionOverlay.isVisible()) {
        selectionOverlay.show();
      }

      if (!isCopying) {
        isCopying = true;
        void handleCopy(hoveredElement).finally(() => {
          libStore.setState((state) => ({
            ...state,
            overlayMode: "hidden",
          }));
          isCopying = false;
        });
      }
      return;
    }

    const element = getElementAtPosition(mouseX, mouseY);

    if (!element) {
      if (selectionOverlay.isVisible()) {
        selectionOverlay.hide();
      }
      hoveredElement = null;
      return;
    }

    hoveredElement = element;
    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);
    const borderRadius = computedStyle.borderRadius || "0px";
    const transform = computedStyle.transform || "none";

    selectionOverlay.update({
      borderRadius,
      height: rect.height,
      transform,
      width: rect.width,
      x: rect.left,
      y: rect.top,
    });

    if (!selectionOverlay.isVisible()) {
      selectionOverlay.show();
    }
  }, 10);

  const cleanupRenderSubscription = libStore.subscribe((state) => {
    scheduleRunWhenIdle(() => {
      handleRender(state);
    });
  });

  let timeout: null | number = null;

  const render = () => {
    timeout = window.setTimeout(() => {
      scheduleRunWhenIdle(() => {
        handleRender(libStore.getState());
        render();
      });
    }, 100);
  };

  render();

  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mousedown", handleMouseDown);
    cleanupTrackHotkeys();
    cleanupRenderSubscription();
    cleanupKeyStateChangeSubscription();
    if (timeout) {
      window.clearTimeout(timeout);
    }
    if (cleanupActivationHotkeyWatcher) {
      cleanupActivationHotkeyWatcher();
    }
  };
};

if (typeof window !== "undefined" && typeof document !== "undefined") {
  const currentScript = document.currentScript;
  let options: Options = {};
  if (currentScript) {
    const maybeOptions = currentScript.getAttribute("data-options");
    if (maybeOptions) {
      try {
        options = JSON.parse(maybeOptions) as Options;
      } catch {}
    }
  }
  init(options);
}
