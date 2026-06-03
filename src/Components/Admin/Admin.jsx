import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "./Config";
import {collection, getDocs, deleteDoc, doc,} from "firebase/firestore";

export default function Admin() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers]   = useState([]);
  const [posts, setPosts]   = useState([]);
  const [tab, setTab]       = useState("users"); // "users" | "posts"
  const [loading, setLoading] = useState(true);

  // ── Fetch all users and posts from Firestore ───────────
  useEffect(() => {
    const fetchData = async () => {
      const usersSnap = await getDocs(collection(db, "users"));
      const postsSnap = await getDocs(collection(db, "posts"));
      setUsers(usersSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setPosts(postsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchData();
  }, []);

  // ── Delete user from Firestore ─────────────────────────
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await deleteDoc(doc(db, "users", id));
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // ── Delete post from Firestore ─────────────────────────
  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    await deleteDoc(doc(db, "posts", id));
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#faf9f6]">

      {/* Navbar */}
      <nav className="bg-[#1a1a18] px-6 py-4 flex items-center justify-between">
        <h1 className="font-serif text-xl font-semibold text-[#f5f0e8]">
          The Blog. <span className="text-xs font-sans text-gray-400 ml-2">Admin Panel</span>
        </h1>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/dashboard")}
            className="text-xs text-gray-400 hover:text-white transition">
            ← Back to Blog
          </button>
          <span className="text-xs text-gray-500">{currentUser?.email}</span>
          <button onClick={handleLogout}
            className="text-xs text-gray-400 hover:text-white transition">
            Log out
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-serif font-medium text-gray-900 mb-1">Admin Dashboard</h2>
        <p className="text-sm text-gray-400 mb-8">Manage users and posts from here.</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-xs text-gray-400 mb-1">Total Users</p>
            <p className="text-3xl font-serif font-medium text-gray-900">{users.length}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-xs text-gray-400 mb-1">Total Posts</p>
            <p className="text-3xl font-serif font-medium text-gray-900">{posts.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-gray-200 mb-6">
          {["users", "posts"].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2.5 text-sm font-medium capitalize transition border-b-2 -mb-px
                ${tab === t
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-700"}`}>
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : tab === "users" ? (

          // ── Users table ──────────────────────────────────
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Role</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3 text-gray-800">{u.name || "—"}</td>
                    <td className="px-5 py-3 text-gray-500">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                        ${u.role === "admin"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-100 text-gray-500"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {u.role !== "admin" && (
                        <button onClick={() => deleteUser(u.id)}
                          className="text-xs text-red-400 hover:text-red-600 transition font-medium">
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-8">No users yet.</p>
            )}
          </div>

        ) : (

          // ── Posts table ───────────────────────────────────
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Title</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400">Author</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {posts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3 text-gray-800">{p.title || "Untitled"}</td>
                    <td className="px-5 py-3 text-gray-500">{p.authorEmail || "—"}</td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => deletePost(p.id)}
                        className="text-xs text-red-400 hover:text-red-600 transition font-medium">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {posts.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-8">No posts yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
