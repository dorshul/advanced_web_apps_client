import Stack from '@mui/material/Stack';

import { Typography } from '@mui/material';
import { useMatches } from 'react-router-dom';

export default function Header() {
  const matches = useMatches();

  return (
    <Stack py={2} flex={0}>
      <Typography variant="h4" textTransform="capitalize">
        {matches
          .slice(1)
          .map((match) => match.id)
          .join(' / ')}
      </Typography>
    </Stack>
  );
}
