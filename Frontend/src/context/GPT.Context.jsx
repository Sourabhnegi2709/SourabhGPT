import React, { createContext, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const GPTContext = createContext();

export const GPTProvider = ({ children }) => {
  const [prompts, setPrompts] = useState("");
  const [reply, setReply] = useState(null);
  const [currThread, setCurrThread] = useState(null);
  const [allThreads, setAllThreads] = useState([]);
  const [preChats, setPreChats] = useState([]);
  const [newChats, setNewChats] = useState(true);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("Welcome to SourabhGPT! Ask me anything.");

  const value = {
    prompts, setPrompts,
    reply, setReply,
    currThread, setCurrThread,
    allThreads, setAllThreads,
    preChats, setPreChats,
    newChats, setNewChats,
    messages, setMessages,
    text, setText,
  };

  return (
    <GPTContext.Provider value={value}>
      {children}
    </GPTContext.Provider>
  );
};

