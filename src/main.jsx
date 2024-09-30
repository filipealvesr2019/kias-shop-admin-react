import App from "./App.jsx";
import "./index.css";

// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/AuthContext.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ConfigProvider } from "./context/ConfigContext.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
    <ConfigProvider>

    <AuthProvider>
    <ToastContainer />

      <App />
    </AuthProvider>

    </ConfigProvider>
    </ErrorBoundary>

  </React.StrictMode>
);