// App.jsx
import React, { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import Sidebar from "./components/Sidebar";
import { GPTContext } from "./context/GPT.Context";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const [prompts, setPrompts] = useState("");
  const [reply, setReply] = useState(null);
  const [currThread, setCurrThread] = useState(null);
  const [allThreads, setAllThreads] = useState([]);
  const [preChats, setPreChats] = useState([]);
  const [newChats, setNewChats] = useState(true);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("Welcome to SourabhGPT! Ask me anything.");

  const providerValue = {
    prompts,
    setPrompts,
    reply,
    setReply,
    currThread,
    setCurrThread,
    allThreads,
    setAllThreads,
    preChats,
    setPreChats,
    newChats,
    setNewChats,
    messages,
    setMessages,
    text,
    setText,
  };

  return (
    <AuthProvider>
      <GPTContext.Provider value={providerValue}>
        <ThemeProvider>
          <div className="app-container flex h-screen bg-gray-100 dark:bg-gray-900 relative">
            <Sidebar />
            <ChatWindow /> {/* 👈 ChatWindow itself will decide what to render */}
          </div>
        </ThemeProvider>
      </GPTContext.Provider>
    </AuthProvider>
  );
}

export default App;
