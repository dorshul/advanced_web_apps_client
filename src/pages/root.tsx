import { Box, alpha, Stack } from "@mui/material";
import SideMenu from "../components/side-menu";
import AppNavbar from "../components/app-navbar";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/auth";

export default function Root() {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const isSignedIn = user && !isLoading;

  const PUBLIC_ROUTES = ["/login", "/register"];

  if (!isSignedIn && !isLoading && !PUBLIC_ROUTES.includes(location.pathname)) {
    return <Navigate to="/login" replace />;
  }
  return (
    <Stack direction="column" alignItems="stretch" sx={{ height: "100%" }}>
      <AppNavbar />
      <Stack direction="row" flex={1}>
        {isSignedIn ? <SideMenu /> : null}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "stretch",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
              height: "100%",
            }}
          >
            <Outlet />
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
}
