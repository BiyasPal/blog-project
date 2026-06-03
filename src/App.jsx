import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./Components/AuthContext";
import { ProtectedRoute, AdminRoute } from "./Components/ProtectedRoutes";

import Login     from "./Components/Login";
import Signup    from "./Components/Signup";
import Dashboard from "./Components/Dashboard";
import Admin     from "./Components/Admin";

// 👇 Replace this with your actual Landing page component
import Landing from "./pages/Landing";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Public routes — anyone can visit */}
          <Route path="/"       element={<Landing />} />
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes — only logged-in users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Add more protected pages here as children */}
            {/* <Route path="/profile" element={<Profile />} /> */}
            {/* <Route path="/post/:id" element={<PostDetail />} /> */}
          </Route>

          {/* Admin routes — only admin email */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Admin />} />
          </Route>

          {/* Catch all → redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
