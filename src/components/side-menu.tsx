import { Explore, ScreenLockPortrait, Upload } from "@mui/icons-material";
import Stack from "@mui/material/Stack";
import {
  alpha,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useMatches, useNavigate } from "react-router-dom";

const sidebarWidth = "30vh";

const routes = [
  {
    id: "explored",
    name: "Explore",
    link: "/explore",
    icon: <Explore />,
  },
  {
    id: "upload",
    name: "Upload",
    link: "/upload",
    icon: <Upload />,
  },
  {
    id: "profile",
    name: "Profile",
    link: "/profile",
    icon: <ScreenLockPortrait />,
  },
];

export default function SideMenu() {
  const navigate = useNavigate();
  const matches = useMatches();

  return (
    <Stack
      sx={{
        width: sidebarWidth,
        backgroundColor: "background.paper",
        borderRight: "1px solid",
        borderColor: "divider",
        overflowY: "auto",
        bottom: 0,
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: (theme) => alpha(theme.palette.text.primary, 0.2),
          borderRadius: "3px",
        },
      }}
    >
      <List>
        {routes.map((route) => (
          <ListItem key={route.name}>
            <ListItemButton
              onClick={() => navigate(route.link)}
              selected={matches.findIndex((match) => match.id === route.id) > 0}
            >
              <ListItemIcon>{route.icon}</ListItemIcon>
              <ListItemText primary={route.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
