import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/Logo.png"
const StartPage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <img src={Logo} className="w-98"/><br/>
      <div className="text-center p-8 rounded-lg max-w-lg w-full">
        <h1 className="text-4xl font-bold text-[#123458] mb-4">Welcome to Campus Collab</h1>
        <p className="text-lg text-gray-700 mb-6">
          An exclusive platform for GGSIPU students to collaborate, learn, and create together.
        </p>
        <div className="space-y-4">
          <p className="text-gray-600">
            Whether you're working on a personal project, starting a new initiative, or looking for like-minded collaborators,
            Campus Collab is here to help you find people who share similar interests and skills. 
          </p>
          <p className="text-gray-600">
            Join today to connect with fellow students and take your ideas to the next level.
          </p>
        </div>

        <div className="flex justify-center mt-6 space-x-4 text-[#123458]">
          <Link to="/login">
            <button className="btn bg-transparent hover:underline rounded-full px-6 py-2 text-[#123458] border border-[#123458]">
              Login
            </button>
          </Link>
          <div className="pt-1"> or </div>
          <Link to="/signup">
            <button className="btn rounded-full px-6 py-2 bg-[#123458] text-white hover:underline">
              Sign Up
            </button>
          </Link>
        </div>

        <div className="mt-6 text-sm text-gray-500">
        </div>
      </div>
    </div>
  );
};

export default StartPage;
