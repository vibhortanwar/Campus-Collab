import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from "react-hot-toast";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    enrollNo: '',
    fullName: '',
    password: '', // Added missing password field
    confirmPassword: '',
  });

  const {mutate, isError, isPending, error} = useMutation({
    mutationFn: async (formData) => {
      try {
        const { email, enrollNo, fullName, password, confirmPassword } = formData;
        
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, enrollNo, fullName, password, confirmPassword }),
        });
    
        // if (!res.ok) throw new Error("Something went wrong");
    
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
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(formData).some(value => value.trim() === '')) {
      toast.error("All fields are required");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
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
            type="text" // Changed to password type for confirmPassword
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={handleInputChange}
            value={formData.confirmPassword}
          />
          <button type="submit"> {/* Added type="submit" for clarity */}
            {isPending ? "Loading...": "Sign up"}
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
    </div>
  );
};

export default SignUpPage;