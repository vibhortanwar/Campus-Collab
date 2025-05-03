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
    confirmPassword: '', // still kept here for frontend validation
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ email, enrollNo, fullName, password }) => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Send cookie with the request
          body: JSON.stringify({ email, enrollNo, fullName, password }), // No confirmPassword
        });

        const data = await res.json();
        if (data.error) {
          throw new Error(typeof data.error === 'string' ? data.error : JSON.stringify(data.error));
        }

        return data;
      } catch (error) {
        toast.error(error.message || "Something went wrong");
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Signup successful!");
      queryClient.invalidateQueries(["authUser"]); // Refetch authUser query to get updated user data
      navigate("/"); // Redirect to homepage after successful signup
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

    mutate({ email, enrollNo, fullName, password }); // Only the required fields
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          name="email"
          onChange={handleInputChange}
          value={formData.email}
        />
        <input
          type="text"
          placeholder="Enrollment No."
          name="enrollNo"
          onChange={handleInputChange}
          value={formData.enrollNo}
        />
        <input
          type="text"
          placeholder="Full Name"
          name="fullName"
          onChange={handleInputChange}
          value={formData.fullName}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleInputChange}
          value={formData.password}
        />
        <input
          type="password" // Changed to password type
          placeholder="Confirm Password"
          name="confirmPassword"
          onChange={handleInputChange}
          value={formData.confirmPassword}
        />
        <button type="submit">
          {isPending ? "Loading..." : "Sign up"}
        </button>
        {isError && error && <p>{error.message}</p>}
      </form>
      <div>
        <p>Already have an account?</p>
        <Link to="/login">
          <button>Sign in</button>
        </Link>
      </div>
    </div>
  );
};

export default SignUpPage;
