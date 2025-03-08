import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../contexts/auth";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Box,
  CircularProgress,
  Stack,
} from "@mui/material";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { login, googleSignIn } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data);
      navigate("/explore");
    } catch (err) {
      setError("Failed to login");
    }
  };

  const onSuccessGoogleSignIn = async (credentials: CredentialResponse) => {
    try {
      console.log("Google Sign In Success", credentials)
      await googleSignIn(credentials);
      navigate("/explore");
    } catch (err) {
      setError("Failed to login with Google");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Welcome Back
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
          <Stack display={"flex"} alignItems={"center"} direction={"column"}>
            <GoogleLogin
              onSuccess={(credentials) => onSuccessGoogleSignIn(credentials)} 
              onError={() => setError("Login Failed")} 
              />
          <Button
            color="primary"
            onClick={() => navigate('/register')}
            sx={{ marginTop: 2 }}
          >
            Don't have an account?
          </Button>
            </Stack>
        </Paper>
      </Box>
    </Container>
  );
};
