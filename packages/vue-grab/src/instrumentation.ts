export interface StackItem {
  componentName: string;
  displayName?: string;
  fileName: string | undefined;
  source?: string;
}

// Helper to get Vue component instance from a DOM element
const getVueInstance = (element: Element): any => {
  // Vue 2: Check for __vue__ (double underscore at end)
  if ((element as any).__vue__) {
    return (element as any).__vue__;
  }

  // Vue 3: Check if element has Vue instance properties
  const keys = Object.getOwnPropertyNames(element);
  for (const key of keys) {
    if (key.startsWith("__vue")) {
      const value = (element as any)[key];
      if (value?.type || value?.component) {
        return value.component || value;
      }
    }
  }

  // Vue 3: Try to get instance from vnode
  const vnode = (element as any).__vnode;
  if (vnode?.component) {
    return vnode.component;
  }

  // Try parent elements
  let current = element.parentElement;
  while (current) {
    // Vue 2: Check parent for __vue__
    if ((current as any).__vue__) {
      return (current as any).__vue__;
    }

    // Vue 3: Check parent for Vue instance properties
    const currentKeys = Object.getOwnPropertyNames(current);
    for (const key of currentKeys) {
      if (key.startsWith("__vue")) {
        const value = (current as any)[key];
        if (value?.type || value?.component) {
          return value.component || value;
        }
      }
    }

    const parentVnode = (current as any).__vnode;
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

// Build component stack by walking up the parent chain
const buildComponentStack = (component: any): StackItem[] => {
  const stack: StackItem[] = [];
  let current = component;

  while (current) {
    const name = getComponentName(current);
    const fileName = getComponentFile(current);

    stack.push({
      componentName: name,
      fileName,
    });

    current = current.parent;
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
  return stack.filter(
    (item) =>
      item.fileName &&
      !item.fileName.includes("node_modules") &&
      item.componentName.length > 1 &&
      !item.fileName.startsWith("_"),
  );
};

export const serializeStack = (stack: StackItem[]) => {
  return stack
    .map((item, index) => {
      const fileName = item.fileName;
      const componentName = item.displayName || item.componentName;
      let result = `${componentName}${fileName ? ` (${fileName})` : ""}`;

      if (index === 0 && item.source) {
        result += `\n${item.source}`;
      }

      return result;
    })
    .join("\n");
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
