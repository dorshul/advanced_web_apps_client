import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";

const ProtectedRoute: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;

  return <Outlet />;
};

export default ProtectedRoute;
