import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

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

// ─── OTP Input boxes ─────────────────────────────────────────────────────────
const OtpBoxes = ({ value, onChange }) => {
  const inputsRef = useRef([]);
  const digits = value.split('');

  const handleKey = (e, idx) => {
    if (e.key === 'Backspace') {
      const next = [...digits];
      if (next[idx]) {
        next[idx] = '';
      } else if (idx > 0) {
        next[idx - 1] = '';
        inputsRef.current[idx - 1]?.focus();
      }
      onChange(next.join(''));
      return;
    }
    if (!/^\d$/.test(e.key)) return;
    const next = [...digits];
    next[idx] = e.key;
    onChange(next.join(''));
    if (idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted.padEnd(6, '').slice(0, 6));
    inputsRef.current[Math.min(pasted.length, 5)]?.focus();
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] || ''}
          onChange={() => {}}
          onKeyDown={(e) => handleKey(e, i)}
          onPaste={handlePaste}
          className="w-11 h-12 text-center text-xl font-bold border-2 rounded-lg focus:outline-none transition-all duration-200
            border-gray-300 focus:border-[#123458] bg-gray-50 focus:bg-white text-[#123458]"
        />
      ))}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const SignUpPage = () => {
  const [step, setStep] = useState(1); // 1 = email, 2 = OTP, 3 = details
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [formData, setFormData] = useState({
    enrollNo: '',
    fullName: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ── Countdown timer for resend ──
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // ── Send OTP mutation ──
  const { mutate: mutateSendOtp, isPending: isSending } = useMutation({
    mutationFn: async (emailVal) => {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailVal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
      return data;
    },
    onSuccess: () => {
      toast.success('OTP sent to your email!');
      setStep(2);
      setCountdown(60);
    },
    onError: (err) => toast.error(err.message),
  });

  // ── Verify OTP mutation ──
  const { mutate: mutateVerifyOtp, isPending: isVerifying } = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'OTP verification failed');
      return data;
    },
    onSuccess: () => {
      toast.success('Email verified!');
      setOtpVerified(true);
      setStep(3);
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
        body: JSON.stringify({ email, enrollNo, fullName, password, otpVerified: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Signup failed');
      return data;
    },
    onSuccess: () => {
      toast.success('Account created successfully!');
      queryClient.invalidateQueries(['authUser']);
      navigate('/');
    },
    onError: (err) => toast.error(err.message),
  });

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
        <div className="flex items-center mb-8">
          <StepDot num={1} active={step === 1} done={step > 1} label="Email" />
          <StepLine done={step > 1} />
          <StepDot num={2} active={step === 2} done={step > 2} label="Verify" />
          <StepLine done={step > 2} />
          <StepDot num={3} active={step === 3} done={false} label="Details" />
        </div>

        {/* ── Step 1: Enter Email ── */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#123458] mb-1">IPU Email Address</label>
              <input
                type="email"
                id="signup-email"
                placeholder="yourname@ipu.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && email && mutateSendOtp(email)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent text-[#123458]"
              />
            </div>
            <button
              id="btn-send-otp"
              onClick={() => mutateSendOtp(email)}
              disabled={isSending || !email}
              className="w-full p-3 bg-[#123458] text-white rounded-lg hover:bg-[#0d2a50] transition duration-300 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Sending OTP…
                </span>
              ) : (
                'Send OTP'
              )}
            </button>
            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-[#123458] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        )}

        {/* ── Step 2: Enter OTP ── */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                We sent a 6-digit OTP to{' '}
                <span className="font-semibold text-[#123458]">{email}</span>
              </p>
              <button
                onClick={() => { setStep(1); setOtp(''); }}
                className="text-xs text-gray-400 hover:text-[#123458] mt-1 transition-colors"
              >
                ← Change email
              </button>
            </div>

            <OtpBoxes value={otp} onChange={setOtp} />

            <button
              id="btn-verify-otp"
              onClick={() => mutateVerifyOtp()}
              disabled={isVerifying || otp.length !== 6}
              className="w-full p-3 bg-[#123458] text-white rounded-lg hover:bg-[#0d2a50] transition duration-300 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Verifying…
                </span>
              ) : (
                'Verify OTP'
              )}
            </button>

            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-xs text-gray-400">Resend OTP in <span className="font-semibold text-[#123458]">{countdown}s</span></p>
              ) : (
                <button
                  id="btn-resend-otp"
                  onClick={() => { setOtp(''); mutateSendOtp(email); }}
                  disabled={isSending}
                  className="text-sm text-[#123458] font-semibold hover:underline disabled:opacity-60"
                >
                  {isSending ? 'Sending…' : 'Resend OTP'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Step 3: Account Details ── */}
        {step === 3 && (
          <form onSubmit={handleDetailsSubmit} className="space-y-4 text-[#123458]">
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              <span className="text-lg">✅</span>
              <span>Email <strong>{email}</strong> verified</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                id="signup-fullname"
                name="fullName"
                placeholder="Your full name"
                onChange={handleInputChange}
                value={formData.fullName}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Enrollment No.</label>
              <input
                type="text"
                id="signup-enrollno"
                name="enrollNo"
                placeholder="11-digit Enrollment No."
                onChange={handleInputChange}
                value={formData.enrollNo}
                maxLength={11}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                id="signup-password"
                name="password"
                placeholder="Min 8 characters"
                onChange={handleInputChange}
                value={formData.password}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                id="signup-confirm-password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                onChange={handleInputChange}
                value={formData.confirmPassword}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent"
                required
              />
            </div>

            <button
              id="btn-create-account"
              type="submit"
              disabled={isSigningUp}
              className="w-full p-3 bg-[#123458] text-white rounded-lg hover:bg-[#0d2a50] transition duration-300 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
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

            <p className="text-center text-sm text-gray-500">
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