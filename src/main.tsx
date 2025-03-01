import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Root from "./pages/root";
import AppTheme from "./theme";
import { Login } from "./pages/login";
import ExplorePage from "./pages/explore";
import PostsDetailsPage from "./pages/post-details";
import { Register } from "./pages/register";
import ProfilePage from "./pages/profile";
import UploadPostPage from "./pages/upload";
import { PublicOnlyRoute } from "./components/router/public-route";
import { ProtectedRoute } from "./components/router/protected-route";
import PostEditPage from "./pages/edit-post";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        element: <PublicOnlyRoute />,
        children: [
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/register",
            element: <Register />,
          },
        ],
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            id: "profile",
            path: "/profile",
            element: <ProfilePage />,
          },

          {
            id: "explore",
            path: "/explore",
            element: <ExplorePage />,
          },
          {
            id: "edit-post",
            path: "/posts/edit/:id",
            element: <PostEditPage />,
          },
          {
            id: "post-details",
            path: "/posts/:id",
            element: <PostsDetailsPage />,
          },
          {
            id: "upload",
            path: "/upload",
            element: <UploadPostPage />,
          },
        ],
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
          <RouterProvider router={router} />
        </AppTheme>
      </StyledEngineProvider>
    </QueryClientProvider>
  </StrictMode>
);
