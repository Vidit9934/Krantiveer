import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@fontsource/cormorant-garamond/300.css";
import "@fontsource/cormorant-garamond/300-italic.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource-variable/manrope/index.css";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/shell.css";
import "./styles/nav.css";
import "./styles/home.css";
import "./styles/conversion.css";
import "./styles/pages.css";
import { SideProvider } from "./context/SideContext";
import { JoinProvider } from "./context/JoinContext";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SideProvider>
      <BrowserRouter>
        <JoinProvider>
          <App />
        </JoinProvider>
      </BrowserRouter>
    </SideProvider>
  </StrictMode>,
);
