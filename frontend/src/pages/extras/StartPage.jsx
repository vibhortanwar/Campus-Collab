import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const StartPage = () => {
  const {
    data: authUser,
    isLoading,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) return null;
      return data;
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0d1117]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#0d1117] px-4">
      {/* Glowing logo ring */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl scale-150" />
        <img
          src={Logo}
          className="relative w-36 h-36 rounded-full object-contain border-2 border-[#2d4a6e] shadow-2xl bg-[#0f1923] p-2"
          alt="Campus Collab Logo"
        />
      </div>

      <div className="text-center max-w-xl w-full">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">
          Campus{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Collab
          </span>
        </h1>
        <p className="text-slate-400 text-lg mb-3">
          An exclusive platform for <span className="text-blue-400 font-semibold">GGSIPU students</span> to collaborate, learn, and create together.
        </p>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          Whether you're working on a personal project, starting a new initiative, or looking for like-minded collaborators — Campus Collab is here to help.
        </p>

        {authUser ? (
          <div>
            <Link to="/home">
              <button className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-lg shadow-blue-900/40 hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 hover:scale-105">
                Go to Home
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="flex justify-center gap-4">
              <Link to="/login">
                <button className="px-7 py-2.5 rounded-full border border-[#2d4a6e] bg-transparent text-blue-300 hover:bg-[#1a2a3a] hover:border-blue-400 transition-all duration-200 font-medium">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-7 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-lg shadow-blue-900/40 hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 hover:scale-105">
                  Sign Up
                </button>
              </Link>
            </div>
            <Link to="/home">
              <button className="text-slate-500 hover:text-slate-300 text-sm transition-colors duration-200 mt-1 underline-offset-2 hover:underline">
                Browse as guest →
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Decorative bottom gradient */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-900/10 to-transparent pointer-events-none" />
    </div>
  );
};

export default StartPage;
