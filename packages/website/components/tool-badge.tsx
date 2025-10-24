import { ReactNode } from 'react';

interface ToolBadgeInterface {
  icon: ReactNode;
  label: string;
  gap?: string;
}

export const ToolBadge = ({ icon, label, gap = 'gap-1' }: ToolBadgeInterface) => (
  <div className={`flex items-center ${gap}`}>
    {icon}
    <span className="text-base text-[#ECECEC] font-grotesk leading-normal">
      {label}
    </span>
  </div>
);
