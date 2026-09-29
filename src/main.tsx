import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initMonitoring } from "./monitoring";
import { QueryProvider } from "./components/QueryProvider";
import "./index.css"; // Import Tailwind CSS

// Initialize monitoring as early as possible
initMonitoring();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </React.StrictMode>,
);
