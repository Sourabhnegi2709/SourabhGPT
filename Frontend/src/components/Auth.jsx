// components/Auth.jsx
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Auth = ({ isOpen, onClose }) => {
    const { login } = useContext(AuthContext);
    const [isSignup, setIsSignup] = useState(false);
    const [form, setForm] = useState({ username: "", email: "", password: "" });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isSignup ? "signup" : "login";

        const res = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        if (!res.ok) {
            alert(data.error || "Auth failed");
            return;
        }

        login(data.user, data.token);
        onClose(); // ✅ close modal after success
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Modal Card */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 50 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-96 relative"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold mb-4 text-center">
                            {isSignup ? "Create Account" : "Login"}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            {isSignup && (
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={form.username}
                                    onChange={(e) =>
                                        setForm({ ...form, username: e.target.value })
                                    }
                                    className="w-full mb-3 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                    required
                                />
                            )}

                            <input
                                type="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                                className="w-full mb-3 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                required
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({ ...form, password: e.target.value })
                                }
                                className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                required
                            />

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                {isSignup ? "Sign Up" : "Login"}
                            </button>
                        </form>

                        <p
                            className="text-sm text-center mt-4 cursor-pointer text-blue-500"
                            onClick={() => setIsSignup(!isSignup)}
                        >
                            {isSignup
                                ? "Already have an account? Login"
                                : "No account? Sign up"}
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Auth;
