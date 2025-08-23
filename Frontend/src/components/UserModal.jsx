import React , {useContext} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, LogOut } from "lucide-react";
import { AuthContext } from '../context/AuthContext';


const UserModal = ({ open, onClose }) => {
    const {
        logout , user
    } = useContext(AuthContext);


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
                        onClick={onClose} // ✅ close when clicking outside
                    />

                    {/* Modal Box */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="relative z-10 w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-lg"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                User Menu
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-800"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Options */}
                        <div className="space-y-3">
                            <li
                                className="flex w-full items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-800 dark:text-gray-100 "
                            >
                                {user.username}
                            </li>

                            <li
                                className="flex w-full items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-800 dark:text-gray-100 "
                            >
                                {user.email}
                            </li>

                            <button
                                onClick={() => {
                                    logout();
                                    onClose();
                                }}
                                className="flex w-full items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-800"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default UserModal;
