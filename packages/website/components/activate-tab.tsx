'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const ActivateTab = () => {
  const [isHolding, setIsHolding] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [isMac] = useState(() =>
    typeof navigator !== 'undefined'
      ? navigator.platform.toLowerCase().includes('mac')
      : true
  );

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'c') {
        event.preventDefault();
        if (!timeoutId) {
          setIsHolding(true);
          timeoutId = setTimeout(() => {
            setIsActivated(true);
          }, 500);
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!event.metaKey && !event.ctrlKey) {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        setIsHolding(false);
        setIsActivated(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
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
          animate={{ width: isHolding ? '100%' : '48%' }}
          transition={{
            duration: isHolding ? 0.5 : 0.2,
            ease: isHolding ? 'linear' : 'easeOut',
          }}
        />
        <div className="w-20" />
        <div className="w-20" />
      </div>

      <div className="absolute top-0 left-0 h-8 flex items-center">
        <AnimatePresence mode="wait">
          {isActivated ? (
            <motion.div
              key="grab"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="px-1.5 text-sm text-[#300417] whitespace-nowrap font-grotesk leading-normal"
            >
              Click to grab
            </motion.div>
          ) : (
            <motion.div
              key="activate"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              <div className="pl-2.5 pr-1.5 text-sm text-[#FF45A2] mix-blend-difference whitespace-nowrap font-grotesk leading-normal">
                Activate
              </div>
              <div className="pl-4 pr-1.5 text-sm text-[#FF45A2] opacity-75 whitespace-nowrap font-grotesk leading-normal">
                Hold&nbsp;{isMac ? '⌘' : 'Ctrl+'}C
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
