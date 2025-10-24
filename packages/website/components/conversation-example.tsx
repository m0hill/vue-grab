import { ChatBubble } from './chat-bubble';

export const ConversationExample = () => (
  <div className="relative border border-[#202020] w-full max-w-[294px] h-[166px] p-4">
    <ChatBubble message="make the button bigger!" author="you" />
    <div className="mt-4">
      <ChatBubble message="Which one?" author="agent" />
    </div>
  </div>
);
