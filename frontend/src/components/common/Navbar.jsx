import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import profile from "../../assets/Profile.jpg";
import Logo from "../../assets/Logo.png";

const Navbar = () => {
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
  });

  return (
    <div className="bg-[#123458] text-white px-6 py-3 shadow-md">
      <div className="w-full flex items-center justify-between">
        {/* Left: Logo and Nav */}
        <div className="flex items-center gap-8">
          <Link to="/home" className="flex items-center">
            <img
              src={Logo}
              alt="Logo"
              className="h-14 w-auto rounded-full object-contain shadow-md bg-white p-1"
            />
          </Link>

          <nav className="flex gap-4 text-lg font-semibold tracking-wide">
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

        {/* Right: Profile Info */}
        {authUser ? (
          <div className="flex items-center gap-4">
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
          </div>
        ) : (
          <Link to="/login" className="px-4 py-2 hover:underline font-bold">
            login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
