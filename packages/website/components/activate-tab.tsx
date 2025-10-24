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
      <div className="flex items-center h-8 overflow-hidden border border-[#300417] bg-[#FF45A20F] w-40">
        <motion.div
          className="absolute inset-0 bg-[#FF45A2]"
          initial={{ width: '48%' }}
          animate={{ width: isCmdCPressed ? '100%' : '48%' }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
          }}
        />
        <div className="w-20" />
        <div className="w-20" />
      </div>

      <div className="absolute top-0 left-0 h-8 flex items-center">
        <div className="px-1.5 text-sm text-[#FF45A2] mix-blend-difference whitespace-nowrap font-grotesk leading-normal">
          Activate
        </div>
        <div className="px-1.5 text-sm text-[#FF45A2] opacity-75 whitespace-nowrap font-grotesk leading-normal">
          Hold&nbsp;⌘C
        </div>
      </div>
    </div>
  );
};
