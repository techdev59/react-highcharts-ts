import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ApiProvider } from "@reduxjs/toolkit/dist/query/react";
import { tradingApi } from "./services/tradingServices.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApiProvider api={tradingApi}>
      <App />
    </ApiProvider>
  </React.StrictMode>
);
