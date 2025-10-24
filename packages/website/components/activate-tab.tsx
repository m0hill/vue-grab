export const ActivateTab = () => (
  <div className="relative w-fit">
    <div className="flex items-center h-8 border border-[#003D48] bg-[#57C4DC0F]">
      <div className="h-full w-[75px] bg-linear-to-b from-[#9BF1FF] to-[#9BF1FF]" />
      <div className="flex-1 w-[98px]" />
    </div>

    <div className="absolute top-0 left-0 h-8 flex items-center">
      <div
        className="px-2 text-[13px] text-[#9BF1FF] mix-blend-difference whitespace-nowrap"
        style={{
          fontFamily: '"TestDie-Grotesk-VF", "Test Die Grotesk VF", system-ui, sans-serif',
          lineHeight: '150%',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >
        Activate
      </div>
      <div
        className="px-2 text-[13px] text-[#9BF1FF] opacity-75 whitespace-nowrap"
        style={{
          fontFamily: '"TestDie-Grotesk-VF", "Test Die Grotesk VF", system-ui, sans-serif',
          lineHeight: '150%',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >
        Hold ⌘C
      </div>
    </div>
  </div>
);
