import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

// ─── Step indicator ──────────────────────────────────────────────────────────
const StepDot = ({ active, done, label, num }) => (
  <div className="flex flex-col items-center gap-1">
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
        done
          ? 'bg-green-500 text-white'
          : active
          ? 'bg-[#123458] text-white ring-4 ring-[#123458]/20'
          : 'bg-gray-200 text-gray-400'
      }`}
    >
      {done ? '✓' : num}
    </div>
    <span className={`text-xs font-medium ${active ? 'text-[#123458]' : 'text-gray-400'}`}>{label}</span>
  </div>
);

const StepLine = ({ done }) => (
  <div className={`flex-1 h-0.5 mb-5 transition-all duration-500 ${done ? 'bg-green-500' : 'bg-gray-200'}`} />
);

// ─── Main Component ───────────────────────────────────────────────────────────
const SignUpPage = () => {
  const [step, setStep] = useState(1); // 1 = Verify Email, 2 = Details
  const [email, setEmail] = useState('');
  const [signupToken, setSignupToken] = useState('');
  const [googleInitialized, setGoogleInitialized] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(true);
  const [formData, setFormData] = useState({
    enrollNo: '',
    fullName: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ── Verify Google Credential mutation ──
  const { mutate: mutateVerifyGoogle, isPending: isVerifying } = useMutation({
    mutationFn: async (credential) => {
      const res = await fetch('/api/auth/google-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Google verification failed');
      return data;
    },
    onSuccess: (data) => {
      if (data.status === 'login') {
        toast.success('You already have an account. Logging in...');
        queryClient.invalidateQueries({ queryKey: ['authUser'] });
        navigate('/');
      } else if (data.status === 'signup') {
        toast.success('Email verified via Google!');
        setEmail(data.email);
        setSignupToken(data.signupToken);
        setFormData((prev) => ({
          ...prev,
          fullName: data.fullName || '',
        }));
        setStep(2);
      }
    },
    onError: (err) => toast.error(err.message),
  });

  // ── Signup mutation ──
  const { mutate: mutateSignup, isPending: isSigningUp, isError, error } = useMutation({
    mutationFn: async ({ enrollNo, fullName, password }) => {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ signupToken, enrollNo, fullName, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Signup failed');
      return data;
    },
    onSuccess: () => {
      toast.success('Account created successfully!');
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      navigate('/');
    },
    onError: (err) => toast.error(err.message),
  });

  // ── Initialize Google Identity Services ──
  useEffect(() => {
    let active = true;
    const initGoogle = async () => {
      try {
        const res = await fetch('/api/auth/google-client-id');
        const { clientId } = await res.json();
        if (!active) return;
        if (!clientId) {
          toast.error('Google Client ID is not configured');
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
            
            const btnContainer = document.getElementById('google-signup-btn');
            if (btnContainer) {
              window.google.accounts.id.renderButton(btnContainer, {
                theme: 'outline',
                size: 'large',
                text: 'continue_with',
                shape: 'rectangular',
                width: 320,
              });
              setGoogleInitialized(true);
            }
          }
          setGoogleLoading(false);
        };

        if (!window.google) {
          const script = document.createElement('script');
          script.src = 'https://accounts.google.com/gsi/client';
          script.async = true;
          script.defer = true;
          script.onload = setupGoogleBtn;
          document.head.appendChild(script);
        } else {
          setupGoogleBtn();
        }
      } catch (err) {
        console.error('Failed to initialize Google Sign-In', err);
        if (active) setGoogleLoading(false);
      }
    };

    initGoogle();
    return () => {
      active = false;
    };
  }, []);

  // Make sure to render the Google button if step changes back to 1 or when it is first initialized
  useEffect(() => {
    if (step === 1 && !googleLoading) {
      const btnContainer = document.getElementById('google-signup-btn');
      if (btnContainer && window.google) {
        window.google.accounts.id.renderButton(btnContainer, {
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          width: 320,
        });
      }
    }
  }, [step, googleLoading]);

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    const { enrollNo, fullName, password, confirmPassword } = formData;
    if ([enrollNo, fullName, password, confirmPassword].some((v) => v.trim() === '')) {
      toast.error('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    mutateSignup({ enrollNo, fullName, password });
  };

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#123458]">Create an Account</h2>
          <p className="text-sm text-gray-500 mt-1">Join Campus Collab with your IPU email</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center mb-8 max-w-[280px] mx-auto">
          <StepDot num={1} active={step === 1} done={step > 1} label="Verify Email" />
          <StepLine done={step > 1} />
          <StepDot num={2} active={step === 2} done={false} label="Details" />
        </div>

        {/* ── Step 1: Verify Email ── */}
        {step === 1 && (
          <div className="space-y-6 flex flex-col items-center">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                To create a Campus Collab account, please verify your identity using your official university email account.
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs text-amber-800 font-medium">
                <span>🎓</span>
                <span>Only <strong>@ipu.ac.in</strong> email addresses allowed</span>
              </div>
            </div>

            <div className="w-full flex flex-col items-center justify-center py-4 min-h-[60px]">
              {googleLoading ? (
                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                  <svg className="animate-spin h-5 w-5 text-[#123458]" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Initializing Google Sign-In...
                </div>
              ) : (
                <div id="google-signup-btn" className="w-full flex justify-center hover:opacity-90 transition-opacity"></div>
              )}
            </div>

            {isVerifying && (
              <div className="flex items-center gap-2 text-sm text-[#123458] font-medium animate-pulse">
                <svg className="animate-spin h-4 w-4 text-[#123458]" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Verifying your university account...
              </div>
            )}

            <p className="text-center text-sm text-gray-500 w-full pt-4 border-t border-gray-100">
              Already have an account?{' '}
              <Link to="/login" className="text-[#123458] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        )}

        {/* ── Step 2: Account Details ── */}
        {step === 2 && (
          <form onSubmit={handleDetailsSubmit} className="space-y-4 text-[#123458]">
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              <span className="text-lg">✅</span>
              <span className="break-all">Email <strong>{email}</strong> verified</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Full Name</label>
              <input
                type="text"
                id="signup-fullname"
                name="fullName"
                placeholder="Your full name"
                onChange={handleInputChange}
                value={formData.fullName}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent bg-white text-gray-800"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Enrollment No.</label>
              <input
                type="text"
                id="signup-enrollno"
                name="enrollNo"
                placeholder="11-digit Enrollment No."
                onChange={handleInputChange}
                value={formData.enrollNo}
                maxLength={11}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent bg-white text-gray-800"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
              <input
                type="password"
                id="signup-password"
                name="password"
                placeholder="Min 8 characters"
                onChange={handleInputChange}
                value={formData.password}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent bg-white text-gray-800"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Confirm Password</label>
              <input
                type="password"
                id="signup-confirm-password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                onChange={handleInputChange}
                value={formData.confirmPassword}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent bg-white text-gray-800"
                required
              />
            </div>

            <button
              id="btn-create-account"
              type="submit"
              disabled={isSigningUp}
              className="w-full p-3 bg-[#123458] text-white rounded-lg hover:bg-[#0d2a50] transition duration-300 font-semibold disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
            >
              {isSigningUp ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating account…
                </span>
              ) : (
                'Create Account'
              )}
            </button>

            {isError && error && (
              <p className="text-red-500 text-center text-sm mt-1">{error.message}</p>
            )}

            <p className="text-center text-sm text-gray-500 w-full pt-4 border-t border-gray-100">
              Already have an account?{' '}
              <Link to="/login" className="text-[#123458] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;