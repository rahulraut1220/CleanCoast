import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useSelector((state) => state.user);

  if (!user) return <Navigate to="/" />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/" />;

  return children;
}
