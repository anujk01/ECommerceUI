import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js"; // Explicit extension helps with case sensitivity in Linux environments
import "./styles/login.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
