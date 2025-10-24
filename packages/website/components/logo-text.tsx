import { IconLogo } from './icon-logo';

interface LogoTextInterface {
  size?: 'sm' | 'lg' | 'base';
}

export const LogoText = ({ size = 'lg' }: LogoTextInterface) => {
  const isLarge = size === 'lg' || size === 'base';
  const isBase = size === 'base';

  return (
    <div className={`flex items-center ${isLarge ? 'gap-0.5' : 'gap-0'}`}>
      <IconLogo
        width={isLarge ? 20 : isBase ? 18 : 15}
        height={isLarge ? 20 : isBase ? 18 : 15}
        className="text-white"
      />
      <span
        className={`font-medium text-[#DDDDDD] ${isLarge ? 'text-lg' : isBase ? 'text-base' : 'text-[12.5px]'}`}
        style={{
          fontFamily: '"Enduro-Medium", "Enduro Medium", system-ui, sans-serif',
          lineHeight: '150%',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >
        React Grab
      </span>
    </div>
  );
};
