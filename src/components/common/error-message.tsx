import { Alert } from "@mui/material";

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <Alert severity="error" sx={{ my: 2 }}>
    {message}
  </Alert>
);
