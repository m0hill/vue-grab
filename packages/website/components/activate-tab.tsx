'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const ActivateTab = () => {
  const [isCmdCPressed, setIsCmdCPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'c') {
        event.preventDefault();
        setIsCmdCPressed(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!event.metaKey && !event.ctrlKey) {
        setIsCmdCPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="relative w-fit">
      <div className="flex items-center h-8 border border-[#003D48] bg-[#57C4DC0F] overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-linear-to-b from-[#9BF1FF] to-[#9BF1FF]"
          initial={{ width: 75 }}
          animate={{ width: isCmdCPressed ? '100%' : 75 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
          }}
        />
        <div className="w-[75px]" />
        <div className="w-[98px]" />
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
          Hold&nbsp;⌘C
        </div>
      </div>
    </div>
  );
};
