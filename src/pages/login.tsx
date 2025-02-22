import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth, useLogin } from "../hooks/auth";
import { useNavigate, Link } from "react-router-dom";

interface LoginFormInputs {
  email: string;
  password: string;
}

const loginSchema = yup.object().shape({
  email: yup.string().required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login: React.FC = () => {
  const theme = useTheme();
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutateAsync: attemptLogin, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setErrorMessage(null);

    try {
      const response = await attemptLogin(data);
      login(response.token, response.refreshToken, response.userId);
      navigate("/explore", { replace: true });
    } catch (error) {
      console.error(error);
      setErrorMessage("Invalid email or password. Please try again.");
    }
  };

  useEffect(() => {
    if (user) navigate("/explore");
  }, [navigate, user]);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 400, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        {errorMessage && (
          <Typography color="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Typography>
        )}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, py: 1.5 }}
            disabled={isPending || isPending}
          >
            {isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              textDecoration: "none",
              color: theme.palette.primary.main,
            }}
          >
            Register here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
