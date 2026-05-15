import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initAnalytics } from "./lib/analytics";
import { registerServiceWorker } from "./lib/registerSW";

initAnalytics();

createRoot(document.getElementById("root")!).render(<App />);

// Offline-stöd registreras EFTER mount — vi vill inte blockera första målningen.
// Web vitals och Sentry är inte aktiverade by default. För att slå på dem:
//   - npm install web-vitals
//   - import * as wv from "web-vitals"; wireWebVitals(wv);
//   - npm install @sentry/browser
//   - import * as Sentry from "@sentry/browser"; setSentry(Sentry);
registerServiceWorker();
