import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "👋 Hello! I'm **DevHelper AI**.\n\nI can review code, explain errors, generate README files, suggest project ideas and answer programming questions.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        loading,
        setLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);