import { IconLogo } from './icon-logo';

interface LogoTextInterface {
  size?: 'sm' | 'lg' | 'base';
}

export const LogoText = ({ size = 'lg' }: LogoTextInterface) => {
  const sizeClasses = {
    lg: { iconSize: 20, textSize: 'text-lg', gap: 'gap-0.5' },
    base: { iconSize: 20, textSize: 'text-base', gap: 'gap-0.5' },
    sm: { iconSize: 16, textSize: 'text-sm', gap: 'gap-0' },
  };

  const config = sizeClasses[size];

  return (
    <div className={`flex items-center ${config.gap}`}>
      <IconLogo
        width={config.iconSize}
        height={config.iconSize}
        className="text-white"
      />
      <span className={`font-medium text-[#DDDDDD] ${config.textSize} leading-normal font-enduro`}>
        React Grab
      </span>
    </div>
  );
};
