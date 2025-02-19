import React, { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Root from "./pages/root";
import AppTheme from "./theme";
import Login from "./pages/login";
import { AuthProvider } from "./contexts/auth";
import ExplorePage from "./pages/explore";
import PostsDetailsPage from "./pages/post-details";
import PostsView from "./pages/posts";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      // {
      //   id: 'profile',
      //   path: '/profile',
      //   element: <ProfilePage />,
      // },

      {
        id: "login",
        path: "/login",
        element: <Login />,
      },
      {
        id: "explore",
        path: "/explore",
        element: <ExplorePage />,
      },
      {
        id: "posts",
        path: "/posts",
        element: <PostsView />,
      },
      {
        id: "post-details",
        path: "/posts/:id",
        element: <PostsDetailsPage />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StyledEngineProvider injectFirst>
          <AppTheme>
            <CssBaseline enableColorScheme />
            <RouterProvider router={router} />
          </AppTheme>
        </StyledEngineProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
