import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ── Blocks any non-logged-in user ─────────────────────────
// Wrap any route with this to require login
export function ProtectedRoute() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

// ── Blocks anyone who is not admin ────────────────────────
// Wrap admin routes with this
export function AdminRoute() {
  const { currentUser, isAdmin } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    // Logged in but not admin → send to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
