import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/react";
import App from "./App.tsx";
import "./index.css";

const clerkAppearance = {
  layout: {
    socialButtonsVariant: "iconButton" as const,
    logoPlacement: "inside" as const,
  },
  variables: {
    colorPrimary: "#3d7c75",
    colorBackground: "#f7f3ea",
    colorInputBackground: "#fffdf7",
    colorInputText: "#1f2933",
    colorText: "#1f2933",
    colorTextSecondary: "#687386",
    borderRadius: "8px",
    fontFamily: "'Source Sans 3', ui-sans-serif, system-ui, sans-serif",
    fontSize: "15px",
  },
  elements: {
    rootBox: { boxShadow: "none" },
    card: {
      backgroundColor: "#fffdf7",
      border: "1px solid #e2dccf",
      boxShadow: "0 8px 30px rgba(31, 41, 51, 0.055)",
      borderRadius: "8px",
    },
    headerTitle: {
      fontFamily: "'Source Serif 4', Georgia, serif",
      fontWeight: "800",
      color: "#1f2933",
    },
    headerSubtitle: { color: "#687386" },
    formButtonPrimary: {
      backgroundColor: "#3d7c75",
      fontWeight: "700",
      fontSize: "14px",
      borderRadius: "8px",
    },
    formButtonPrimary__loading: { backgroundColor: "#357069" },
    footerActionLink: { color: "#3d7c75" },
    formFieldInput: {
      borderColor: "#e2dccf",
      backgroundColor: "#fffdf7",
    },
    formFieldInput__focused: { borderColor: "#3d7c75" },
  },
};

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/" appearance={clerkAppearance}>
    <App />
  </ClerkProvider>
);
