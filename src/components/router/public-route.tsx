import { Outlet, Navigate } from "react-router-dom";
import { useUser } from "../../hooks/user";

export const PublicOnlyRoute = () => {
  const { user, isLoading, isUpdating } = useUser();

  if (isLoading && !isUpdating) {
    return <div>Loading...</div>;
  }

  console.log(user);
  return !user ? <Outlet /> : <Navigate to="/explore" replace />;
};
