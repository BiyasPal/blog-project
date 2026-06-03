import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-600">

      {/* Navbar */}

      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-gray-900">The Blog.</h1>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className="text-xs font-medium px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:opacity-80 transition"
            >
              Admin Panel
            </button>
          )}
          <span className="text-sm text-white">{currentUser?.email}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-white transition"
          >
            Log out
          </button>
        </div>
      </nav>

      {/* Content */}

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-serif font-medium text-white mb-2">
          Welcome, {currentUser?.displayName || "Reader"} 
        </h2>
        <p className="text-gray-400 text-sm mb-10">
          Here are the latest posts from the community.
        </p>

        {/* Placeholder blog cards */}

        <div className="grid gap-6">
          {["Getting started with React", "Why Tailwind changed everything", "Building with Firebase"].map((title, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-sm transition">
              <p className="text-xs text-gray-400 mb-2">May 2026 · 5 min read</p>
              <h3 className="text-lg font-serif font-medium text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
              </p>
              <button className="mt-4 text-xs font-medium text-gray-900 underline underline-offset-2">
                Read more →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
