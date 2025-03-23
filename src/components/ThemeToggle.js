import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
        >
            <i className={`fa-solid ${isDark ? "fa-sun" : "fa-moon"}`}></i>
        </button>
    );
}
