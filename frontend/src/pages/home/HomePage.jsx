import React, { useState } from "react";
import { Link } from "react-router-dom";
import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";
import { useQuery } from "@tanstack/react-query";
import profile from "../../assets/Profile.jpg";
import { FiHome, FiBell, FiUser, FiInfo, FiEdit } from "react-icons/fi";
import { useLocation } from "react-router-dom";

const SidebarLink = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 group
      ${active
        ? "bg-blue-600/15 text-white border border-blue-500/20"
        : "text-slate-400 hover:bg-[#0f1923] hover:text-slate-200"
      }`}
  >
    <span className={`transition-colors ${active ? "text-blue-400" : "group-hover:text-blue-400"}`}>
      {icon}
    </span>
    {label}
  </Link>
);

const HomePage = () => {
  const location = useLocation();
  const [showCreatePost, setShowCreatePost] = useState(false);

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) return null;
      return data;
    },
    retry: false,
  });

  return (
    <div className="flex justify-center min-h-screen px-4 pt-6 pb-20">
      <div className="w-full max-w-5xl flex gap-6">

        {/* ── Left Sidebar ── */}
        <aside className="hidden lg:flex flex-col w-64 flex-shrink-0">
          <div className="sticky top-20 space-y-1">
            <SidebarLink to="/home"          icon={<FiHome className="w-5 h-5" />}   label="Home"          active={location.pathname === "/home"} />
            {authUser && (
              <>
                <SidebarLink to="/notifications" icon={<FiBell className="w-5 h-5" />}   label="Notifications" active={location.pathname === "/notifications"} />
                <SidebarLink to={`/profile/${authUser.enrollNo}`} icon={<FiUser className="w-5 h-5" />}   label="Profile"       active={location.pathname.startsWith("/profile")} />
              </>
            )}
            <SidebarLink to="/about"         icon={<FiInfo className="w-5 h-5" />}   label="About"         active={location.pathname === "/about"} />

            {/* Create Post CTA */}
            {authUser && (
              <div className="pt-4">
                <button
                  onClick={() => setShowCreatePost((p) => !p)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold hover:from-blue-500 hover:to-cyan-400 transition-all duration-200 shadow-lg shadow-blue-900/30 active:scale-95"
                >
                  <FiEdit className="w-4 h-4" />
                  {showCreatePost ? "Close" : "Create Post"}
                </button>
              </div>
            )}

            {/* Profile card (logged in) */}
            {authUser && (
              <div className="mt-4 p-4 rounded-xl bg-[#0f1923] border border-[#1e2d3d]">
                <Link to={`/profile/${authUser.enrollNo}`} className="flex items-center gap-3 group">
                  <img
                    src={authUser.profileImg || profile}
                    alt="You"
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#2d4a6e] group-hover:border-blue-500 transition-colors"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-white text-sm truncate group-hover:text-blue-400 transition-colors">{authUser.fullName}</p>
                    <p className="text-xs text-slate-500 truncate">@{authUser.enrollNo}</p>
                  </div>
                </Link>
              </div>
            )}

            {/* Guest CTA */}
            {!authUser && (
              <div className="mt-4 p-4 rounded-xl bg-[#0f1923] border border-[#1e2d3d] space-y-2">
                <p className="text-sm text-slate-400">Join CampusCollab to post & apply</p>
                <Link to="/signup" className="block text-center py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold hover:from-blue-500 hover:to-cyan-400 transition-all duration-200">
                  Sign Up
                </Link>
                <Link to="/login" className="block text-center py-2 rounded-xl border border-[#2d4a6e] text-slate-300 text-sm hover:bg-[#1e3050] transition-colors">
                  Login
                </Link>
              </div>
            )}
          </div>
        </aside>

        {/* ── Main Feed ── */}
        <main className="flex-1 min-w-0">
          {/* Feed header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-white">
              {authUser ? `Hello, ${authUser.fullName?.split(" ")[0]} 👋` : "Campus Feed"}
            </h2>
            {/* Mobile create button */}
            {authUser && (
              <button
                onClick={() => setShowCreatePost((p) => !p)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold hover:from-blue-500 hover:to-cyan-400 transition-all duration-200 active:scale-95"
              >
                <FiEdit className="w-4 h-4" />
                {showCreatePost ? "Close" : "Post"}
              </button>
            )}
          </div>

          {/* Guest banner (mobile / no sidebar) */}
          {!authUser && (
            <div className="flex items-center justify-between gap-4 mb-5 p-4 rounded-xl bg-[#0f1923] border border-[#1e2d3d] lg:hidden animate-slide-down">
              <p className="text-sm text-slate-400">
                Browsing as a guest.{" "}
                <Link to="/login" className="text-blue-400 hover:underline font-medium">Login</Link> or{" "}
                <Link to="/signup" className="text-blue-400 hover:underline font-medium">Sign up</Link>.
              </p>
            </div>
          )}

          {/* Create Post */}
          {authUser && showCreatePost && (
            <div className="mb-5 animate-slide-down">
              <CreatePost />
            </div>
          )}

          {/* Posts feed */}
          <Posts authUser={authUser} />
        </main>
      </div>
    </div>
  );
};

export default HomePage;
