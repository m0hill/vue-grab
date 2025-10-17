import { getFiberFromHostInstance } from "bippy";
import { getFiberStackTrace, getOwnerStack } from "bippy/dist/source";

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
    // Return the directory part of the path
    const lastSlash = paths[0].lastIndexOf("/");
    return lastSlash > 0 ? paths[0].substring(0, lastSlash + 1) : "";
  }

  // Find common prefix
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

  // Trim to last directory separator
  const lastSlash = commonPrefix.lastIndexOf("/");
  return lastSlash > 0 ? commonPrefix.substring(0, lastSlash + 1) : "";
};

export const serializeStack = (stack: StackItem[]) => {
  // Get all file paths
  const filePaths = stack
    .map((item) => item.fileName)
    .filter((path): path is string => !!path);

  // Find common root
  const commonRoot = findCommonRoot(filePaths);

  return stack
    .map((item) => {
      let fileName = item.fileName;
      // Strip common root from file path
      if (fileName && commonRoot) {
        fileName = fileName.startsWith(commonRoot)
          ? fileName.substring(commonRoot.length)
          : fileName;
      }
      return `${item.componentName}${fileName ? ` (${fileName})` : ""}`;
    })
    .join("\n");
};

export const getHTMLSnippet = (element: Element) => {
  const getElementTag = (el: Element) => {
    const tagName = el.tagName.toLowerCase();

    // Priority attributes to show
    const importantAttrs = [
      "id",
      "class",
      "name",
      "type",
      "role",
      "aria-label",
    ];
    const maxValueLength = 50;

    const attrs = Array.from(el.attributes)
      .filter((attr) => {
        // Show important attributes or data-* attributes
        return (
          importantAttrs.includes(attr.name) || attr.name.startsWith("data-")
        );
      })
      .map((attr) => {
        let value = attr.value;
        // Truncate long values
        if (value.length > maxValueLength) {
          value = value.substring(0, maxValueLength) + "...";
        }
        return `${attr.name}="${value}"`;
      })
      .join(" ");

    return attrs ? `<${tagName} ${attrs}>` : `<${tagName}>`;
  };

  const getClosingTag = (el: Element) => {
    return `</${el.tagName.toLowerCase()}>`;
  };

  const getChildrenCount = (el: Element) => {
    const children = Array.from(el.children);
    return children.length;
  };

  const getTextContent = (el: Element) => {
    // Get direct text content (not including nested elements)
    let text = "";
    const childNodes = Array.from(el.childNodes);
    for (const node of childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent || "";
      }
    }
    text = text.trim();

    // Truncate long text
    const maxLength = 100;
    if (text.length > maxLength) {
      text = text.substring(0, maxLength) + "...";
    }

    return text;
  };

  const lines: string[] = [];

  // Add parent context if it exists
  const parent = element.parentElement;
  if (parent) {
    lines.push(getElementTag(parent));

    // Show sibling count before target element
    const siblings = Array.from(parent.children);
    const targetIndex = siblings.indexOf(element);
    if (targetIndex > 0) {
      lines.push(
        `  ... (${targetIndex} element${targetIndex === 1 ? "" : "s"})`
      );
    }
  }

  // Add the target element with proper indentation
  const indent = parent ? "  " : "";
  lines.push(indent + "<!-- SELECTED -->");
  lines.push(indent + getElementTag(element));

  // Show text content and/or children count
  const textContent = getTextContent(element);
  const childrenCount = getChildrenCount(element);

  if (textContent) {
    lines.push(`${indent}  ${textContent}`);
  }

  if (childrenCount > 0) {
    lines.push(
      `${indent}  ... (${childrenCount} element${
        childrenCount === 1 ? "" : "s"
      })`
    );
  }

  lines.push(indent + getClosingTag(element));

  // Close parent if it exists
  if (parent) {
    // Show siblings after target element
    const siblings = Array.from(parent.children);
    const targetIndex = siblings.indexOf(element);
    const siblingsAfter = siblings.length - targetIndex - 1;
    if (siblingsAfter > 0) {
      lines.push(
        `  ... (${siblingsAfter} element${siblingsAfter === 1 ? "" : "s"})`
      );
    }
    lines.push(getClosingTag(parent));
  }

  return lines.join("\n");
};
