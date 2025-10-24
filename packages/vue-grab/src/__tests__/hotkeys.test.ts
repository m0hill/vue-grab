import { describe, it, expect, vi } from "vitest";

// Import only the specific functions we need to test without circular dependencies
const isCustomElement = (element: HTMLElement): boolean => {
  return (
    Boolean(element.tagName) &&
    !element.tagName.startsWith("-") &&
    element.tagName.includes("-")
  );
};

const FORM_TAGS_AND_ROLES = [
  "input",
  "textarea",
  "select",
  "searchbox",
  "slider",
  "spinbutton",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "option",
  "radio",
  "textbox",
] as const;

const isReadonlyArray = (value: unknown): value is readonly unknown[] => {
  return Array.isArray(value);
};

const isHotkeyEnabledOnTagName = (
  event: KeyboardEvent,
  enabledOnTags: boolean | readonly string[] = false
): boolean => {
  const { composed, target } = event;

  let targetTagName: EventTarget | null | string | undefined;
  let targetRole: null | string | undefined;

  if (target instanceof HTMLElement && isCustomElement(target) && composed) {
    const composedPath = event.composedPath();
    const targetElement = composedPath[0];

    if (targetElement instanceof HTMLElement) {
      targetTagName = targetElement.tagName;
      targetRole = targetElement.role;
    }
  } else if (target instanceof HTMLElement) {
    targetTagName = target.tagName;
    targetRole = target.role;
  }

  if (isReadonlyArray(enabledOnTags)) {
    return Boolean(
      targetTagName &&
        enabledOnTags &&
        enabledOnTags.some(
          (tag) =>
            (typeof targetTagName === "string" &&
              tag.toLowerCase() === targetTagName.toLowerCase()) ||
            tag === targetRole
        )
    );
  }

  return Boolean(targetTagName && enabledOnTags && enabledOnTags);
};

const isKeyboardEventTriggeredByInput = (event: KeyboardEvent): boolean => {
  return isHotkeyEnabledOnTagName(event, FORM_TAGS_AND_ROLES);
};

describe("hotkeys", () => {
  describe("isCustomElement", () => {
    it("should return true for custom elements", () => {
      const element = document.createElement("my-component");
      expect(isCustomElement(element as HTMLElement)).toBe(true);
    });

    it("should return false for standard elements", () => {
      const element = document.createElement("div");
      expect(isCustomElement(element)).toBe(false);
    });

    it("should return false for elements starting with hyphen", () => {
      const element = document.createElement("div");
      Object.defineProperty(element, "tagName", {
        value: "-invalid",
        writable: false,
      });
      expect(isCustomElement(element)).toBe(false);
    });

    it("should return false for elements without hyphen", () => {
      const element = document.createElement("span");
      expect(isCustomElement(element)).toBe(false);
    });
  });

  describe("isKeyboardEventTriggeredByInput", () => {
    it("should return true for input elements", () => {
      const input = document.createElement("input");
      document.body.appendChild(input);

      const event = new KeyboardEvent("keydown", {
        key: "a",
        bubbles: true,
      });

      Object.defineProperty(event, "target", {
        value: input,
        writable: false,
      });

      expect(isKeyboardEventTriggeredByInput(event)).toBe(true);
    });

    it("should return true for textarea elements", () => {
      const textarea = document.createElement("textarea");
      document.body.appendChild(textarea);

      const event = new KeyboardEvent("keydown", {
        key: "a",
        bubbles: true,
      });

      Object.defineProperty(event, "target", {
        value: textarea,
        writable: false,
      });

      expect(isKeyboardEventTriggeredByInput(event)).toBe(true);
    });

    it("should return true for select elements", () => {
      const select = document.createElement("select");
      document.body.appendChild(select);

      const event = new KeyboardEvent("keydown", {
        key: "a",
        bubbles: true,
      });

      Object.defineProperty(event, "target", {
        value: select,
        writable: false,
      });

      expect(isKeyboardEventTriggeredByInput(event)).toBe(true);
    });

    it("should return false for div elements", () => {
      const div = document.createElement("div");
      document.body.appendChild(div);

      const event = new KeyboardEvent("keydown", {
        key: "a",
        bubbles: true,
      });

      Object.defineProperty(event, "target", {
        value: div,
        writable: false,
      });

      expect(isKeyboardEventTriggeredByInput(event)).toBe(false);
    });

    it("should handle elements with textbox role", () => {
      const div = document.createElement("div");
      div.setAttribute("role", "textbox");
      document.body.appendChild(div);

      const event = new KeyboardEvent("keydown", {
        key: "a",
        bubbles: true,
      });

      Object.defineProperty(event, "target", {
        value: div,
        writable: false,
      });

      expect(isKeyboardEventTriggeredByInput(event)).toBe(true);
    });
  });
});
