import { describe, it, expect, beforeEach } from "vitest";
import { mountRoot, ATTRIBUTE_NAME } from "../../utils/mount-root";

describe("mountRoot", () => {
  beforeEach(() => {
    // Clean up any existing mount roots
    const existing = document.querySelectorAll(`[${ATTRIBUTE_NAME}]`);
    existing.forEach((el) => el.remove());
  });

  it("should create a shadow root container", () => {
    const root = mountRoot();

    expect(root).toBeInstanceOf(HTMLDivElement);
    expect(root.getAttribute(ATTRIBUTE_NAME)).toBe("true");
  });

  it("should attach shadow DOM to host element", () => {
    mountRoot();

    const host = document.querySelector(`[${ATTRIBUTE_NAME}]`);
    expect(host).toBeTruthy();
    expect(host?.shadowRoot).toBeTruthy();
  });

  it("should return existing root if already mounted", () => {
    const root1 = mountRoot();
    const root2 = mountRoot();

    expect(root1).toBe(root2);
  });

  it("should set correct z-index on host", () => {
    mountRoot();

    const host = document.querySelector(`[${ATTRIBUTE_NAME}]`) as HTMLElement;
    expect(host.style.zIndex).toBe("2147483646");
  });

  it("should position host fixed at top-left", () => {
    mountRoot();

    const host = document.querySelector(`[${ATTRIBUTE_NAME}]`) as HTMLElement;
    expect(host.style.position).toBe("fixed");
    expect(host.style.top).toBe("0px");
    expect(host.style.left).toBe("0px");
  });

  it("should append root inside shadow DOM", () => {
    const root = mountRoot();
    const host = document.querySelector(`[${ATTRIBUTE_NAME}]`);

    expect(host?.shadowRoot?.contains(root)).toBe(true);
  });

  it("should append host to document body", () => {
    mountRoot();

    const host = document.querySelector(`[${ATTRIBUTE_NAME}]`);
    expect(document.body.contains(host)).toBe(true);
  });
});
