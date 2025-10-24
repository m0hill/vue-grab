interface ChatBubbleInterface {
  message: string;
  author: 'you' | 'agent';
}

export const ChatBubble = ({ message, author }: ChatBubbleInterface) => (
  <div className="flex flex-col">
    <div
      className="text-[11px] text-[#9D9D9D] mb-1"
      style={{
        fontFamily: '"TestDie-Grotesk-VF", "Test Die Grotesk VF", system-ui, sans-serif',
        lineHeight: '171%',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      }}
    >
      {author === 'you' ? 'You' : 'Agent'}
    </div>
    <div className="bg-[#181818] px-[9px] py-1 w-fit">
      <div
        className="text-xs text-[#C6C6C6]"
        style={{
          fontFamily: '"TestDie-Grotesk-VF", "Test Die Grotesk VF", system-ui, sans-serif',
          lineHeight: '171%',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >
        {message}
      </div>
    </div>
  </div>
);
