import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const user = useSelector((state) => state.user.user);

  if (!user) {
    return <Navigate to="/login" />;
  }
  if (!user?.isVerified) {
    return <Navigate to="/verification" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
