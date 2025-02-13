import { Box } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ColorModeIconDropdown from "../theme/color-mode-icon-dropdown";

export default function AppNavbar() {
  return (
    <Stack
      direction="row"
      p={2}
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="h4" component="h1" sx={{ color: "text.primary" }}>
        Instagram
      </Typography>
      <Box flex={1} />
      <ColorModeIconDropdown />
    </Stack>
  );
}
