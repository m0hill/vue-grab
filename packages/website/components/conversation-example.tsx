import { ChatBubble } from './chat-bubble';

export const ConversationExample = () => (
  <div className="relative border border-[#202020] w-full max-w-sm h-44 p-4">
    <ChatBubble message="make the button bigger!" author="you" />
    <div className="mt-4">
      <ChatBubble message="Which one?" author="agent" />
    </div>
  </div>
);
