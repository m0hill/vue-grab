import Image from 'next/image';

interface IconLogoInterface {
  width?: number;
  height?: number;
  className?: string;
}

export const IconLogo = ({ width = 20, height = 20, className = '' }: IconLogoInterface) => (
  <Image
    src="/logo.svg"
    alt="React Grab"
    width={width}
    height={height}
    className={className}
  />
);
