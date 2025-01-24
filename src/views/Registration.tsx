import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, FormControl, InputLabel, OutlinedInput, Button, Typography, Box } from '@mui/material';

const Registration: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registering with', { username, password });
    // Add registration logic here
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 8,
          padding: 3,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleRegister} style={{ width: '100%' }}>
          <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
            <InputLabel htmlFor="username">Username</InputLabel>
            <OutlinedInput
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              label="Username"
            />
          </FormControl>
          <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
            />
          </FormControl>
          <Button type="submit" variant="contained" color="primary" fullWidth onClick={() => navigate('/explore')}>
            Register
          </Button>
        </form>
        <Button
          color="primary"
          onClick={() => navigate('/')}
          sx={{ marginTop: 2 }}
        >
          Already have an account? Login
        </Button>
      </Box>
    </Container>
  );
};

export default Registration;
