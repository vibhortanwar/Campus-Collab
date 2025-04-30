import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const queryClient = useQueryClient();
  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong!");
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Login successful");
      queryClient.invalidateQueries({queryKey: ["authUser"]});
      
    },
    onError: (error) => {
      toast.error(error.message || "Login failed");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Email'
            name='email'
            onChange={handleInputChange}
            value={formData.email}
          />
          <input
            type='password'
            placeholder='Password'
            name='password'
            onChange={handleInputChange}
            value={formData.password}
          />
          <button type="submit">{isPending ? "Loading..." : "Login"}</button>
        </form>
        <div>
          <p>Don't have an account?</p>
          <Link to='/signup'>
            <button type="button">Sign up</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
