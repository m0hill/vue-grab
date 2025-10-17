import { getFiberFromHostInstance } from "bippy";
import { getFiberStackTrace, getOwnerStack } from "bippy/dist/source";

export interface StackItem {
  componentName: string;
  fileName: string | undefined;
}

export const getReactData = async (element: Element) => {
  const fiber = getFiberFromHostInstance(element);
  if (!fiber) return null;
  const stackTrace = getFiberStackTrace(fiber);
  const rawOwnerStack = await getOwnerStack(stackTrace);
  const stack: StackItem[] = rawOwnerStack
    .filter((item) => !item.source?.fileName.includes("node_modules"))
    .map((item) => ({
      componentName: item.name,
      fileName: item.source?.fileName,
    }));

  return {
    fiber,
    stack,
  };
};

export const init = () => {
  let metaKeyTimer: null | ReturnType<typeof setTimeout> = null;
  let overlay: HTMLDivElement | null = null;
  let isActive = false;
  let currentElement: Element | null = null;
  let animationFrame: null | number = null;

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
    const factor = 0.2;

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

    const elementToInspect = currentElement;
    hideOverlay();

    if (elementToInspect) {
      void getReactData(elementToInspect).then((data) => {
        console.log("React data:", data);
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
        console.log("Meta key held for 750ms");
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
      if (isActive) {
        hideOverlay();
      }
    }
  };

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mousedown", handleMouseDown, true);
  document.addEventListener("click", handleClick, true);

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
  };
};

init();
