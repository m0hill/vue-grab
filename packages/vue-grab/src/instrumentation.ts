export interface StackItem {
  componentName: string;
  displayName?: string;
  fileName: string | undefined;
  source?: string;
  props?: Record<string, unknown>;
  attrs?: Record<string, unknown>;
}

const FRAMEWORK_COMPONENT_NAMES = new Set([
  "BaseTransition",
  "KeepAlive",
  "Suspense",
  "Teleport",
  "Transition",
  "TransitionGroup",
]);

const ROUTER_COMPONENT_PATTERN = /^Router(?:View|Link)?$/;

const MAX_OBJECT_KEYS = 6;
const MAX_ARRAY_ITEMS = 5;
const MAX_STRING_LENGTH = 120;

const truncateString = (value: string) => {
  if (value.length <= MAX_STRING_LENGTH) return value;
  return `${value.slice(0, MAX_STRING_LENGTH)}…`;
};

const maybeUnwrapRef = (value: unknown): unknown => {
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    "value" in (value as Record<string, unknown>) &&
    Object.keys(value as Record<string, unknown>).length === 1
  ) {
    return (value as { value: unknown }).value;
  }
  return value;
};

const sanitizeValue = (value: unknown, depth: number = 0): unknown => {
  if (value === null || value === undefined) {
    return value;
  }

  if (depth > 2) {
    return Array.isArray(value) ? "[Array]" : "{…}";
  }

  const unwrapped = maybeUnwrapRef(value);

  if (typeof unwrapped === "string") {
    return truncateString(unwrapped);
  }

  if (typeof unwrapped === "number" || typeof unwrapped === "boolean") {
    return unwrapped;
  }

  if (Array.isArray(unwrapped)) {
    const items = [] as unknown[];
    for (let i = 0; i < unwrapped.length && i < MAX_ARRAY_ITEMS; i++) {
      const sanitized = sanitizeValue(unwrapped[i], depth + 1);
      if (sanitized !== undefined) {
        items.push(sanitized);
      }
    }
    if (unwrapped.length > MAX_ARRAY_ITEMS) {
      items.push("…");
    }
    return items.length > 0 ? items : undefined;
  }

  if (typeof unwrapped === "object") {
    const result: Record<string, unknown> = {};
    let inserted = 0;

    for (const [key, raw] of Object.entries(unwrapped)) {
      if (inserted >= MAX_OBJECT_KEYS) {
        result["…"] = "…";
        break;
      }

      const sanitized = sanitizeValue(raw, depth + 1);
      if (sanitized !== undefined) {
        result[key] = sanitized;
        inserted++;
      }
    }

    return Object.keys(result).length > 0 ? result : undefined;
  }

  return undefined;
};

