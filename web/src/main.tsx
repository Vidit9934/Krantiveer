import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// All three axes (weight, width, optical size): headlines react to the pointer and the scroll.
import "@fontsource-variable/bricolage-grotesque/standard.css";
import "@fontsource/dm-mono/400.css";
import "@fontsource/dm-mono/500.css";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/shell.css";
import "./styles/nav.css";
import "./styles/home.css";
import "./styles/conversion.css";
import "./styles/charts.css";
import "./styles/pages.css";
import "./styles/scenes/hero.css";
import "./styles/scenes/services.css";
import "./styles/scenes/work.css";
import "./styles/scenes/reel.css";
import "./styles/scenes/stats.css";
import "./styles/scenes/map.css";
import "./styles/scenes/close.css";
import "./styles/scenes/megamenu.css";
import "./styles/scenes/footer.css";
import "./styles/scenes/inner.css";
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
