import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    enrollNo: '',
    fullName: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isError, error, isPending } = useMutation({
    mutationFn: async ({ email, enrollNo, fullName, password }) => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, enrollNo, fullName, password }),
      });
  
      const data = await res.json();
  
      // Throw an error if the response is not OK
      if (!res.ok) {
        throw new Error(data.error || data.message || "Signup failed");
      }
  
      return data;
    },
    onError: (err) => {
      // Display the error message using toast
      toast.error(err.message || "An error occurred during signup");
    },
    onSuccess: () => {
      toast.success("Signup successful!");
      queryClient.invalidateQueries(["authUser"]);
      navigate("/"); // Redirect to the homepage
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, enrollNo, fullName, password, confirmPassword } = formData;

    if ([email, enrollNo, fullName, password, confirmPassword].some(v => v.trim() === '')) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    mutate({ email, enrollNo, fullName, password }); 
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-2xl font-bold text-center text-[#123458] mb-6">Create an Account</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 text-[#123458]">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleInputChange}
              value={formData.email}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent"
              required
            />
          </div>
          <div>
            <input
              type="text"
              name="enrollNo"
              placeholder="Enrollment No."
              onChange={handleInputChange}
              value={formData.enrollNo}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent"
              required
            />
          </div>
          <div>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              onChange={handleInputChange}
              value={formData.fullName}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleInputChange}
              value={formData.password}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent"
              required
            />
          </div>
          <div>
            <input
              type="text"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleInputChange}
              value={formData.confirmPassword}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-[#123458] text-white rounded-lg hover:bg-[#0d2a50] transition duration-300"
            disabled={isPending}
          >
            {isPending ? "Creating account..." : "Sign up"}
          </button>

          {isError && error && (
            <p className="text-red-500 text-center mt-2">{error.message}</p>
          )}
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-[#123458] font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;