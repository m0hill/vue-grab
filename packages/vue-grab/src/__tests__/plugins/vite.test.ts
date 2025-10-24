import { describe, it, expect } from "vitest";
import { vueGrab } from "../../plugins/vite";

describe("vite plugin", () => {
  it("should create plugin with default options", () => {
    const plugin = vueGrab();

    expect(plugin.name).toBe("vite-plugin-vue-grab");
    expect(plugin.apply).toBe("serve");
  });

  it("should inject script tag in HTML", () => {
    const plugin = vueGrab();

    if (typeof plugin.transformIndexHtml === "object") {
      const html = "<html><head></head><body></body></html>";
      const result = plugin.transformIndexHtml.handler(html);

      expect(result).toContain("<script");
      expect(result).toContain("vue-grab/dist/index.global.js");
      expect(result).toContain('data-enabled="true"');
    }
  });

  it("should include adapter option when provided", () => {
    const plugin = vueGrab({ adapter: "cursor" });

    if (typeof plugin.transformIndexHtml === "object") {
      const html = "<html><head></head><body></body></html>";
      const result = plugin.transformIndexHtml.handler(html);

      expect(result).toContain('data-adapter="cursor"');
    }
  });

  it("should respect enabled option", () => {
    const plugin = vueGrab({ enabled: false });

    if (typeof plugin.transformIndexHtml === "object") {
      const html = "<html><head></head><body></body></html>";
      const result = plugin.transformIndexHtml.handler(html);

      expect(result).toContain('data-enabled="false"');
    }
  });

  it("should inject script at beginning of head", () => {
    const plugin = vueGrab();

    if (typeof plugin.transformIndexHtml === "object") {
      const html = "<html><head><title>Test</title></head><body></body></html>";
      const result = plugin.transformIndexHtml.handler(html);

      const headIndex = result.indexOf("<head>");
      const scriptIndex = result.indexOf("<script");
      const titleIndex = result.indexOf("<title>");

      expect(scriptIndex).toBeGreaterThan(headIndex);
      expect(scriptIndex).toBeLessThan(titleIndex);
    }
  });

  it("should use pre order for transformation", () => {
    const plugin = vueGrab();

    if (typeof plugin.transformIndexHtml === "object") {
      expect(plugin.transformIndexHtml.order).toBe("pre");
    }
  });

  it("should only apply during serve", () => {
    const plugin = vueGrab();

    expect(plugin.apply).toBe("serve");
  });
});
