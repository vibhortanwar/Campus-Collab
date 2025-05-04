import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import profile from "../../assets/Profile.jpg";
import Logo from "../../assets/Logo.png";

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
  });

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="bg-[#123458] text-white px-6 py-3 shadow-md">
      <div className="w-full flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center">
            <img
              src={Logo}
              alt="Logo"
              className="h-14 w-auto rounded-full object-contain shadow-md bg-white p-1"
            />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex gap-4 text-lg font-semibold tracking-wide">
            <Link
              to="/"
              className="hover:bg-[#123458] hover:text-white hover:underline px-3 py-1 rounded-full transition"
            >
              Home
            </Link>
            <Link
              to="/notifications"
              className="hover:bg-[#123458] hover:text-white hover:underline px-3 py-1 rounded-full transition"
            >
              Notifications
            </Link>
            <Link
              to="/about"
              className="hover:bg-[#123458] hover:text-white hover:underline px-3 py-1 rounded-full transition"
            >
              About
            </Link>
          </nav>
        </div>

        {/* Right: Drawer Toggle for Small Screens */}
        <div className="md:hidden">
          <button
            onClick={toggleDrawer}
            className="text-white focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12h18M3 6h18M3 18h18"
              />
            </svg>
          </button>
        </div>

        {/* Right: Profile Info for Larger Screens */}
        <div className="hidden md:flex items-center gap-4">
          {authUser && (
            <Link
              to={`/profile/${authUser.enrollNo}`}
              className="flex items-center gap-2 hover:bg-[#638db9b6] transition rounded-full p-3"
            >
              <img
                src={authUser.profileImg || profile}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover border border-gray-600 shadow-sm"
              />
              <div className="text-sm leading-tight text-left">
                <p className="font-semibold">{authUser.fullName}</p>
                <p className="text-white text-xs">{authUser.enrollNo}</p>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Drawer for Small Screens */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#123458] text-white shadow-md transform ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform ease-in-out duration-300 z-50 md:hidden`}
      >
        <button
          onClick={toggleDrawer}
          className="absolute top-4 right-4 text-white focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Drawer Links */}
        <nav className="flex flex-col gap-4 text-lg font-semibold tracking-wide mt-16 px-6">
          <Link
            to="/"
            className="hover:bg-[#123458] hover:text-white hover:underline px-3 py-1 rounded-full transition"
            onClick={toggleDrawer}
          >
            Home
          </Link>
          <Link
            to="/notifications"
            className="hover:bg-[#123458] hover:text-white hover:underline px-3 py-1 rounded-full transition"
            onClick={toggleDrawer}
          >
            Notifications
          </Link>
          <Link
            to="/about"
            className="hover:bg-[#123458] hover:text-white hover:underline px-3 py-1 rounded-full transition"
            onClick={toggleDrawer}
          >
            About
          </Link>
        </nav>

        {/* Profile Info at the Bottom of Drawer */}
        {authUser && (
          <Link to={`/profile/${authUser.enrollNo}`} className="absolute bottom-0 left-0 w-full bg-[#0f2a45] p-4 flex items-center gap-2">
            <img
              src={authUser.profileImg || profile}
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover border border-gray-600 shadow-sm"
            />
            <div className="text-sm leading-tight text-left text-white">
              <p className="font-semibold">{authUser.fullName}</p>
              <p className="text-xs">{authUser.enrollNo}</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;