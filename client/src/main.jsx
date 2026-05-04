import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"
import App from './App.jsx'
import ScrollToTop from "./hooks/useScrollTop.js";
import { StrictMode } from "react"

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>,
  </StrictMode>
)
