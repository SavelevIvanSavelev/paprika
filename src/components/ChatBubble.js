import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function ChatBubble({ text, isUser, isAssistant }) {
    return (_jsxs("div", { className: `chat-bubble ${isUser ? "user" : "assistant"}`, children: [isAssistant && _jsx("span", { className: "assistant-label", children: "AH assistent" }), _jsx("span", { children: text })] }));
}
