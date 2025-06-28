import React, { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";
import { useQuery } from "@tanstack/react-query";
import profile from "../../assets/Profile.jpg";

const HomePage = () => {
  const [showCreatePost, setShowCreatePost] = useState(true);

  const toggleCreatePost = () => {
    setShowCreatePost((prev) => !prev);
  };

  const { data: authUser } = useQuery({
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

  return (
    <div className="flex justify-center px-4 pt-8">
      <div className="w-full lg:w-1/2">
        {/* Greeting Header */}
        {authUser && (
          <>
            <div className="flex items-center gap-4 mb-8">
              <img
                src={authUser?.profileImg || profile}
                alt="User"
                className="w-12 h-12 rounded-full object-cover shadow-md"
              />
              <div>
                <h2 className="text-xl text-[#123458] font-semibold">
                  Hello, {authUser?.fullName?.split(" ")[0] || "there"} 👋
                </h2>
                <p className="text-gray-600 text-sm">
                  Welcome back! Ready to post something?
                </p>
              </div>
            </div>

            {/* Create Post Form */}
            {showCreatePost && (
              <div className="mb-6">
                <CreatePost />
              </div>
            )}
          </>
        )}

        {/* ✅ Always render posts */}
        <Posts authUser={authUser} />
      </div>

      {/* Floating Create Post Button */}
      {authUser && (
        <button
          onClick={toggleCreatePost}
          className="fixed bottom-6 right-6 px-5 py-3 bg-white text-[#123458] rounded-full shadow-xl border border-gray-300 flex items-center gap-2 hover:bg-[#123458] hover:text-white transition-all duration-300 ease-in-out"
        >
          {showCreatePost ? (
            "Close"
          ) : (
            <div className="flex items-center gap-2">
              <CiCirclePlus size={20} />
              <span className="font-medium">Create Post</span>
            </div>
          )}
        </button>
      )}
    </div>
  );
};

export default HomePage;
