import { useState, useRef, useEffect, useContext } from "react";
import { v1 as uuid } from "uuid";
import ReactMarkDown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { AuthContext } from "../context/AuthContext";
import UserModal from "./UserModal";
import "katex/dist/katex.min.css";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import Sidebar from "./Sidebar"; // ✅ Your existing sidebar

import {
  Send,
  User,
  ArrowUpCircle,
  ChevronDown,
  Facebook,
  Twitter,
  Linkedin,
  Link,
} from "lucide-react";

import ThemeToggle from "./ThemeToggle";
import ShareButton from "./ShareButton";
import { HashLoader } from "react-spinners";
import GPT from "./GPT";
import { GPTContext } from "../context/GPT.Context";
import Auth from "./Auth";

const ChatWindow = () => {
  const { token, user } = useContext(AuthContext);
  const [userOpen, setUserOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { messages, setMessages, currThread, setCurrThread, text, setText } = useContext(GPTContext);

  const [loader, setLoader] = useState(false);
  const [input, setInput] = useState("");
  const [showAuth, setShowAuth] = useState(false);

  const chatEndRef = useRef(null);
  const currentUrl = window.location.href;

  const shareLinks = [
    {
      icon: Twitter,
      onClick: () =>
        window.open(`https://twitter.com/share?url=${currentUrl}`, "_blank"),
      label: "Share on Twitter",
    },
    {
      icon: Facebook,
      onClick: () =>
        window.open(
          `https://facebook.com/sharer/sharer.php?u=${currentUrl}`,
          "_blank"
        ),
      label: "Share on Facebook",
    },
    {
      icon: Linkedin,
      onClick: () =>
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`,
          "_blank"
        ),
      label: "Share on LinkedIn",
    },
    {
      icon: Link,
      onClick: () => {
        navigator.clipboard.writeText(currentUrl);
        alert("Link copied to clipboard!");
      },
      label: "Copy link",
    },
  ];

  const GPTs = [{ label: "Upgrade to plus", icon: ArrowUpCircle }];

  const getReply = async () => {
    if (!input.trim()) return;
    setLoader(true);

    const userMessage = { role: "user", content: String(input).trim() };
    setMessages((prev) => [...prev, userMessage]);

    const threadId = currThread || uuid();
    setCurrThread(threadId);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: input.trim(),
          threadId: threadId,
        }),
      });

      const data = await response.json().catch(() => ({}));
      let safeReply =
        typeof data.reply === "string" ? data.reply.trim() : "[No response]";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      let words = safeReply.split(/\s+/).filter(Boolean);
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i >= words.length) {
          clearInterval(typingInterval);
          return;
        }

        setMessages((prev) => {
          const lastMsg =
            prev[prev.length - 1] || { role: "assistant", content: "" };
          const lastContent =
            typeof lastMsg.content === "string" ? lastMsg.content : "";
          const token = words[i] ?? "";
          const updatedLastMsg = {
            ...lastMsg,
            content: lastContent.length ? lastContent + " " + token : token,
          };
          return [...prev.slice(0, -1), updatedLastMsg];
        });

        i++;
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 80);

      setInput("");
    } catch (err) {
      console.error("Error fetching reply:", err);
    } finally {
      setLoader(false);
    }
  };


  const handleKeyDown = (e) => {
    if (user && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      getReply();
    }
  };



  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarOpen && !e.target.closest('.sidebar-content') && !e.target.closest('.hamburger-btn')) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  return (
    <div className="flex w-full flex-col h-screen bg-white text-black dark:bg-[#212121] dark:text-white transition-colors duration-300">

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">

          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />


          <div className="sidebar-content absolute inset-y-0 left-0 w-80 max-w-[85vw] transform transition-transform duration-300 ease-in-out">
            {/* ✅ This is where YOUR Sidebar component goes */}
            <Sidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          </div>
        </div>
      )}


      <nav className="h-16 px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-[#212121]/80 backdrop-blur-md sticky top-0 z-40">
        {/* Left Side */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger */}
          <button
            className="hamburger-btn md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <div className="w-5 h-[2px] bg-current mb-1 transition-transform"></div>
            <div className="w-5 h-[2px] bg-current mb-1 transition-transform"></div>
            <div className="w-5 h-[2px] bg-current transition-transform"></div>
          </button>

          {/* Logo */}
          <div className="font-bold flex items-center text-lg">
            SourabhGPT
            <GPT className="bg-transparent" links={GPTs}><ChevronDown className="dark:text-white" /></GPT>
          </div>
        </div>

        {/* Right Side - Desktop Only */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />

          <button className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <ArrowUpCircle size={16} />
            Upgrade
          </button>


          <ShareButton links={shareLinks} className="text-sm dark:bg-black dark:text-white font-semibold">
            <Link size={16} />
          </ShareButton>
        </div>

        <UserModal open={userOpen} onClose={() => setUserOpen(false)} />
      </nav>

      {/* Main Chat Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-16 xl:px-24 py-4 space-y-4 scrollbar-hide">
          {!user ? (
            <div className="flex flex-col h-full items-center justify-center gap-6 text-center">
              <div className="space-y-3">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome to SourabhGPT
                </h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                  Login or create an account to start chatting with your AI assistant
                </p>
              </div>

              <button
                onClick={() => setShowAuth(!showAuth)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                {showAuth ? "Close" : "Get Started"}
              </button>

              <Auth isOpen={showAuth} onClose={() => setShowAuth(false)} />
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                    } animate-fadeIn`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[75%] lg:max-w-[65%] px-4 py-3 rounded-2xl shadow-sm ${msg.role === "system"
                        ? "mx-auto text-center text-gray-500 dark:text-gray-400 bg-transparent"
                        : msg.role === "user"
                          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                          : "bg-gray-100 dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100"
                      }`}
                  >
                    <ReactMarkDown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        code({ inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={oneDark}
                              language={match[1]}
                              PreTag="div"
                              customStyle={{
                                borderRadius: "0.5rem",
                                padding: "1rem",
                                margin: "0.5rem 0",
                                background: "#1e1e1e",
                                fontSize: "0.9rem",
                              }}
                              {...props}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          ) : (
                            <code className="bg-gray-200 dark:bg-gray-700 rounded px-1.5 py-0.5 text-sm font-mono">
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {msg.content}
                    </ReactMarkDown>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </>
          )}
        </div>

        {/* Loader */}
        {loader && (
          <div className="flex justify-center items-center py-4">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800">
              <HashLoader color="#3b82f6" size={20} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Thinking...
              </span>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="sticky bottom-0 bg-white/95 dark:bg-[#212121]/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3 bg-gray-100 dark:bg-[#2a2a2a] rounded-2xl p-3 shadow-sm">
              <textarea
                placeholder={user ? "Type your message..." : "Please login to chat"}
                className="flex-1 bg-transparent resize-none outline-none placeholder-gray-500 dark:placeholder-gray-400 disabled:cursor-not-allowed text-[15px] leading-relaxed max-h-32"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!user}
                rows={1}
                style={{
                  height: 'auto',
                  minHeight: '24px',
                }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
              />

              <button
                onClick={getReply}
                disabled={!user || !input.trim()}
                className={`flex-shrink-0 p-2 rounded-xl transition-all duration-200 ${!user || !input.trim()
                    ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed opacity-50"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:scale-105"
                  }`}
              >
                <Send size={18} />
              </button>
            </div>

            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3">
              SourabhGPT may produce inaccurate information. Verify important details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