const sanitizeRecord = (
  record: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined => {
  if (!record) return undefined;

  const entries = Object.entries(record);
  if (entries.length === 0) return undefined;

  const result: Record<string, unknown> = {};

  for (const [key, value] of entries) {
    const sanitized = sanitizeValue(value);
    if (sanitized !== undefined) {
      result[key] = sanitized;
    }
  }

  return Object.keys(result).length > 0 ? result : undefined;
};

// Helper to get Vue component instance from a DOM element
const getVueInstance = (element: Element): any => {
  const anyElement = element as any;

  if (anyElement.__vueParentComponent) {
    return anyElement.__vueParentComponent;
  }

  // Vue 2: Check for __vue__ (double underscore at end)
  if (anyElement.__vue__) {
    return anyElement.__vue__;
  }

  // Vue 3: Check if element has Vue instance properties
  const keys = Object.getOwnPropertyNames(anyElement);
  for (const key of keys) {
    if (key.startsWith("__vue")) {
      const value = anyElement[key];
      if (value?.type || value?.component) {
        return value.component || value;
      }
    }
  }

  // Vue 3: Try to get instance from vnode
  const vnode = anyElement.__vnode;
  if (vnode?.component) {
    return vnode.component;
  }

  // Try parent elements
  let current = element.parentElement;
  const visited = new Set<Element>();
  while (current) {
    if (visited.has(current)) {
      break;
    }
    visited.add(current);

    const currentAny = current as any;

    if (currentAny.__vueParentComponent) {
      return currentAny.__vueParentComponent;
    }

    // Vue 2: Check parent for __vue__
    if (currentAny.__vue__) {
      return currentAny.__vue__;
    }

    // Vue 3: Check parent for Vue instance properties
    const currentKeys = Object.getOwnPropertyNames(current);
    for (const key of currentKeys) {
      if (key.startsWith("__vue")) {
        const value = currentAny[key];
        if (value?.type || value?.component) {
          return value.component || value;
        }
      }
    }

    const parentVnode = currentAny.__vnode;
    if (parentVnode?.component) {
      return parentVnode.component;
    }
    current = current.parentElement;
  }

  return null;
};

// Helper to extract component name from a component instance
const getComponentName = (component: any): string => {
  if (!component) return "Unknown";

  // Vue 3: Try various ways to get the component name
  if (component.type?.name) return component.type.name;
  if (component.type?.__name) return component.type.__name;
  if (component.proxy?.$options?.name) return component.proxy.$options.name;
  if (component.proxy?.$options?.__name) return component.proxy.$options.__name;

  // Vue 2: Try $options.name directly
  if (component.$options?.name) return component.$options.name;
  if (component.$options?._componentTag)
    return component.$options._componentTag;

  // Vue 3: Try to extract from file path
  if (component.type?.__file) {
    const filePath = component.type.__file;
    const fileName = filePath
      .split("/")
      .pop()
      ?.replace(/\.(vue|js|ts)$/, "");
    if (fileName) return fileName;
  }

  // Vue 2: Try to extract from file path
  if (component.$options?.__file) {
    const filePath = component.$options.__file;
    const fileName = filePath
      .split("/")
      .pop()
      ?.replace(/\.(vue|js|ts)$/, "");
    if (fileName) return fileName;
  }

  return "Anonymous";
};

// Helper to get file information from component
const getComponentFile = (component: any): string | undefined => {
  if (!component) return undefined;

  // Vue 3: File path in type.__file
  if (component.type?.__file) {
    return component.type.__file;
  }

  if (component.proxy?.$options?.__file) {
    return component.proxy.$options.__file;
  }

  // Vue 2: File path in $options.__file
  if (component.$options?.__file) {
    return component.$options.__file;
  }

  return undefined;
};

const getComponentSourceLocation = (component: any): string | undefined => {
  const file = getComponentFile(component);
  if (!file) return undefined;

  const proxySubTree = component.proxy?.$ ? component.proxy.$.subTree : undefined;
  const vnode = component.subTree ?? component.vnode ?? proxySubTree;
  const loc = vnode?.loc ?? vnode?.source?.loc;
  const start = loc?.start;

  if (start?.line !== undefined && start?.column !== undefined) {
    return `${file}:${start.line}:${start.column}`;
  }

  const devtoolsState = component.devtoolsRawSetupState as
    | Record<string, { loc?: { file?: string; line?: number; column?: number } }>
    | undefined;

  if (devtoolsState) {
    for (const entry of Object.values(devtoolsState)) {
      const locFromDevtools = entry?.loc;
      if (
        locFromDevtools &&
        locFromDevtools.line !== undefined &&
        locFromDevtools.column !== undefined
      ) {
        return `${file}:${locFromDevtools.line}:${locFromDevtools.column}`;
      }
    }
  }

  return undefined;
};

const getComponentProps = (component: any): Record<string, unknown> | undefined => {
  const proxyProps = component.proxy?.$props;
  const vue2Props = component.$props;
  const rawProps = proxyProps ?? component.props ?? vue2Props;
  if (!rawProps) return undefined;

  return sanitizeRecord(rawProps as Record<string, unknown>);
};

const getComponentAttrs = (component: any): Record<string, unknown> | undefined => {
  const attrs = component.attrs ?? component.proxy?.$attrs ?? component.$attrs;
  if (!attrs) return undefined;

  return sanitizeRecord(attrs as Record<string, unknown>);
};

const isFrameworkComponent = (item: StackItem) => {
  const name = item.componentName;
  if (!name) return false;
  if (FRAMEWORK_COMPONENT_NAMES.has(name)) return true;
  if (ROUTER_COMPONENT_PATTERN.test(name)) return true;
  const fileName = item.fileName ?? "";
  if (fileName.includes("node_modules/@vue")) return true;
  if (fileName.includes("node_modules/vue-router")) return true;
  if (fileName.includes("node_modules/pinia")) return true;
  return false;
};

// Build component stack by walking up the parent chain
const buildComponentStack = (component: any): StackItem[] => {
  const stack: StackItem[] = [];
  let current = component;
  const seen = new Set<any>();

  while (current && !seen.has(current)) {
    seen.add(current);
    const name = getComponentName(current);
    const fileName = getComponentFile(current);
    const source = getComponentSourceLocation(current);
    const props = getComponentProps(current);
    const attrs = getComponentAttrs(current);

    stack.push({
      componentName: name,
      fileName,
      source,
      props,
      attrs,
    });

    current = current.parent ?? current.$parent ?? null;
  }

  return stack;
};

export const getStack = async (
  element: Element,
): Promise<StackItem[] | null> => {
  try {
    const component = getVueInstance(element);
    if (!component) return null;

    const stack = buildComponentStack(component);
    return stack.length > 0 ? stack : null;
  } catch (error) {
    // Silently fail if we can't get component info
    return null;
  }
};

export const filterStack = (stack: StackItem[]) => {
  if (stack.length === 0) return stack;

  const deduped: StackItem[] = [];
  const seen = new Set<string>();

  for (const item of stack) {
    const key = `${item.componentName}|${item.fileName ?? ""}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(item);
    }
  }

  const filtered: StackItem[] = [];

  for (let index = 0; index < deduped.length; index++) {
    const item = deduped[index];

    if (index === 0) {
      filtered.push(item);
      continue;
    }

    const { componentName, fileName } = item;
    if (!componentName || componentName.length <= 1) {
      continue;
    }

    if (componentName === "Anonymous") {
      continue;
    }

    if (fileName && fileName.startsWith("_")) {
      continue;
    }

    if (fileName && fileName.includes("node_modules")) {
      continue;
    }

    if (isFrameworkComponent(item)) {
      continue;
    }

    filtered.push(item);
  }

  if (filtered.length === 0) {
    const fallback = deduped.find((item) => !isFrameworkComponent(item));
    return fallback ? [fallback] : [];
  }

  return filtered;
};

export const serializeStack = (stack: StackItem[]) => {
  const lines: string[] = [];

  const formatRecord = (record: Record<string, unknown>) => {
    const parts: string[] = [];
    for (const [key, value] of Object.entries(record)) {
      if (value === undefined) continue;

      if (Array.isArray(value)) {
        const formattedItems = value
          .map((item) =>
            typeof item === "object" && item !== null
              ? JSON.stringify(item)
              : String(item),
          )
          .join(", ");
        parts.push(`${key}: [${formattedItems}]`);
        continue;
      }

      if (typeof value === "object" && value !== null) {
        parts.push(`${key}: ${JSON.stringify(value)}`);
        continue;
      }

      parts.push(`${key}: ${String(value)}`);
    }
    return parts.join(", ");
  };

  stack.forEach((item, index) => {
    const componentName = item.displayName || item.componentName;
    const prefix = index === 0 ? "➤" : "↳";
    const lineParts = [`${prefix} ${componentName}`];
    if (item.fileName) {
      lineParts.push(`(${item.fileName})`);
    }
    lines.push(lineParts.join(" "));

    if (item.source && index === 0) {
      lines.push(`    source: ${item.source}`);
    }

    if (item.props) {
      const formattedProps = formatRecord(item.props);
      if (formattedProps) {
        lines.push(`    props: ${formattedProps}`);
      }
    }

    if (item.attrs) {
      const formattedAttrs = formatRecord(item.attrs);
      if (formattedAttrs) {
        lines.push(`    attrs: ${formattedAttrs}`);
      }
    }
  });

  return lines.join("\n");
};

export const getHTMLSnippet = (element: Element) => {
  const semanticTags = new Set([
    "article",
    "aside",
    "footer",
    "form",
    "header",
    "main",
    "nav",
    "section",
  ]);

  const hasDistinguishingFeatures = (el: Element): boolean => {
    const tagName = el.tagName.toLowerCase();
    if (semanticTags.has(tagName)) return true;
    if (el.id) return true;
    if (el.className && typeof el.className === "string") {
      const classes = el.className.trim();
      if (classes && classes.length > 0) return true;
    }
    return Array.from(el.attributes).some((attr) =>
      attr.name.startsWith("data-"),
    );
  };

  const getAncestorChain = (el: Element, maxDepth: number = 10): Element[] => {
    const ancestors: Element[] = [];
    let current = el.parentElement;
    let depth = 0;

    while (current && depth < maxDepth && current.tagName !== "BODY") {
      if (hasDistinguishingFeatures(current)) {
        ancestors.push(current);
        if (ancestors.length >= 3) break;
      }
      current = current.parentElement;
      depth++;
    }

    return ancestors.reverse();
  };

  const getCSSPath = (el: Element): string => {
    const parts: string[] = [];
    let current: Element | null = el;
    let depth = 0;
    const maxDepth = 5;

    while (current && depth < maxDepth && current.tagName !== "BODY") {
      let selector = current.tagName.toLowerCase();

      if (current.id) {
        selector += `#${current.id}`;
        parts.unshift(selector);
        break;
      } else if (
        current.className &&
        typeof current.className === "string" &&
        current.className.trim()
      ) {
        const classes = current.className.trim().split(/\s+/).slice(0, 2);
        selector += `.${classes.join(".")}`;
      }

      if (
        !current.id &&
        (!current.className || !current.className.trim()) &&
        current.parentElement
      ) {
        const siblings = Array.from(current.parentElement.children);
        const index = siblings.indexOf(current);
        if (index >= 0 && siblings.length > 1) {
          selector += `:nth-child(${index + 1})`;
        }
      }

      parts.unshift(selector);
      current = current.parentElement;
      depth++;
    }

    return parts.join(" > ");
  };

  const getElementTag = (el: Element, compact: boolean = false): string => {
    const tagName = el.tagName.toLowerCase();
    const attrs: string[] = [];

    if (el.id) {
      attrs.push(`id="${el.id}"`);
    }

    if (el.className && typeof el.className === "string") {
      const classes = el.className
        .trim()
        .split(/\s+/)
        .filter((c) => !c.startsWith("data-v-"));
      if (classes.length > 0 && classes[0]) {
        const displayClasses = compact ? classes.slice(0, 3) : classes;
        let classStr = displayClasses.join(" ");
        if (classStr.length > 50) {
          classStr = classStr.substring(0, 50) + "...";
        }
        attrs.push(`class="${classStr}"`);
      }
    }

    const importantAttrs = [
      "type",
      "name",
      "placeholder",
      "value",
      "href",
      "src",
      "alt",
      "for",
      "role",
    ];
    for (const attrName of importantAttrs) {
      const attrValue = el.getAttribute(attrName);
      if (attrValue !== null) {
        let value = attrValue;
        if (value.length > 40) {
          value = value.substring(0, 40) + "...";
        }
        attrs.push(`${attrName}="${value}"`);
      }
    }

    if (!compact) {
      const dataAttrs = Array.from(el.attributes).filter(
        (attr) =>
          attr.name.startsWith("data-") && !attr.name.startsWith("data-v-"),
      );
      for (const attr of dataAttrs.slice(0, 2)) {
        let value = attr.value;
        if (value.length > 20) {
          value = value.substring(0, 20) + "...";
        }
        attrs.push(`${attr.name}="${value}"`);
      }

      const ariaLabel = el.getAttribute("aria-label");
      if (ariaLabel) {
        let value = ariaLabel;
        if (value.length > 30) {
          value = value.substring(0, 30) + "...";
        }
        attrs.push(`aria-label="${value}"`);
      }
    }

    return attrs.length > 0
      ? `<${tagName} ${attrs.join(" ")}>`
      : `<${tagName}>`;
  };

  const getClosingTag = (el: Element) => {
    return `</${el.tagName.toLowerCase()}>`;
  };

  const getTextContent = (el: Element) => {
    let text = "";

    for (const node of el.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        const nodeText = node.textContent?.trim();
        if (nodeText) {
          text += (text ? " " : "") + nodeText;
        }
      }
    }

    text = text.replace(/\s+/g, " ").trim();
    const maxLength = 100;
    if (text.length > maxLength) {
      text = text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const getSiblingIdentifier = (el: Element): null | string => {
    if (el.id) return `#${el.id}`;
    if (el.className && typeof el.className === "string") {
      const classes = el.className.trim().split(/\s+/);
      if (classes.length > 0 && classes[0]) {
        return `.${classes[0]}`;
      }
    }
    return null;
  };

  const lines: string[] = [];

  lines.push(`Path: ${getCSSPath(element)}`);
  lines.push("");

  const ancestors = getAncestorChain(element);

  for (let i = 0; i < ancestors.length; i++) {
    const indent = "  ".repeat(i);
    lines.push(indent + getElementTag(ancestors[i], true));
  }

  const parent = element.parentElement;
  let targetIndex = -1;
  if (parent) {
    const siblings = Array.from(parent.children);
    targetIndex = siblings.indexOf(element);

    if (targetIndex > 0) {
      const prevSibling = siblings[targetIndex - 1];
      const prevId = getSiblingIdentifier(prevSibling);
      const prevText = getTextContent(prevSibling);

      if (targetIndex === 1) {
        const indent = "  ".repeat(ancestors.length);
        if (
          prevText &&
          prevText.length < 40 &&
          prevSibling.children.length === 0
        ) {
          lines.push(
            `${indent}  ${getElementTag(prevSibling, true)}${prevText}</${prevSibling.tagName.toLowerCase()}>`,
          );
        } else {
          lines.push(
            `${indent}  ${getElementTag(prevSibling, true)}</${prevSibling.tagName.toLowerCase()}>`,
          );
        }
      } else if (targetIndex === 2 && prevId) {
        const indent = "  ".repeat(ancestors.length);
        const prevPrevSibling = siblings[targetIndex - 2];
        lines.push(
          `${indent}  ${getElementTag(prevPrevSibling, true)}</${prevPrevSibling.tagName.toLowerCase()}>`,
        );
        if (
          prevText &&
          prevText.length < 40 &&
          prevSibling.children.length === 0
        ) {
          lines.push(
            `${indent}  ${getElementTag(prevSibling, true)}${prevText}</${prevSibling.tagName.toLowerCase()}>`,
          );
        } else {
          lines.push(
            `${indent}  ${getElementTag(prevSibling, true)}</${prevSibling.tagName.toLowerCase()}>`,
          );
        }
      } else if (targetIndex > 2) {
        const indent = "  ".repeat(ancestors.length);
        lines.push(
          `${indent}  ... (${targetIndex} sibling${
            targetIndex === 1 ? "" : "s"
          } before)`,
        );
      }
    }
  }

  const indent = "  ".repeat(ancestors.length);
  lines.push(indent + "  <!-- SELECTED -->");

  const textContent = getTextContent(element);
  const childrenCount = element.children.length;

  if (textContent && childrenCount === 0 && textContent.length < 60) {
    lines.push(
      `${indent}  ${getElementTag(element)}${textContent}${getClosingTag(
        element,
      )}`,
    );
  } else {
    lines.push(indent + "  " + getElementTag(element));
    if (textContent && childrenCount === 0) {
      lines.push(`${indent}    ${textContent}`);
    }
    if (childrenCount > 0 && childrenCount <= 8) {
      for (let i = 0; i < childrenCount; i++) {
        const child = element.children[i];
        const childTag = getElementTag(child, true);
        const childText = getTextContent(child);
        if (childText && childText.length < 50 && child.children.length === 0) {
          lines.push(
            `${indent}    ${childTag}${childText}</${child.tagName.toLowerCase()}>`,
          );
        } else if (childText && childText.length < 30) {
          lines.push(`${indent}    ${childTag}`);
          lines.push(`${indent}      ${childText}`);
          lines.push(`${indent}    </${child.tagName.toLowerCase()}>`);
        } else {
          lines.push(
            `${indent}    ${childTag}</${child.tagName.toLowerCase()}>`,
          );
        }
      }
    } else if (childrenCount > 8) {
      lines.push(`${indent}    ... (${childrenCount} child elements)`);
    }
    lines.push(indent + "  " + getClosingTag(element));
  }

  if (parent && targetIndex >= 0) {
    const siblings = Array.from(parent.children);
    const siblingsAfter = siblings.length - targetIndex - 1;
    if (siblingsAfter > 0) {
      const nextSibling = siblings[targetIndex + 1];
      const nextId = getSiblingIdentifier(nextSibling);
      const nextText = getTextContent(nextSibling);

      if (siblingsAfter === 1) {
        if (
          nextText &&
          nextText.length < 40 &&
          nextSibling.children.length === 0
        ) {
          lines.push(
            `${indent}  ${getElementTag(nextSibling, true)}${nextText}</${nextSibling.tagName.toLowerCase()}>`,
          );
        } else {
          lines.push(
            `${indent}  ${getElementTag(nextSibling, true)}</${nextSibling.tagName.toLowerCase()}>`,
          );
        }
      } else if (siblingsAfter === 2 && nextId) {
        const nextNextSibling = siblings[targetIndex + 2];
        if (
          nextText &&
          nextText.length < 40 &&
          nextSibling.children.length === 0
        ) {
          lines.push(
            `${indent}  ${getElementTag(nextSibling, true)}${nextText}</${nextSibling.tagName.toLowerCase()}>`,
          );
        } else {
          lines.push(
            `${indent}  ${getElementTag(nextSibling, true)}</${nextSibling.tagName.toLowerCase()}>`,
          );
        }
        lines.push(
          `${indent}  ${getElementTag(nextNextSibling, true)}</${nextNextSibling.tagName.toLowerCase()}>`,
        );
      } else if (siblingsAfter > 2) {
        lines.push(
          `${indent}  ... (${siblingsAfter} sibling${
            siblingsAfter === 1 ? "" : "s"
          } after)`,
        );
      }
    }
  }

  for (let i = ancestors.length - 1; i >= 0; i--) {
    const indent = "  ".repeat(i);
    lines.push(indent + getClosingTag(ancestors[i]));
  }

  return lines.join("\n");
};
