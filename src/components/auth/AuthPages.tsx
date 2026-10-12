/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Shield,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  Lock,
  UserCheck,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../../types/banking';

interface AuthPagesProps {
  currentView: 'login' | 'register' | 'forgot-password';
  onNavigate: (view: 'main' | 'login' | 'register' | 'forgot-password' | 'dashboard' | 'admin') => void;
  onLoginSuccess: (user: UserProfile) => void;
  users: UserProfile[];
  onRegisterUser: (newUser: UserProfile) => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({
  currentView,
  onNavigate,
  onLoginSuccess,
  users,
  onRegisterUser
}) => {
  // Login State
  const [loginRole, setLoginRole] = useState<'USER' | 'ADMIN'>('USER');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState(false);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  // ── Handle Login ──
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const emailLower = loginEmail.trim().toLowerCase();

      // Look up user
      const matched = users.find(
        (u) => u.email.toLowerCase() === emailLower && u.role === loginRole
      );

      if (matched) {
        if (matched.status === 'SUSPENDED' || matched.status === 'LOCKED') {
          setLoginError(`Account is ${matched.status}. Please contact the system administrator.`);
          return;
        }
        onLoginSuccess(matched);
      } else {
        // Fallback demo matching for user convenience in academic testing
        if (loginRole === 'ADMIN') {
          if (emailLower.includes('admin') || emailLower === '25r21a67a0@mlrit.ac.in') {
            const adminUser = users.find((u) => u.role === 'ADMIN') || users[1];
            onLoginSuccess(adminUser);
          } else {
            setLoginError('Invalid administrator credentials. Authorized administrators only.');
          }
        } else {
          // Standard user verification
          if (emailLower.endsWith('@mlrit.ac.in') || emailLower.includes('vamshi')) {
            const defaultUser = users.find((u) => u.role === 'USER') || users[0];
            onLoginSuccess(defaultUser);
          } else {
            setLoginError('Invalid credentials. Please verify your email and password or use Quick Demo.');
          }
        }
      }
    }, 550);
  };

  // Quick Demo Logins
  const handleDemoLogin = (role: 'USER' | 'ADMIN') => {
    setLoginError(null);
    if (role === 'USER') {
      const u = users.find((x) => x.email === '25r21a67b5@mlrit.ac.in') || users[0];
      setLoginEmail(u.email);
      setLoginPassword('DemoPassword123');
      setLoginRole('USER');
      onLoginSuccess(u);
    } else {
      const a = users.find((x) => x.role === 'ADMIN') || users[1];
      setLoginEmail(a.email);
      setLoginPassword('AdminSecurePass2026');
      setLoginRole('ADMIN');
      onLoginSuccess(a);
    }
  };

  // ── Handle Register ──
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setRegError('All fields marked are required.');
      return;
    }

    if (!regEmail.includes('@') || !regEmail.includes('.')) {
      setRegError('Please enter a valid email address.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Password confirmation does not match.');
      return;
    }

    if (!agreeTerms) {
      setRegError('You must agree to the terms and conditions.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const initials = regName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      const newUser: UserProfile = {
        id: `u-${Date.now()}`,
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim() || '+91 9876543210',
        role: 'USER',
        avatarText: initials || 'U',
        status: 'ACTIVE',
        joinedDate: new Date().toISOString().split('T')[0],
        accountCount: 1
      };

      onRegisterUser(newUser);
      setRegSuccess(true);
    }, 600);
  };

  // ── Handle Forgot Password ──
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);

    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setForgotError('Please enter a valid registered email address.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setForgotSubmitted(true);
    }, 500);
  };

  // =========================================================================
  // VIEW: REGISTRATION PAGE
  // =========================================================================
  if (currentView === 'register') {
    return (
      <div className="min-h-screen bg-[#060A13] text-white font-sans antialiased flex flex-col justify-between p-4 sm:p-6 selection:bg-blue-600">
        <header className="max-w-6xl mx-auto w-full py-3 flex justify-between items-center">
          <button
            onClick={() => onNavigate('main')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </button>
          <div className="text-xs text-slate-400">Account Registration</div>
        </header>

        <div className="max-w-md w-full mx-auto my-auto bg-[#0E1528] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {regSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Account Created Successfully</h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                Welcome to <strong>Smart Banking Assistant</strong>. Your account has been registered with initial academic banking credentials.
              </p>
              <button
                onClick={() => {
                  setRegSuccess(false);
                  onNavigate('login');
                }}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition cursor-pointer shadow-md mt-4"
              >
                Continue to Login
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-cyan-400 flex items-center justify-center mx-auto mb-3 border border-cyan-500/30">
                  <Shield className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Create Your Account</h2>
                <p className="text-xs text-slate-400 mt-1">Smart Banking Assistant (BANKO)</p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Vamshi Krishna"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="25r21a67b5@mlrit.ac.in"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create a secure password"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                  />
                  {regPassword && (
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
                      <span>Strength:</span>
                      <span className={regPassword.length >= 8 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-semibold'}>
                        {regPassword.length >= 8 ? 'Strong' : 'Medium (6+ chars)'}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="termsCheck"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded accent-blue-500 cursor-pointer"
                  />
                  <label htmlFor="termsCheck" className="text-[11px] text-slate-400 leading-tight cursor-pointer">
                    I agree to the academic terms, conditions and secure database storage guidelines.
                  </label>
                </div>

                {regError && (
                  <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition cursor-pointer shadow-md mt-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <div className="mt-5 text-center text-xs text-slate-400 border-t border-white/10 pt-4">
                Already registered?{' '}
                <button
                  onClick={() => onNavigate('login')}
                  className="text-cyan-400 font-semibold hover:underline cursor-pointer"
                >
                  Log in here
                </button>
              </div>
            </>
          )}
        </div>

        <footer className="text-center py-4 text-[11px] text-slate-500">
          Developed by MLRIT CSE (Data Science) Students: Vamshi Krishna, Abhiram, Priyanshu
        </footer>
      </div>
    );
  }

  // =========================================================================
  // VIEW: FORGOT PASSWORD PAGE
  // =========================================================================
  if (currentView === 'forgot-password') {
    return (
      <div className="min-h-screen bg-[#060A13] text-white font-sans antialiased flex flex-col justify-between p-4 sm:p-6 selection:bg-blue-600">
        <header className="max-w-6xl mx-auto w-full py-3 flex justify-between items-center">
          <button
            onClick={() => onNavigate('login')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </button>
          <div className="text-xs text-slate-400">Password Recovery</div>
        </header>

        <div className="max-w-md w-full mx-auto my-auto bg-[#0E1528] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-6">
            <KeyRound className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-white tracking-tight">Forgot Password</h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter your registered email address to receive password reset instructions.
            </p>
          </div>

          {forgotSubmitted ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center leading-relaxed">
                ✓ If this account exists in our records, a secure password reset link has been dispatched to{' '}
                <strong>{forgotEmail}</strong>.
              </div>
              <p className="text-[11px] text-slate-400 text-center">
                (Academic prototype mode: check with your Spring Boot database administrator or return to sign in).
              </p>
              <button
                onClick={() => onNavigate('login')}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition cursor-pointer shadow-md"
              >
                Return to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="25r21a67b5@mlrit.ac.in"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                />
              </div>

              {forgotError && (
                <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{forgotError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition cursor-pointer shadow-md disabled:opacity-50"
              >
                {isSubmitting ? 'Verifying...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-xs text-slate-400 border-t border-white/10 pt-4">
            Remembered your password?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-cyan-400 font-semibold hover:underline cursor-pointer"
            >
              Sign in
            </button>
          </div>
        </div>

        <footer className="text-center py-4 text-[11px] text-slate-500">
          Smart Banking Assistant — Powered by BANKO
        </footer>
      </div>
    );
  }

  // =========================================================================
  // VIEW: LOGIN PAGE (USER & ADMIN AUTHENTICATION)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#060A13] text-white font-sans antialiased flex flex-col justify-between p-4 sm:p-6 selection:bg-blue-600">
      <header className="max-w-6xl mx-auto w-full py-3 flex justify-between items-center">
        <button
          onClick={() => onNavigate('main')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>BANKO Security Layer</span>
        </div>
      </header>

      <div className="max-w-md w-full mx-auto my-auto bg-[#0E1528] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Portal Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {loginRole === 'ADMIN' ? 'BANKO ADMIN PORTAL' : 'Smart Banking Assistant'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {loginRole === 'ADMIN'
              ? 'Bank Operations & Management Center · Authorized administrators only.'
              : 'Sign in to access your accounts, transactions & BANKO AI'}
          </p>
        </div>

        {/* Role Toggle */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-black/40 border border-white/10 mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setLoginRole('USER');
              setLoginError(null);
            }}
            className={`py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              loginRole === 'USER' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>User Portal</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginRole('ADMIN');
              setLoginError(null);
            }}
            className={`py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              loginRole === 'ADMIN' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </button>
        </div>

        {/* Quick Demo Credentials */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/5 mb-5 space-y-1.5">
          <span className="text-[10px] uppercase tracking-wider font-bold text-cyan-400 block">
            Academic Project — 1-Click Demo Login
          </span>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleDemoLogin('USER')}
              className="py-1.5 px-2.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-[11px] font-medium text-cyan-300 transition cursor-pointer text-left truncate"
            >
              Demo Client (Vamshi)
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('ADMIN')}
              className="py-1.5 px-2.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-[11px] font-medium text-amber-300 transition cursor-pointer text-left truncate"
            >
              Demo Admin (Abhiram)
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {loginRole === 'ADMIN' ? 'Admin Email' : 'Email Address'}
            </label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder={loginRole === 'USER' ? '25r21a67b5@mlrit.ac.in' : '25r21a67A0@mlrit.ac.in'}
              className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-300">Password</label>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded accent-blue-500 cursor-pointer"
              />
              <span>Remember me</span>
            </label>
          </div>

          {loginError && (
            <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl text-white font-semibold text-xs transition cursor-pointer shadow-md disabled:opacity-50 ${
              loginRole === 'ADMIN'
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20'
                : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
            }`}
          >
            {isSubmitting
              ? 'Verifying Credentials...'
              : loginRole === 'ADMIN'
              ? 'Secure Admin Login'
              : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400 border-t border-white/10 pt-4 flex flex-col gap-2">
          {loginRole === 'USER' ? (
            <>
              <div>
                Don't have an account?{' '}
                <button
                  onClick={() => onNavigate('register')}
                  className="text-cyan-400 font-semibold hover:underline cursor-pointer"
                >
                  Register
                </button>
              </div>
              <button
                onClick={() => setLoginRole('ADMIN')}
                className="text-slate-400 hover:text-white transition text-[11px]"
              >
                Switch to Admin Login
              </button>
            </>
          ) : (
            <button
              onClick={() => setLoginRole('USER')}
              className="text-cyan-400 hover:underline transition font-semibold"
            >
              ← Back to User Login
            </button>
          )}
        </div>
      </div>

      <footer className="text-center py-4 text-[11px] text-slate-500">
        Smart Banking Assistant — Powered by BANKO · Developed by MLRIT CSE (Data Science) Students
      </footer>
    </div>
  );
};
