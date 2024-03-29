import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { DevTools } from "jotai-devtools";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DevTools />
    <App />
  </React.StrictMode>
);
