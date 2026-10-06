// the starting point: vite loads this file first (see index.html).
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "../styles.css";

// find <div id="root"> in index.html and draw <App /> inside it
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
