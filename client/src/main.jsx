import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"
import App from './App.jsx'
import ScrollToTop from "./hooks/useScrollTop.js";
import { StrictMode } from "react"
import TokenProvider from "./providers/TokenProvider.jsx";
import AxiosInterceptorSetUp from "./AxiosInterceptorSetUp.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <TokenProvider>
        <AxiosInterceptorSetUp />
        <ScrollToTop />
        <App />
      </TokenProvider>
    </BrowserRouter>,
  </StrictMode>
)
