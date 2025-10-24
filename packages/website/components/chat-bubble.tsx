interface ChatBubbleInterface {
  message: string;
  author: 'you' | 'agent';
}

export const ChatBubble = ({ message, author }: ChatBubbleInterface) => (
  <div className="flex flex-col">
    <div className="text-xs text-[#9D9D9D] mb-1 font-grotesk leading-relaxed">
      {author === 'you' ? 'You' : 'Agent'}
    </div>
    <div className="bg-[#181818] px-2 py-1 w-fit">
      <div className="text-xs text-[#C6C6C6] font-grotesk leading-relaxed">
        {message}
      </div>
    </div>
  </div>
);
