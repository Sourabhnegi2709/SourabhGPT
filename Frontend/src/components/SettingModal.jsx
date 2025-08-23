import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const SettingModal = ({ open, onClose }) => {
    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Background Blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={onClose} // close when clicking outside
                    />

                    {/* Modal Box */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="relative z-10 w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-lg"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                Settings
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-800"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Settings Options */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    Change Theme
                                </span>
                                <ThemeToggle />
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    Notifications
                                </span>
                                <input type="checkbox" className="toggle" />
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    Auto-Save Chats
                                </span>
                                <input type="checkbox" className="toggle" />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Save
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SettingModal;
