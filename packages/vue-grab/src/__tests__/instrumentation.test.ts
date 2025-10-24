import { describe, it, expect, beforeEach } from "vitest";
import {
  getHTMLSnippet,
  filterStack,
  serializeStack,
  getStack,
  type StackItem,
} from "../instrumentation";

describe("instrumentation", () => {
  describe("getHTMLSnippet", () => {
    beforeEach(() => {
      document.body.innerHTML = "";
    });

    it("should generate HTML snippet for simple element", () => {
      const element = document.createElement("div");
      element.id = "test";
      element.textContent = "Hello World";
      document.body.appendChild(element);

      const snippet = getHTMLSnippet(element);

      expect(snippet).toContain("<!-- SELECTED -->");
      expect(snippet).toContain('id="test"');
      expect(snippet).toContain("Hello World");
    });

    it("should include CSS path", () => {
      const parent = document.createElement("div");
      parent.className = "parent";
      const child = document.createElement("span");
      child.className = "child";
      parent.appendChild(child);
      document.body.appendChild(parent);

      const snippet = getHTMLSnippet(child);

      expect(snippet).toContain("Path:");
      expect(snippet).toContain("span.child");
    });

    it("should show ancestor elements", () => {
      const grandparent = document.createElement("div");
      grandparent.id = "grandparent";
      const parent = document.createElement("div");
      parent.className = "parent";
      const child = document.createElement("span");
      child.className = "child";

      grandparent.appendChild(parent);
      parent.appendChild(child);
      document.body.appendChild(grandparent);

      const snippet = getHTMLSnippet(child);

      expect(snippet).toContain('id="grandparent"');
      expect(snippet).toContain('class="parent"');
    });

    it("should truncate long text content", () => {
      const element = document.createElement("div");
      element.textContent = "a".repeat(100);
      document.body.appendChild(element);

      const snippet = getHTMLSnippet(element);

      expect(snippet).toContain("...");
    });

    it("should show sibling information", () => {
      const parent = document.createElement("div");
      const sibling1 = document.createElement("div");
      sibling1.id = "sibling1";
      const target = document.createElement("div");
      target.id = "target";
      const sibling2 = document.createElement("div");
      sibling2.id = "sibling2";

      parent.appendChild(sibling1);
      parent.appendChild(target);
      parent.appendChild(sibling2);
      document.body.appendChild(parent);

      const snippet = getHTMLSnippet(target);

      expect(snippet).toContain('id="sibling1"');
      expect(snippet).toContain('id="sibling2"');
    });

    it("should handle elements with data attributes", () => {
      const element = document.createElement("div");
      element.setAttribute("data-test-id", "my-component");
      document.body.appendChild(element);

      const snippet = getHTMLSnippet(element);

      expect(snippet).toContain('data-test-id="my-component"');
    });

    it("should handle elements with classes", () => {
      const element = document.createElement("div");
      element.className = "class1 class2 class3";
      document.body.appendChild(element);

      const snippet = getHTMLSnippet(element);

      expect(snippet).toContain("class=");
      expect(snippet).toContain("class1");
    });
  });

  describe("filterStack", () => {
    it("should filter out node_modules entries", () => {
      const stack: StackItem[] = [
        { componentName: "MyComponent", fileName: "/src/MyComponent.vue" },
        {
          componentName: "VueInternal",
          fileName: "/node_modules/vue/dist/vue.js",
        },
        { componentName: "App", fileName: "/src/App.vue" },
      ];

      const filtered = filterStack(stack);

      expect(filtered).toHaveLength(2);
      expect(filtered[0].componentName).toBe("MyComponent");
      expect(filtered[1].componentName).toBe("App");
    });

    it("should filter out entries without fileName", () => {
      const stack: StackItem[] = [
        { componentName: "MyComponent", fileName: "/src/MyComponent.vue" },
        { componentName: "Anonymous", fileName: undefined },
      ];

      const filtered = filterStack(stack);

      expect(filtered).toHaveLength(1);
      expect(filtered[0].componentName).toBe("MyComponent");
    });

    it("should filter out entries starting with underscore", () => {
      const stack: StackItem[] = [
        { componentName: "MyComponent", fileName: "/src/MyComponent.vue" },
        { componentName: "Internal", fileName: "_internal.vue" },
      ];

      const filtered = filterStack(stack);

      expect(filtered).toHaveLength(1);
      expect(filtered[0].componentName).toBe("MyComponent");
    });

    it("should filter out single-character component names", () => {
      const stack: StackItem[] = [
        { componentName: "MyComponent", fileName: "/src/MyComponent.vue" },
        { componentName: "A", fileName: "/src/A.vue" },
      ];

      const filtered = filterStack(stack);

      expect(filtered).toHaveLength(1);
      expect(filtered[0].componentName).toBe("MyComponent");
    });
  });

  describe("serializeStack", () => {
    it("should serialize stack items correctly", () => {
      const stack: StackItem[] = [
        {
          componentName: "MyComponent",
          fileName: "/src/MyComponent.vue",
          source: "/src/MyComponent.vue:10:5",
        },
        { componentName: "App", fileName: "/src/App.vue" },
      ];

      const serialized = serializeStack(stack);

      expect(serialized).toContain("MyComponent (/src/MyComponent.vue)");
      expect(serialized).toContain("/src/MyComponent.vue:10:5");
      expect(serialized).toContain("App (/src/App.vue)");
    });

    it("should use displayName when available", () => {
      const stack: StackItem[] = [
        {
          componentName: "component",
          displayName: "MyBeautifulComponent",
          fileName: "/src/MyComponent.vue",
        },
      ];

      const serialized = serializeStack(stack);

      expect(serialized).toContain("MyBeautifulComponent");
      expect(serialized).not.toContain("component (");
    });

    it("should handle items without fileName", () => {
      const stack: StackItem[] = [
        { componentName: "MyComponent", fileName: undefined },
      ];

      const serialized = serializeStack(stack);

      expect(serialized).toBe("MyComponent");
    });

    it("should add source info only for first item", () => {
      const stack: StackItem[] = [
        {
          componentName: "First",
          fileName: "/src/First.vue",
          source: "/src/First.vue:10:5",
        },
        {
          componentName: "Second",
          fileName: "/src/Second.vue",
          source: "/src/Second.vue:20:10",
        },
      ];

      const serialized = serializeStack(stack);
      const lines = serialized.split("\n");

      expect(lines).toContain("/src/First.vue:10:5");
      expect(serialized).not.toContain("/src/Second.vue:20:10");
    });
  });

  describe("getStack", () => {
    it("should return null for element without Vue instance", async () => {
      const element = document.createElement("div");
      document.body.appendChild(element);

      const stack = await getStack(element);

      expect(stack).toBeNull();
    });

    it("should extract component stack from Vue element", async () => {
      const element = document.createElement("div");

      // Mock Vue 3 component structure
      (element as any).__vnode = {
        component: {
          type: {
            name: "MyComponent",
            __file: "/src/MyComponent.vue",
          },
          parent: {
            type: {
              name: "App",
              __file: "/src/App.vue",
            },
            parent: null,
          },
        },
      };

      document.body.appendChild(element);

      const stack = await getStack(element);

      expect(stack).not.toBeNull();
      expect(stack).toHaveLength(2);
      expect(stack?.[0].componentName).toBe("MyComponent");
      expect(stack?.[0].fileName).toBe("/src/MyComponent.vue");
      expect(stack?.[1].componentName).toBe("App");
    });

    it("should handle component without name", async () => {
      const element = document.createElement("div");

      (element as any).__vnode = {
        component: {
          type: {},
          parent: null,
        },
      };

      document.body.appendChild(element);

      const stack = await getStack(element);

      expect(stack).not.toBeNull();
      expect(stack?.[0].componentName).toBe("Anonymous");
    });

    it("should traverse parent elements to find Vue instance", async () => {
      const parent = document.createElement("div");
      const child = document.createElement("span");
      parent.appendChild(child);

      (parent as any).__vnode = {
        component: {
          type: {
            name: "ParentComponent",
          },
          parent: null,
        },
      };

      document.body.appendChild(parent);

      const stack = await getStack(child);

      expect(stack).not.toBeNull();
      expect(stack?.[0].componentName).toBe("ParentComponent");
    });
  });
});
