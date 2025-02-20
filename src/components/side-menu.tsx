import { Explore, ScreenLockPortrait, Upload } from '@mui/icons-material';
import Stack from '@mui/material/Stack';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useMatches, useNavigate } from 'react-router-dom';

const sidebarWidth = 240;

const routes = [
  {
    id: 'posts',
    name: 'Posts',
    link: '/posts',
    icon: <Explore />,
  },
  {
    id: 'upload',
    name: 'Upload',
    link: '/upload',
    icon: <Upload />,
  },
  {
    id: 'profile',
    name: 'Profile',
    link: '/profile',
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
        backgroundColor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
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
