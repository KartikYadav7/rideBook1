import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const user = useSelector((state) => state.user.user);

  if (!user) {
    return <Navigate to="/login" />;
  }
  if (!user && !user?.isVerified) {
    return <Navigate to="/verification" />;
  }
  if (user?.isVerified) {
    return <Navigate to="/" />;
  }


  return <Outlet />;
};

export default ProtectedRoute;
