import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { PendingPostContext } from "../context/PendingPostContext";
import { LogOut, User2, Moon, Sun } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";

export default function Navbar() {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { pendingCount } = useContext(PendingPostContext);
  const { dark, setDark } = useContext(ThemeContext);
  const nav = useNavigate();

  const handleLogout = async () => {
    await logout();
    nav("/login");
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-primary dark:text-blue-400">
          ForumX
        </Link>

        <div className="flex items-center gap-6">

          

          {isAdmin && (
            <Link className="relative text-danger font-semibold hover:text-red-600" to="/admin">
              Admin
              {pendingCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
                  {pendingCount}
                </span>
              )}
            </Link>
          )}

          {/* Theme Toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {dark ? <Sun size={18} className="text-yellow-300" /> : <Moon size={18} />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary">
                <User2 size={20} />
                <span className="font-medium">{user.username}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-primary font-medium">Login</Link>
              <Link
                to="/signup"
                className="px-3 py-1.5 rounded-md bg-primary text-white font-medium hover:bg-blue-600"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
