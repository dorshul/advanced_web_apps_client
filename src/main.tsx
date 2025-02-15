import React, { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AppTheme from "./theme";
import Root from "./pages/root";
import Login from "./pages/login";
import { AuthProvider } from "./contexts/auth-context.jsx";
import RegistrationPage from "./pages/register.js";
import ExplorePage from "./pages/explore.js";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        id: "login",
        path: "/login",
        element: <Login />,
      },
      {
        id: "register",
        path: "/register",
        element: <RegistrationPage />,
      },
      {
        id: "explore",
        path: "/explore",
        element: <ExplorePage />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <StyledEngineProvider injectFirst>
        <AppTheme>
          <CssBaseline enableColorScheme />
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </AppTheme>
      </StyledEngineProvider>
    </QueryClientProvider>
  </StrictMode>
);
