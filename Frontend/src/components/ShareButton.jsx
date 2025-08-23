import React, { useState, useRef , useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../utils/Button.jsx"; // Or replace with <button> if not using a custom Button

const ShareButton = ({ links, children, className }) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false); // ✅ fix here
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block text-left">
            <Button
                onClick={() => setOpen(!open)}
                className={`gap-1 ${className}`}
            >
                {children}
            </Button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        ref={menuRef}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md border bg-white shadow-lg dark:bg-zinc-900 dark:border-zinc-700"
                    >
                        <div className="py-1">
                            {links.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setOpen(false); // ✅ closes menu when clicked
                                        item.onClick();
                                    }}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-zinc-800 transition-colors"
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
    );
};

export default ShareButton;
