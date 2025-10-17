import {
  filterStack,
  getHTMLSnippet,
  getStack,
  serializeStack,
} from "./core.js";

export const init = () => {
  let metaKeyTimer: null | ReturnType<typeof setTimeout> = null;
  let overlay: HTMLDivElement | null = null;
  let isActive = false;
  let isLocked = false; // Lock element selection after click
  let currentElement: Element | null = null;
  let animationFrame: null | number = null;
  let pendingCopyText: null | string = null;

  // Copy to clipboard with fallback for when document is not focused
  const copyToClipboard = async (text: string) => {
    // If document is not focused, store text and wait for focus
    if (!document.hasFocus()) {
      pendingCopyText = text;
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      pendingCopyText = null;
      // Hide overlay after successful copy
      hideOverlay();
    } catch {
      // Fallback for when clipboard API fails
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-999999px";
      textarea.style.top = "-999999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand("copy");
        pendingCopyText = null;
        // Hide overlay after successful copy
        hideOverlay();
      } catch (execErr) {
        console.error("Failed to copy to clipboard:", execErr);
        hideOverlay();
      }
      document.body.removeChild(textarea);
    }
  };

  // Handle window focus to copy pending text
  const handleWindowFocus = () => {
    if (pendingCopyText) {
      void copyToClipboard(pendingCopyText);
    }
  };

  // Lerp values for smooth animation
  let currentX = 0;
  let currentY = 0;
  let currentWidth = 0;
  let currentHeight = 0;
  let targetX = 0;
  let targetY = 0;
  let targetWidth = 0;
  let targetHeight = 0;
  let targetBorderRadius = "";

  const isInsideInputOrTextarea = () => {
    const activeElement = document.activeElement;
    return (
      activeElement instanceof HTMLInputElement ||
      activeElement instanceof HTMLTextAreaElement ||
      activeElement?.tagName === "INPUT" ||
      activeElement?.tagName === "TEXTAREA"
    );
  };

  const createOverlay = () => {
    const div = document.createElement("div");
    div.style.position = "fixed";
    div.style.border = "2px solid #3b82f6";
    div.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
    div.style.pointerEvents = "none";
    div.style.zIndex = "999999";
    div.style.transition = "none";
    document.body.appendChild(div);
    return div;
  };

  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  const updateOverlayPosition = () => {
    if (!overlay || !isActive) return;

    // Lerp factor (higher = faster, 0.2 is smooth)
    const factor = 0.5;

    currentX = lerp(currentX, targetX, factor);
    currentY = lerp(currentY, targetY, factor);
    currentWidth = lerp(currentWidth, targetWidth, factor);
    currentHeight = lerp(currentHeight, targetHeight, factor);

    overlay.style.left = `${currentX}px`;
    overlay.style.top = `${currentY}px`;
    overlay.style.width = `${currentWidth}px`;
    overlay.style.height = `${currentHeight}px`;
    overlay.style.borderRadius = targetBorderRadius;

    animationFrame = requestAnimationFrame(updateOverlayPosition);
  };

  const handleMouseMove = (e: MouseEvent) => {
    // Don't track mouse if element is locked after click
    if (isLocked) return;

    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (!element || element === overlay) return;

    currentElement = element;
    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);

    targetX = rect.left;
    targetY = rect.top;
    targetWidth = rect.width;
    targetHeight = rect.height;
    targetBorderRadius = computedStyle.borderRadius;
  };

  const handleClick = (e: MouseEvent) => {
    if (!isActive) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    // Lock the element selection, stop tracking mouse
    isLocked = true;

    const elementToInspect = currentElement;

    if (elementToInspect) {
      void getStack(elementToInspect).then((stack) => {
        if (!stack) {
          hideOverlay();
          return;
        }
        const serializedStack = serializeStack(filterStack(stack));
        const htmlSnippet = getHTMLSnippet(elementToInspect);
        const payload = `## Referenced element
${htmlSnippet}

Import traces:
${serializedStack}

Page: ${window.location.href}`;
        void copyToClipboard(payload);
      });
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (!isActive) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  };

  const showOverlay = () => {
    if (!overlay) {
      overlay = createOverlay();
    }
    isActive = true;
    overlay.style.display = "block";

    // Initialize lerp values
    currentX = targetX;
    currentY = targetY;
    currentWidth = targetWidth;
    currentHeight = targetHeight;

    updateOverlayPosition();
  };

  const hideOverlay = () => {
    isActive = false;
    isLocked = false;
    if (overlay) {
      overlay.style.display = "none";
    }
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
    currentElement = null;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.metaKey && !metaKeyTimer && !isActive) {
      metaKeyTimer = setTimeout(() => {
        if (!isInsideInputOrTextarea()) {
          showOverlay();
        }
        metaKeyTimer = null;
      }, 750);
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (!e.metaKey) {
      if (metaKeyTimer) {
        clearTimeout(metaKeyTimer);
        metaKeyTimer = null;
      }
      // Only hide if not locked (waiting for copy to complete)
      if (isActive && !isLocked) {
        hideOverlay();
      }
    }
  };

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mousedown", handleMouseDown, true);
  document.addEventListener("click", handleClick, true);
  window.addEventListener("focus", handleWindowFocus);

  return () => {
    if (metaKeyTimer) {
      clearTimeout(metaKeyTimer);
    }
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keyup", handleKeyUp);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mousedown", handleMouseDown, true);
    document.removeEventListener("click", handleClick, true);
    window.removeEventListener("focus", handleWindowFocus);
  };
};

init();
