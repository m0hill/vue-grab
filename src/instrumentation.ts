import { _fiberRoots, getFiberFromHostInstance, instrument } from "bippy";
import { getFiberStackTrace, getOwnerStack } from "bippy/dist/source";

export const fiberRoots = _fiberRoots;

instrument({
  onCommitFiberRoot(_, fiberRoot) {
    fiberRoots.add(fiberRoot);
  },
});

export interface StackItem {
  componentName: string;
  fileName: string | undefined;
}

export const getStack = async (element: Element) => {
  const fiber = getFiberFromHostInstance(element);
  if (!fiber) return null;
  const stackTrace = getFiberStackTrace(fiber);
  const rawOwnerStack = await getOwnerStack(stackTrace);
  const stack: StackItem[] = rawOwnerStack.map((item) => ({
    componentName: item.name,
    fileName: item.source?.fileName,
  }));

  return stack;
};

export const filterStack = (stack: StackItem[]) => {
  return stack.filter(
    (item) =>
      item.fileName &&
      !item.fileName.includes("node_modules") &&
      item.componentName.length > 1 &&
      !item.fileName.startsWith("_")
  );
};

const findCommonRoot = (paths: string[]): string => {
  if (paths.length === 0) return "";
  if (paths.length === 1) {
    const lastSlash = paths[0].lastIndexOf("/");
    return lastSlash > 0 ? paths[0].substring(0, lastSlash + 1) : "";
  }

  let commonPrefix = paths[0];
  for (let i = 1; i < paths.length; i++) {
    const path = paths[i];
    let j = 0;
    while (
      j < commonPrefix.length &&
      j < path.length &&
      commonPrefix[j] === path[j]
    ) {
      j++;
    }
    commonPrefix = commonPrefix.substring(0, j);
  }

  const lastSlash = commonPrefix.lastIndexOf("/");
  return lastSlash > 0 ? commonPrefix.substring(0, lastSlash + 1) : "";
};

export const serializeStack = (stack: StackItem[]) => {
  const filePaths = stack
    .map((item) => item.fileName)
    .filter((path): path is string => !!path);

  const commonRoot = findCommonRoot(filePaths);

  return stack
    .map((item, index) => {
      let fileName = item.fileName;
      if (fileName && commonRoot) {
        fileName = fileName.startsWith(commonRoot)
          ? fileName.substring(commonRoot.length)
          : fileName;
      }

      const indent = "  ".repeat(index);
      const marker = index === stack.length - 1 ? " <--" : "";

      return `${indent}${item.componentName}${fileName ? ` (${fileName})` : ""}${marker}`;
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
      attr.name.startsWith("data-")
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
      const classes = el.className.trim().split(/\s+/);
      if (classes.length > 0 && classes[0]) {
        const displayClasses = compact ? classes.slice(0, 3) : classes;
        let classStr = displayClasses.join(" ");
        if (classStr.length > 30) {
          classStr = classStr.substring(0, 30) + "...";
        }
        attrs.push(`class="${classStr}"`);
      }
    }

    const dataAttrs = Array.from(el.attributes).filter((attr) =>
      attr.name.startsWith("data-")
    );
    const displayDataAttrs = compact ? dataAttrs.slice(0, 1) : dataAttrs;
    for (const attr of displayDataAttrs) {
      let value = attr.value;
      if (value.length > 20) {
        value = value.substring(0, 20) + "...";
      }
      attrs.push(`${attr.name}="${value}"`);
    }

    const ariaLabel = el.getAttribute("aria-label");
    if (ariaLabel && !compact) {
      let value = ariaLabel;
      if (value.length > 20) {
        value = value.substring(0, 20) + "...";
      }
      attrs.push(`aria-label="${value}"`);
    }

    return attrs.length > 0
      ? `<${tagName} ${attrs.join(" ")}>`
      : `<${tagName}>`;
  };

  const getClosingTag = (el: Element) => {
    return `</${el.tagName.toLowerCase()}>`;
  };

  const getTextContent = (el: Element) => {
    let text = el.textContent || "";
    text = text.trim().replace(/\s+/g, " ");
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

  lines.push(getCSSPath(element));
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
      if (prevId && targetIndex <= 2) {
        const indent = "  ".repeat(ancestors.length);
        lines.push(`${indent}  ${getElementTag(prevSibling, true)}`);
        lines.push(`${indent}  </${prevSibling.tagName.toLowerCase()}>`);
      } else if (targetIndex > 0) {
        const indent = "  ".repeat(ancestors.length);
        lines.push(
          `${indent}  ... (${targetIndex} preceding sibling${
            targetIndex === 1 ? "" : "s"
          })`
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
        element
      )}`
    );
  } else {
    lines.push(indent + "  " + getElementTag(element));
    if (textContent) {
      lines.push(`${indent}    ${textContent}`);
    }
    if (childrenCount > 0) {
      lines.push(
        `${indent}    ... (${childrenCount} child element${
          childrenCount === 1 ? "" : "s"
        })`
      );
    }
    lines.push(indent + "  " + getClosingTag(element));
  }

  if (parent && targetIndex >= 0) {
    const siblings = Array.from(parent.children);
    const siblingsAfter = siblings.length - targetIndex - 1;
    if (siblingsAfter > 0) {
      const nextSibling = siblings[targetIndex + 1];
      const nextId = getSiblingIdentifier(nextSibling);
      if (nextId && siblingsAfter <= 2) {
        lines.push(`${indent}  ${getElementTag(nextSibling, true)}`);
        lines.push(`${indent}  </${nextSibling.tagName.toLowerCase()}>`);
      } else {
        lines.push(
          `${indent}  ... (${siblingsAfter} following sibling${
            siblingsAfter === 1 ? "" : "s"
          })`
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
