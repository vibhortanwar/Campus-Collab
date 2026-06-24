import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [googleInitialized, setGoogleInitialized] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(true);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/home");
    },
    onError: (error) => {
      toast.error(error.message || "Login failed");
    },
  });

  // ── Verify Google Credential mutation ──
  const { mutate: mutateVerifyGoogle, isPending: isVerifying } = useMutation({
    mutationFn: async (credential) => {
      const res = await fetch("/api/auth/google-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Google verification failed");
      return data;
    },
    onSuccess: (data) => {
      if (data.status === "login") {
        toast.success("Login successful");
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
        navigate("/home");
      } else if (data.status === "signup") {
        toast.error("Email not registered yet. Please sign up first.");
        navigate("/signup");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Google authentication failed");
    },
  });

  // ── Initialize Google Identity Services ──
  useEffect(() => {
    let active = true;
    const initGoogle = async () => {
      try {
        const res = await fetch("/api/auth/google-client-id");
        const { clientId } = await res.json();
        if (!active) return;
        if (!clientId) {
          console.error("Google Client ID is not configured");
          setGoogleLoading(false);
          return;
        }

        const setupGoogleBtn = () => {
          if (window.google) {
            window.google.accounts.id.initialize({
              client_id: clientId,
              callback: (response) => {
                mutateVerifyGoogle(response.credential);
              },
            });
            
            const btnContainer = document.getElementById("google-login-btn");
            if (btnContainer) {
              window.google.accounts.id.renderButton(btnContainer, {
                theme: "outline",
                size: "large",
                text: "signin_with",
                shape: "rectangular",
                width: 320,
              });
              setGoogleInitialized(true);
            }
          }
          setGoogleLoading(false);
        };

        if (!window.google) {
          const script = document.createElement("script");
          script.src = "https://accounts.google.com/gsi/client";
          script.async = true;
          script.defer = true;
          script.onload = setupGoogleBtn;
          document.head.appendChild(script);
        } else {
          setupGoogleBtn();
        }
      } catch (err) {
        console.error("Failed to initialize Google Sign-In", err);
        if (active) setGoogleLoading(false);
      }
    };

    initGoogle();
    return () => {
      active = false;
    };
  }, []);

  // Re-render button if container appears
  useEffect(() => {
    if (!googleLoading) {
      const btnContainer = document.getElementById("google-login-btn");
      if (btnContainer && window.google) {
        window.google.accounts.id.renderButton(btnContainer, {
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          width: 320,
        });
      }
    }
  }, [googleLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full sm:w-96">
        <h2 className="text-2xl font-bold text-center text-[#123458] mb-6">Login to Campus Collab</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleInputChange}
              value={formData.email}
              className="w-full p-3 border text-[#123458] border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent bg-white"
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
              className="w-full p-3 border text-[#123458] border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent bg-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-[#123458] text-white rounded-lg hover:bg-[#0d2a50] transition duration-300 font-semibold shadow-md"
            disabled={isPending}
          >
            {isPending ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="my-6 flex items-center justify-between">
          <span className="border-b w-[30%] border-gray-200"></span>
          <span className="text-xs text-center text-gray-400 uppercase font-medium">or login with</span>
          <span className="border-b w-[30%] border-gray-200"></span>
        </div>

        <div className="w-full flex flex-col items-center justify-center min-h-[50px]">
          {googleLoading ? (
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
              <svg className="animate-spin h-5 w-5 text-[#123458]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Loading Google Sign-in...
            </div>
          ) : (
            <div id="google-login-btn" className="w-full flex justify-center hover:opacity-90 transition-opacity"></div>
          )}
        </div>

        {isVerifying && (
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-[#123458] font-medium animate-pulse">
            <svg className="animate-spin h-4 w-4 text-[#123458]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Verifying account...
          </div>
        )}

        <div className="mt-6 text-center pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#123458] font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
