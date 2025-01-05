import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.tsx";
import ReduxProvider from "./redux/redux-provider.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ReduxProvider>
            <App />
        </ReduxProvider>
    </StrictMode>
);
