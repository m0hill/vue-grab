interface IconCursorInterface {
  width?: number;
  height?: number;
  className?: string;
}

export const IconCursor = ({ width = 10, height = 10, className = '' }: IconCursorInterface) => (
  <svg
    width={width}
    height={height}
    className={className}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 2L2 14L6 10L9 14L11 13L8 9L14 9L2 2Z"
      fill="currentColor"
    />
  </svg>
);
