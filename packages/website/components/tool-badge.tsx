import { ReactNode } from 'react';

interface ToolBadgeInterface {
  icon: ReactNode;
  label: string;
  gap?: string;
}

export const ToolBadge = ({ icon, label, gap = 'gap-1' }: ToolBadgeInterface) => (
  <div className={`flex items-center ${gap}`}>
    {icon}
    <span
      className="text-[13px] text-[#ECECEC]"
      style={{
        fontFamily: '"TestDie-Grotesk-VF", "Test Die Grotesk VF", system-ui, sans-serif',
        lineHeight: '150%',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      }}
    >
      {label}
    </span>
  </div>
);
