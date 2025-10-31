// Polices
import "@fontsource/maven-pro/400.css";
import "@fontsource/maven-pro/600.css";
import "@fontsource/maven-pro/700.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";

// Petit filet: affiche aussi les erreurs non catchées dans la console
window.addEventListener("error", (e) => console.error("window.error:", e.error || e.message));
window.addEventListener("unhandledrejection", (e) => console.error("unhandledrejection:", e.reason));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
