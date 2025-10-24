interface IconClaudeInterface {
  width?: number;
  height?: number;
  className?: string;
}

export const IconClaude = ({ width = 10, height = 10, className = '' }: IconClaudeInterface) => (
  <svg
    width={width}
    height={height}
    className={className}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="2"
      y="2"
      width="12"
      height="12"
      rx="3"
      fill="currentColor"
    />
  </svg>
);
