import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "react-router-dom";
import profile from "../../assets/Profile.jpg";
import Logo from "../../assets/Logo.png";

const Navbar = () => {
  const location = useLocation();

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

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!authUser) return [];
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (!res.ok) return [];
      return data;
    },
    enabled: !!authUser,
    staleTime: 30_000,
  });

  const hasNotifications = notifications.length > 0;

  const navLinkClass = (path) =>
    `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
    ${location.pathname === path
      ? "text-white bg-[#1e3050]"
      : "text-slate-400 hover:text-white hover:bg-[#1e2d3d]"
    }`;

  return (
    <div className="sticky top-0 z-50 bg-[#0f1923]/90 backdrop-blur-md border-b border-[#1e2d3d] shadow-lg">
      <div className="w-full flex items-center justify-between px-6 py-3 max-w-6xl mx-auto">

        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-6">
          <Link to={authUser ? "/" : "/home"} className="flex items-center">
            <img
              src={Logo}
              alt="CampusCollab"
              className="h-11 w-auto rounded-full object-contain shadow-md bg-[#1a2a3a] border border-[#2d4a6e] p-1 hover:border-blue-500 transition-colors"
            />
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            <Link to="/home" className={navLinkClass("/home")}>Home</Link>

            {authUser && (
              <Link to="/notifications" className={navLinkClass("/notifications")}>
                <span className="relative">
                  Notifications
                  {hasNotifications && (
                    <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-blue-500 animate-badge-pop" />
                  )}
                </span>
              </Link>
            )}

            <Link to="/about" className={navLinkClass("/about")}>About</Link>
          </nav>
        </div>

        {/* Right: Profile or Auth buttons */}
        {authUser ? (
          <Link
            to={`/profile/${authUser.enrollNo}`}
            className="flex items-center gap-3 hover:bg-[#1e3050] transition-all duration-200 rounded-xl px-3 py-2 group"
          >
            <img
              src={authUser.profileImg || profile}
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover border-2 border-[#2d4a6e] group-hover:border-blue-500 transition-colors"
            />
            <div className="text-sm leading-tight text-left hidden sm:block">
              <p className="font-semibold text-white group-hover:text-blue-400 transition-colors">{authUser.fullName}</p>
              <p className="text-slate-500 text-xs">@{authUser.enrollNo}</p>
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-slate-300 hover:text-white px-4 py-2 rounded-lg hover:bg-[#1e2d3d] transition-all duration-200 text-sm font-medium"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all duration-200 shadow-md shadow-blue-900/30"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
