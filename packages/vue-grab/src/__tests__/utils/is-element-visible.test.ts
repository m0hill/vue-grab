import { describe, it, expect, beforeEach } from "vitest";
import { isElementVisible } from "../../utils/is-element-visible";

describe("isElementVisible", () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement("div");
    document.body.appendChild(element);
  });

  it("should return true for visible element", () => {
    const computedStyle = {
      display: "block",
      visibility: "visible",
      opacity: "1",
    } as CSSStyleDeclaration;

    expect(isElementVisible(element, computedStyle)).toBe(true);
  });

  it("should return false when display is none", () => {
    const computedStyle = {
      display: "none",
      visibility: "visible",
      opacity: "1",
    } as CSSStyleDeclaration;

    expect(isElementVisible(element, computedStyle)).toBe(false);
  });

  it("should return false when visibility is hidden", () => {
    const computedStyle = {
      display: "block",
      visibility: "hidden",
      opacity: "1",
    } as CSSStyleDeclaration;

    expect(isElementVisible(element, computedStyle)).toBe(false);
  });

  it("should return false when opacity is 0", () => {
    const computedStyle = {
      display: "block",
      visibility: "visible",
      opacity: "0",
    } as CSSStyleDeclaration;

    expect(isElementVisible(element, computedStyle)).toBe(false);
  });

  it("should use window.getComputedStyle when not provided", () => {
    element.style.display = "block";
    element.style.visibility = "visible";
    element.style.opacity = "1";

    expect(isElementVisible(element)).toBe(true);
  });

  it("should handle partial opacity values", () => {
    const computedStyle = {
      display: "block",
      visibility: "visible",
      opacity: "0.5",
    } as CSSStyleDeclaration;

    expect(isElementVisible(element, computedStyle)).toBe(true);
  });
});
