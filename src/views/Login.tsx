import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControl, InputLabel, OutlinedInput, Button, Typography, Box, Stack } from '@mui/material';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Logging in with', { username, password });
    // Add login logic here
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Stack
        direction="column"
        sx={{
          width: "25%",
          alignItems: 'center',
          justifyContent: 'center',
          padding: 3,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }} >
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
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
        <Button
          color="primary"
          onClick={() => navigate('/register')}
          sx={{ marginTop: 2 }}
        >
          Don't have an account? Register
        </Button>
      </Stack>
    </Box>
  );
};

export default Login;
