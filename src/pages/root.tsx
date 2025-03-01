import { Box, alpha, Stack } from "@mui/material";
import SideMenu from "../components/side-menu";
import AppNavbar from "../components/app-navbar";
import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <Stack direction="column" display={"flex"} height={"100%"}>
      <AppNavbar />
      <Stack direction="row" flex={1}>
        {<SideMenu />}
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
