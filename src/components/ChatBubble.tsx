type ChatBubbleProps = {
  text: string;
  isUser: boolean;
  isAssistant: boolean;
};

export default function ChatBubble({ text, isUser, isAssistant }: ChatBubbleProps) {
  return (
    <div className={`chat-bubble ${isUser ? "user" : "assistant"}`}>
      {isAssistant && <span className="assistant-label">AH assistent</span>}
      <span>{text}</span>
    </div>
  );
}
