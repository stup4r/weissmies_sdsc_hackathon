import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ConfigProvider } from "antd";

createRoot(document.getElementById("root")).render(
  <ConfigProvider
    theme={{
      token: {
        // Seed Token
        colorPrimary: "#646cff",
        borderRadius: 2,

        // Alias Token
        colorBgContainer: "#fff",
      },
    }}
  >
    <StrictMode>
      <App />
    </StrictMode>
  </ConfigProvider>
);
