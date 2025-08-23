// src/components/ThemeToggle.jsx
import { useTheme } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react"; // or use your own icons

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
        >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
};

export default ThemeToggle;
