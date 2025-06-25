import React, { useEffect, useState } from "react";

function Navbar() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-mode" : "light-mode";
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <nav style={{
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      padding: "1rem",
      background: theme === "dark" ? "#222" : "#f5f5f5",
      color: theme === "dark" ? "#fff" : "#222",
      borderBottom: "1px solid #ccc"
    }}>
      <button onClick={toggleTheme} style={{
        padding: "0.5rem 1rem",
        borderRadius: "4px",
        border: "none",
        background: theme === "dark" ? "#444" : "#ddd",
        color: theme === "dark" ? "#fff" : "#222",
        cursor: "pointer"
      }}>
        {theme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </button>
    </nav>
  );
}

export default Navbar; 