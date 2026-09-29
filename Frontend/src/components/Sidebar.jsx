import { AnimatePresence, motion } from "framer-motion";
import { Archive, Edit, EllipsisVertical, Plus, Settings, SquarePen, Trash2, User } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { v1 as uuid } from "uuid";
import blackLogo from "../assets/blacklogo.png";
import { AuthContext } from "../context/AuthContext";
import { GPTContext } from "../context/GPT.Context";
import Auth from "./Auth";
import SettingModal from "./SettingModal";
import UserModal from "./UserModal";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const { token, user, logout } = useContext(AuthContext);
    const [showAuth, setShowAuth] = useState(false);
    const {
        allThreads, setAllThreads,
        currThread, setCurrThread,
        setNewChats,
        setReply, setPrompts,
        setMessages
    } = useContext(GPTContext);

    const [isDarkMode, setIsDarkMode] = useState(
        () => localStorage.getItem("theme") === "dark"
    );
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(null);
    const [threadFetchPending, setThreadFetchPending] = useState(false);
    const menuRef = useRef(null);
    const baseApiUrl = import.meta.env.DEV ? "" : "https://sourabhgpt.onrender.com";

    const normalizeToken = (jwt) => {
        if (typeof jwt !== "string") return null;
        const trimmed = jwt.trim();
        if (
            trimmed === "" ||
            trimmed === "undefined" ||
            trimmed === "null" ||
            trimmed.split(".").length !== 3
        ) {
            return null;
        }
        return trimmed;
    };

    const getAllThreads = async (retry = 0) => {
        const normalized = normalizeToken(token);
        if (!normalized) {
            console.warn("Skipping getAllThreads because token is missing or invalid", token);
            if (token) logout();
            return;
        }

        setThreadFetchPending(true);
        try {
            const apiUrl = `${baseApiUrl}/api/thread`;
            console.debug("Fetching threads", { apiUrl, token: normalized?.slice(0, 20), retry });
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${normalized}`,
                    "Content-Type": "application/json",
                },
            });

            const body = await response.json().catch(() => null);
            if (!response.ok) {
                console.warn("getAllThreads failed", { status: response.status, body, retry });
                if (response.status === 401 && retry === 0) {
                    setTimeout(() => getAllThreads(1), 300);
                    return;
                }
                if (response.status === 401) {
                    logout();
                    alert(body?.message || "Session expired. Please login again.");
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const filteredData = Array.isArray(body)
                ? body.map((t) => ({
                    threadId: t.threadId || t._id,
                    title: t.title || "Untitled Chat",
                }))
                : [];
            setAllThreads(filteredData);
        } catch (err) {
            console.error("Error fetching threads:", err);
            setAllThreads([]);
        } finally {
            setThreadFetchPending(false);
        }
    };

    const deleteThread = async (threadId) => {
        const normalized = normalizeToken(token);
        if (!normalized) {
            console.warn("Skipping deleteThread because token is missing or invalid", token);
            return;
        }

        try {
            const apiUrl = `${baseApiUrl}/api/thread`;
            const response = await fetch(`${apiUrl}/${threadId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${normalized}`,
                },
            });

            if (!response.ok) throw new Error("Failed to delete thread");

            setAllThreads((prev) => prev.filter((t) => t.threadId !== threadId));

            if (currThread === threadId) {
                setCurrThread(null);
                setMessages([]);
                setReply(null);
                setPrompts("");
            }
        } catch (e) {
            console.error("Delete thread error:", e);
        }
    };

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDarkMode]);

    useEffect(() => {
        if (token && user) {
            const timer = setTimeout(() => {
                getAllThreads();
            }, 500);
            return () => clearTimeout(timer);
        }

        setAllThreads([]);
        setCurrThread(null);
        setMessages([]);
        setReply(null);
        setPrompts("");
    }, [token, user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNewChat = () => {
        setReply(null);
        setPrompts("");
        const newThreadId = uuid();
        setCurrThread(newThreadId);
        setNewChats(true);
        setMessages([{ role: "system", content: "Welcome to sourabhGPT! Ask me anything." }]);
        getAllThreads();
    };

    const changeThread = async (newThreadId) => {
        const normalized = normalizeToken(token);
        if (!normalized) {
            console.warn("Skipping changeThread because token is missing or invalid", token);
            return;
        }

        setCurrThread(newThreadId);
        try {
            const apiUrl = `${baseApiUrl}/api/thread/${newThreadId}`;
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${normalized}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const res = await response.json();
            setMessages(res.message);
            setReply(res.reply);
            setPrompts(res.title);
            setNewChats(false);
            if (window.innerWidth < 640) setSidebarOpen(false);
        } catch (err) {
            console.error("Thread fetch error:", err);
        }
    };


    const drop = (threadId) => [
        { icon: Edit, label: "Rename Chat", onClick: () => alert("Rename clicked") },
        { icon: Archive, label: "Archive Chat", onClick: () => alert("Archive clicked") },
        { icon: Trash2, label: "Delete Chat", onClick: () => deleteThread(threadId) },
    ];

    return (
        <>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 sm:hidden z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}


            <div
                className={`
        fixed top-0 left-0 h-full w-72 bg-[#f4f4f4] dark:bg-[#202123]
        text-black dark:text-white flex flex-col justify-between border-r 
        border-gray-300 dark:border-gray-700 transform transition-transform duration-300 ease-in-out z-50
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        sm:static sm:translate-x-0 sm:flex
        `}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
                    <div className="flex items-center h-[2.5rem] w-[2.5rem] rounded-md cursor-pointer justify-center hover:bg-gray-200 dark:hover:bg-[#40414f]">
                        <img className="h-[1.5rem] w-[1.5rem] object-cover rounded-full bg-white" src={blackLogo} alt="gpt_img" />
                    </div>
                    <div className="flex items-center gap-2">

                        <div className="h-[2.5rem] w-[2.5rem] rounded-md flex items-center justify-center cursor-pointer transition-colors hover:bg-gray-200 dark:hover:bg-[#40414f]">
                            <SquarePen size={20} />
                        </div>
                    </div>
                </div>
                <div onClick={handleNewChat} className="p-4 border-b border-gray-300 dark:border-gray-700">
                    <button
                        className="flex items-center gap-3 w-full bg-gray-100 dark:bg-[#343541] hover:bg-gray-200 dark:hover:bg-[#40414f] py-3 px-4 rounded-lg transition-colors"
                    >
                        <Plus size={18} />
                        <span>New Chat</span>
                    </button>
                </div>


                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-hide">
                    <div className="uppercase text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                        Chats
                    </div>
                    {allThreads?.map((thread) => (
                        <div
                            key={thread.threadId}
                            onClick={() => changeThread(thread.threadId)}
                            className="group flex items-center justify-between text-sm px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-[#2a2b32]"
                        >
                            <span className="truncate text-gray-800 dark:text-gray-200">
                                {thread.title || "Untitled Chat"}
                            </span>

                            {/* Menu */}
                            <div className="relative" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => setOpenMenu(openMenu === thread.threadId ? null : thread.threadId)}
                                    className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-800"
                                >
                                    <EllipsisVertical size={18} className="text-gray-600 dark:text-gray-300" />
                                </button>
                                <AnimatePresence>
                                    {openMenu === thread.threadId && (
                                        <motion.div
                                            ref={menuRef}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border shadow-lg rounded-md z-[9999]"
                                        >
                                            <div className="py-1">
                                                {drop(thread.threadId).map((item, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenMenu(null);
                                                            item.onClick();
                                                        }}
                                                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-800"
                                                    >
                                                        <item.icon size={16} />
                                                        {item.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 space-y-2 border-t border-gray-300 dark:border-gray-700">
                    <button onClick={() => setSettingsOpen(true)} className="flex items-center gap-3 text-sm w-full px-3 py-2 hover:bg-gray-200 dark:hover:bg-[#2a2b32] rounded-md">
                        <Settings size={18} />
                        Settings
                    </button>
                    <SettingModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
                    <button
                        onClick={() => {
                            if (user) {
                                setUserOpen(true); // Open UserModal if logged in
                            } else {
                                setShowAuth(true); // Open Auth/Login form if not logged in
                            }
                        }}
                        className="flex items-center gap-3 text-sm w-full px-3 py-2 hover:bg-gray-200 dark:hover:bg-[#2a2b32] rounded-md"
                    >
                        <User size={18} />
                        {user ? user.username : "Login"}
                    </button>
                    <Auth isOpen={showAuth} onClose={() => setShowAuth(false)} />

                    <UserModal open={userOpen} onClose={() => setUserOpen(false)} />
                    <div className="flex flex-col items-center text-center px-2 mt-2">
                        <p className="text-[0.7rem] text-gray-400 dark:text-gray-500">
                            Made with ❤️ by <span className="font-semibold"><a href="https://sourabhnegi.app">Sourabh</a></span>
                        </p>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Sidebar;




