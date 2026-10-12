/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  PieChart,
  ArrowUpRight,
  BarChart3,
  TrendingUp,
  Calculator,
  Sparkles,
  ArrowRight,
  LogIn,
  LogOut,
  Target,
  Wallet,
  Landmark,
  CreditCard,
  ArrowLeftRight,
  Lock,
  KeyRound,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  Bot,
  User,
  Sliders,
  Zap,
  Activity,
  Layers,
  Check,
  Send,
  HelpCircle,
  Clock,
  Sparkle,
  Compass
} from 'lucide-react';
import { UserProfile } from '../../types/banking';

interface PublicHomePageProps {
  currentUser: UserProfile | null;
  onNavigate: (view: 'main' | 'login' | 'register' | 'forgot-password' | 'dashboard' | 'admin') => void;
  onSignOut: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Financial Network Canvas (Background Particle & Connectivity Mesh)
// ─────────────────────────────────────────────────────────────────────────────
const FinancialNetworkBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particleCount = Math.min(Math.floor((width * height) / 22000), 55);
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }> = [];

    const colors = ['rgba(56, 189, 248, 0.4)', 'rgba(37, 99, 235, 0.4)', 'rgba(6, 182, 212, 0.35)'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    // Animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(37, 99, 235, ${0.18 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-60"
      aria-hidden="true"
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Magnetic Button Component
// ─────────────────────────────────────────────────────────────────────────────
interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({ children, onClick, className = '' }) => {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) * 0.22;
    const distanceY = (e.clientY - centerY) * 0.22;
    setOffset({ x: distanceX, y: distanceY });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: offset.x === 0 ? 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 0.1s ease-out'
      }}
      className={className}
    >
      {children}
    </button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3D Card Tilt Component
// ─────────────────────────────────────────────────────────────────────────────
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  glowColor = 'rgba(56, 189, 248, 0.15)'
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rx = ((y - centerY) / centerY) * -7;
    const ry = ((x - centerX) / centerX) * 7;
    setTilt({ rx, ry });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(${isHovered ? '8px' : '0px'})`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className={`relative rounded-2xl transition-shadow ${className}`}
    >
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-100 transition-opacity"
          style={{
            background: `radial-gradient(350px circle at 50% 50%, ${glowColor}, transparent 70%)`
          }}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Public Home Page Component
// ─────────────────────────────────────────────────────────────────────────────
export const PublicHomePage: React.FC<PublicHomePageProps> = ({
  currentUser,
  onNavigate,
  onSignOut
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Orbiting BANKO element state
  const [activeOrbit, setActiveOrbit] = useState<string | null>('balance');

  // How it works interactive step
  const [activeStep, setActiveStep] = useState(1);

  // Meet BANKO Chat Showcase State
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string }>>([
    {
      role: 'assistant',
      text: "Hello! I am BANKO, your Smart Banking Assistant. How can I help optimize your finances today?",
      time: '10:00 AM'
    },
    {
      role: 'user',
      text: 'How much did I spend this month?',
      time: '10:01 AM'
    },
    {
      role: 'assistant',
      text: 'You have spent ₹22,400 this month. Your highest spending category is Shopping (₹8,200), followed by Food (₹6,800). Would you like to review your budget breakdown?',
      time: '10:01 AM'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // EMI Calculator preview state
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureMonths, setTenureMonths] = useState(24);

  // Listen to mouse for background cursor-following glow
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Listen to scroll for navbar transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate EMI
  const calculateEMI = () => {
    const p = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureMonths;
    if (r === 0) {
      return {
        monthlyEMI: Math.round(p / n),
        totalInterest: 0,
        totalPayment: p
      };
    }
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;
    return {
      monthlyEMI: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment)
    };
  };

  const emiResults = calculateEMI();

  // Quick Questions handler for BANKO showcase
  const handleQuickQuestion = (question: string) => {
    if (isTyping) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages(prev => [...prev, { role: 'user', text: question, time: now }]);
    setIsTyping(true);

    let reply = '';
    if (question.includes('balance')) {
      reply = 'Your combined balance across Savings and Current accounts is ₹85,420 (₹54,200 Savings + ₹31,220 Current). Available for instant transfer.';
    } else if (question.includes('transactions')) {
      reply = 'You have 14 verified transactions this month. Most recent: ₹1,250 to Fresh Mart (Success, Oct 11) and ₹5,000 received via IMPS from College Bursar.';
    } else if (question.includes('spent the most')) {
      reply = 'Your highest expenditure category this cycle is Shopping (₹8,200 / 36.6%), followed closely by Food & Dining (₹6,800 / 30.3%).';
    } else if (question.includes('save')) {
      reply = 'Based on your monthly surplus of ₹22,600, you can allocate ₹12,000 to your Laptop Goal and ₹10,600 to your Emergency Reserve while maintaining safe liquidity.';
    } else if (question.includes('EMI')) {
      reply = 'For a ₹5,00,000 personal loan at 8.5% over 24 months, your monthly EMI is ₹22,732. Total interest payable is ₹45,568.';
    } else {
      reply = 'BANKO is ready to analyze your accounts, track deposits, compute interest, or initiate instant NEFT/IMPS transfers!';
    }

    setTimeout(() => {
      setIsTyping(false);
      setChatMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `${reply} (Demo Response · Grounded in mock banking session)`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 900);
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 font-sans antialiased overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* ── Background Layer 1: Financial Network Particle Canvas ── */}
      <FinancialNetworkBackground />

      {/* ── Background Layer 2: Animated Radial Gradients & Streams ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* Cursor-following subtle cyan/blue glow */}
        <div
          className="absolute -inset-[200px] opacity-40 transition-transform duration-75 ease-out"
          style={{
            background: `radial-gradient(650px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(37, 99, 235, 0.15), rgba(6, 182, 212, 0.05) 45%, transparent 75%)`
          }}
        />

        {/* Ambient Top Navy-Blue Glow */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-blue-900/25 via-cyan-900/10 to-transparent blur-3xl rounded-full" />

        {/* Diagonal Financial Data Stream lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* ──────────────────────────────────────────────────────────
          FLOATING NAVBAR (Top Bar Contract: 3 Zones)
          ────────────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#030712]/80 backdrop-blur-xl border-b border-blue-900/30 shadow-[0_10px_30px_-10px_rgba(2,6,23,0.8)] py-3.5'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark with Digital Pulse */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#hero"
              className="group flex items-center gap-2.5 text-slate-100 no-underline"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 p-[1px] shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-shadow">
                <div className="w-full h-full bg-[#060D20] rounded-[11px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
                {/* Subtle digital pulse */}
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  BANKO
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    AI
                  </span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                  Smart Banking Assistant
                </span>
              </div>
            </a>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#hero" className="hover:text-cyan-400 transition-colors whitespace-nowrap">
              Home
            </a>
            <a href="#features" className="hover:text-cyan-400 transition-colors whitespace-nowrap">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-cyan-400 transition-colors whitespace-nowrap">
              How It Works
            </a>
            <a href="#banko-showcase" className="hover:text-cyan-400 transition-colors whitespace-nowrap">
              Meet BANKO
            </a>
            <a href="#security" className="hover:text-cyan-400 transition-colors whitespace-nowrap">
              Security
            </a>
            <a href="#about" className="hover:text-cyan-400 transition-colors whitespace-nowrap">
              About
            </a>
          </nav>

          {/* Zone 3: Exactly One Primary Action Button */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate(currentUser.role === 'ADMIN' ? 'admin' : 'dashboard')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.35)] transition-all flex items-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5" />
                  Dashboard
                </button>
                <button
                  onClick={onSignOut}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <MagneticButton
                onClick={() => onNavigate('login')}
                className="relative px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.35)] transition-all flex items-center gap-2 overflow-hidden group"
              >
                <LogIn className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                <span>Login</span>
                {/* Button light sweep */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform" />
              </MagneticButton>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
              aria-label="Toggle navigation menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span
                  className={`h-0.5 w-full bg-current transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}
                />
                <span className={`h-0.5 w-full bg-current transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                <span
                  className={`h-0.5 w-full bg-current transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-3 pb-6 bg-[#060D20]/95 backdrop-blur-2xl border-b border-blue-900/40 space-y-3">
            <a
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 hover:text-cyan-400 py-1.5 text-sm"
            >
              Home
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 hover:text-cyan-400 py-1.5 text-sm"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 hover:text-cyan-400 py-1.5 text-sm"
            >
              How It Works
            </a>
            <a
              href="#banko-showcase"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 hover:text-cyan-400 py-1.5 text-sm"
            >
              Meet BANKO
            </a>
            <a
              href="#security"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 hover:text-cyan-400 py-1.5 text-sm"
            >
              Security
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 hover:text-cyan-400 py-1.5 text-sm"
            >
              About
            </a>
            <div className="pt-2 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('login');
                }}
                className="w-full py-2.5 text-xs font-semibold text-center text-white bg-blue-600 rounded-xl"
              >
                Login to Account
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ──────────────────────────────────────────────────────────
          HERO SECTION (NEW DARK BANKING TECH ARCHITECTURE)
          ────────────────────────────────────────────────────────── */}
      <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline & Value Proposition */}
            <div className="lg:col-span-7 space-y-8 text-left">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-xs font-medium text-cyan-300 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>Next-Generation Autonomous Financial Intelligence</span>
              </div>

              {/* Primary Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-balance">
                Smart Banking.{' '}
                <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                  Simplified by BANKO.
                </span>
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
                A smarter way to understand your money, manage your finances, track transactions, plan
                savings, and interact with your personal banking assistant. Powered by real-time
                intelligence and military-grade security.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <MagneticButton
                  onClick={() => onNavigate('register')}
                  className="relative group px-7 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all flex items-center gap-2.5 overflow-hidden"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  {/* Subtle sweep */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform" />
                </MagneticButton>

                <a
                  href="#features"
                  className="px-6 py-3.5 rounded-xl font-medium text-sm text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/60 hover:border-cyan-500/40 backdrop-blur-md transition-all flex items-center gap-2 group"
                >
                  <Compass className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform" />
                  <span>Explore Features</span>
                </a>
              </div>

              {/* Gesture / Scroll to explore micro-indicator */}
              <div className="pt-6 flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-900/40 border border-blue-500/30 text-cyan-400 animate-bounce">
                  ↓
                </span>
                <span className="font-medium tracking-wide uppercase text-[11px] text-slate-400">
                  Scroll to explore financial ecosystem
                </span>
              </div>
            </div>

            {/* Right Column: 3D Holographic BANKO Digital Banking Interface */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Orbiting Container */}
              <div className="relative w-full max-w-[460px] aspect-square flex items-center justify-center">
                {/* Glowing Concentric Digital Rings */}
                <div className="absolute inset-0 rounded-full border border-blue-500/15 animate-[spin_40s_linear_infinite]" />
                <div className="absolute inset-8 rounded-full border border-cyan-500/20 border-dashed animate-[spin_30s_linear_infinite_reverse]" />
                <div className="absolute inset-20 rounded-full border border-blue-400/25 animate-[spin_20s_linear_infinite]" />

                {/* Central Glowing Digital Core: BANKO */}
                <div className="relative z-20 flex flex-col items-center justify-center w-36 h-36 rounded-full bg-gradient-to-b from-[#0B1739] to-[#040A1F] border-2 border-cyan-400/50 shadow-[0_0_50px_rgba(6,182,212,0.35)] backdrop-blur-xl group cursor-pointer transition-transform duration-300 hover:scale-105">
                  <div className="absolute inset-0 rounded-full bg-cyan-500/10 animate-ping opacity-25" />
                  <Bot className="w-10 h-10 text-cyan-400 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-base font-extrabold tracking-wider text-white">BANKO</span>
                  <span className="text-[9px] uppercase tracking-widest text-cyan-300 font-semibold">
                    Core Intelligence
                  </span>
                </div>

                {/* Orbiting Element 1: Balance (Top) */}
                <div
                  onMouseEnter={() => setActiveOrbit('balance')}
                  className="absolute top-1 left-1/2 -translate-x-1/2 z-30 cursor-pointer group"
                >
                  <div
                    className={`px-3 py-2 rounded-xl backdrop-blur-xl border transition-all duration-300 flex items-center gap-2 shadow-lg ${
                      activeOrbit === 'balance'
                        ? 'bg-blue-900/80 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105'
                        : 'bg-[#09132E]/80 border-blue-500/30 text-slate-300 hover:border-cyan-400/60'
                    }`}
                  >
                    <Wallet className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Balance</div>
                      <div className="text-xs font-bold text-white tabular-nums">₹85,420</div>
                    </div>
                  </div>
                </div>

                {/* Orbiting Element 2: Spending (Right) */}
                <div
                  onMouseEnter={() => setActiveOrbit('spending')}
                  className="absolute top-1/2 right-0 -translate-y-1/2 z-30 cursor-pointer group"
                >
                  <div
                    className={`px-3 py-2 rounded-xl backdrop-blur-xl border transition-all duration-300 flex items-center gap-2 shadow-lg ${
                      activeOrbit === 'spending'
                        ? 'bg-blue-900/80 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105'
                        : 'bg-[#09132E]/80 border-blue-500/30 text-slate-300 hover:border-cyan-400/60'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Spending</div>
                      <div className="text-xs font-bold text-white tabular-nums">₹22,400</div>
                    </div>
                  </div>
                </div>

                {/* Orbiting Element 3: Savings (Bottom-Right) */}
                <div
                  onMouseEnter={() => setActiveOrbit('savings')}
                  className="absolute bottom-4 right-10 z-30 cursor-pointer group"
                >
                  <div
                    className={`px-3 py-2 rounded-xl backdrop-blur-xl border transition-all duration-300 flex items-center gap-2 shadow-lg ${
                      activeOrbit === 'savings'
                        ? 'bg-blue-900/80 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105'
                        : 'bg-[#09132E]/80 border-blue-500/30 text-slate-300 hover:border-cyan-400/60'
                    }`}
                  >
                    <Target className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Savings Goal</div>
                      <div className="text-xs font-bold text-emerald-400 tabular-nums">58% Done</div>
                    </div>
                  </div>
                </div>

                {/* Orbiting Element 4: Transactions (Bottom-Left) */}
                <div
                  onMouseEnter={() => setActiveOrbit('transactions')}
                  className="absolute bottom-4 left-10 z-30 cursor-pointer group"
                >
                  <div
                    className={`px-3 py-2 rounded-xl backdrop-blur-xl border transition-all duration-300 flex items-center gap-2 shadow-lg ${
                      activeOrbit === 'transactions'
                        ? 'bg-blue-900/80 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105'
                        : 'bg-[#09132E]/80 border-blue-500/30 text-slate-300 hover:border-cyan-400/60'
                    }`}
                  >
                    <ArrowLeftRight className="w-4 h-4 text-indigo-400" />
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Transfers</div>
                      <div className="text-xs font-bold text-white tabular-nums">14 Active</div>
                    </div>
                  </div>
                </div>

                {/* Orbiting Element 5: Security (Left) */}
                <div
                  onMouseEnter={() => setActiveOrbit('security')}
                  className="absolute top-1/2 left-0 -translate-y-1/2 z-30 cursor-pointer group"
                >
                  <div
                    className={`px-3 py-2 rounded-xl backdrop-blur-xl border transition-all duration-300 flex items-center gap-2 shadow-lg ${
                      activeOrbit === 'security'
                        ? 'bg-blue-900/80 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105'
                        : 'bg-[#09132E]/80 border-blue-500/30 text-slate-300 hover:border-cyan-400/60'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Security</div>
                      <div className="text-xs font-bold text-cyan-300">256-bit AES</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover Details Expansion Card (Grounded in Mock Demo Session) */}
              <div className="absolute -bottom-8 inset-x-4 max-w-sm mx-auto p-3.5 rounded-xl bg-[#08122B]/90 backdrop-blur-2xl border border-cyan-500/30 shadow-2xl text-center z-40 transition-all">
                {activeOrbit === 'balance' && (
                  <div className="text-xs">
                    <span className="font-semibold text-white">Consolidated Balance: ₹85,420</span>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Split across primary Savings (₹54,200) and Student Current (₹31,220).
                    </p>
                  </div>
                )}
                {activeOrbit === 'spending' && (
                  <div className="text-xs">
                    <span className="font-semibold text-amber-300">Monthly Expenses: ₹22,400</span>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Shopping accounts for 36.6% (₹8,200). Within normal budget parameters.
                    </p>
                  </div>
                )}
                {activeOrbit === 'savings' && (
                  <div className="text-xs">
                    <span className="font-semibold text-emerald-300">Laptop Goal: ₹35,000 / ₹60,000</span>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Progress at 58%. Estimated completion in 3.2 months at current allocation.
                    </p>
                  </div>
                )}
                {activeOrbit === 'transactions' && (
                  <div className="text-xs">
                    <span className="font-semibold text-indigo-300">14 Verified Transactions</span>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Zero fraud flags. Instant settlement via NEFT/RTGS gateway simulations.
                    </p>
                  </div>
                )}
                {activeOrbit === 'security' && (
                  <div className="text-xs">
                    <span className="font-semibold text-cyan-300">Enterprise Isolation Active</span>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Protected credentials, role-based boundary verification, and audit trail.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Compact Trust & Security Strip ── */}
          <div className="mt-20 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div className="flex items-center justify-center gap-2.5 text-xs text-slate-300 font-medium">
              <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Secure Authentication</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 text-xs text-slate-300 font-medium">
              <Shield className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Role-Based Access</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 text-xs text-slate-300 font-medium">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Smart Banking Tools</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 text-xs text-slate-300 font-medium">
              <Bot className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>BANKO Assistant</span>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          FEATURES SECTION (NEW PREMIUM 6-CARD GRID)
          ────────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-cyan-400">
              <Layers className="w-3.5 h-3.5" />
              <span>Core Banking Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Everything You Need for Smarter Banking
            </h2>
            <p className="text-base text-slate-300 font-normal">
              One intelligent platform for understanding, managing, and planning your personal finances
              with automated insight and complete control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: Smart Dashboard */}
            <TiltCard
              className="group p-7 bg-[#060E24]/80 border border-blue-900/40 hover:border-cyan-500/50 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between"
              glowColor="rgba(6, 182, 212, 0.2)"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all mb-5">
                  <PieChart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  Smart Dashboard
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                  See your balance, income, expenses, savings, and recent banking activity in one clear,
                  consolidated view.
                </p>

                {/* Interactive Mini-Visual on Card */}
                <div className="p-3.5 rounded-xl bg-[#030712]/70 border border-slate-800/80 mb-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Net Wealth:</span>
                    <span className="font-bold text-white tabular-nums">₹85,420</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full w-[72%]" />
                  </div>
                </div>
              </div>

              <div className="flex items-center text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 gap-1 pt-2">
                <span>View Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </TiltCard>

            {/* Card 2: Money Transfer */}
            <TiltCard
              className="group p-7 bg-[#060E24]/80 border border-blue-900/40 hover:border-cyan-500/50 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between"
              glowColor="rgba(59, 130, 246, 0.2)"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 group-hover:scale-110 transition-all mb-5">
                  <ArrowLeftRight className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  Money Transfer
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                  Transfer money and track the status of your transactions through a clear, verified, and secure
                  workflow.
                </p>

                {/* Transfer Pipeline Visual: Account A -> ₹ -> Account B */}
                <div className="p-3.5 rounded-xl bg-[#030712]/70 border border-slate-800/80 mb-4 flex items-center justify-between text-xs">
                  <div className="text-center">
                    <span className="block text-[10px] text-slate-400 font-medium">From</span>
                    <span className="font-bold text-slate-200">Acc ···7890</span>
                  </div>
                  <div className="flex items-center gap-1 text-cyan-400 px-2 py-1 bg-cyan-950/40 rounded-lg border border-cyan-500/20">
                    <span className="font-bold">₹</span>
                    <ArrowRight className="w-3 h-3 animate-pulse" />
                  </div>
                  <div className="text-center">
                    <span className="block text-[10px] text-slate-400 font-medium">To</span>
                    <span className="font-bold text-slate-200">Acc ···3421</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 gap-1 pt-2">
                <span>Transfer Funds</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </TiltCard>

            {/* Card 3: Spending Analysis */}
            <TiltCard
              className="group p-7 bg-[#060E24]/80 border border-blue-900/40 hover:border-cyan-500/50 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between"
              glowColor="rgba(245, 158, 11, 0.2)"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 group-hover:scale-110 transition-all mb-5">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  Spending Analysis
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                  Understand your spending patterns with categorical distributions, charts, and actionable
                  financial insights.
                </p>

                {/* Spending Chart Bars Animation */}
                <div className="p-3.5 rounded-xl bg-[#030712]/70 border border-slate-800/80 mb-4 flex items-end justify-between h-14 gap-2 px-4">
                  <div className="w-full flex flex-col items-center gap-1">
                    <div className="w-full bg-blue-500 rounded-t h-8 group-hover:h-10 transition-all duration-300" />
                    <span className="text-[9px] text-slate-400">Shop</span>
                  </div>
                  <div className="w-full flex flex-col items-center gap-1">
                    <div className="w-full bg-cyan-400 rounded-t h-6 group-hover:h-8 transition-all duration-300" />
                    <span className="text-[9px] text-slate-400">Food</span>
                  </div>
                  <div className="w-full flex flex-col items-center gap-1">
                    <div className="w-full bg-indigo-500 rounded-t h-4 group-hover:h-6 transition-all duration-300" />
                    <span className="text-[9px] text-slate-400">Bills</span>
                  </div>
                  <div className="w-full flex flex-col items-center gap-1">
                    <div className="w-full bg-slate-600 rounded-t h-3 group-hover:h-5 transition-all duration-300" />
                    <span className="text-[9px] text-slate-400">Misc</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 gap-1 pt-2">
                <span>Analyze Spending</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </TiltCard>

            {/* Card 4: Savings Goals */}
            <TiltCard
              className="group p-7 bg-[#060E24]/80 border border-blue-900/40 hover:border-cyan-500/50 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between"
              glowColor="rgba(16, 185, 129, 0.2)"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all mb-5">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  Savings Goals
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                  Create custom savings milestones, track automatic allocations, and reach what matters to you
                  faster.
                </p>

                {/* Animated Goal Progress */}
                <div className="p-3.5 rounded-xl bg-[#030712]/70 border border-slate-800/80 mb-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">Laptop Fund</span>
                    <span className="text-emerald-400 font-bold tabular-nums">₹35,000 / ₹60,000</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[58%] group-hover:w-[65%] transition-all duration-500" />
                  </div>
                </div>
              </div>

              <div className="flex items-center text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 gap-1 pt-2">
                <span>Explore Goals</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </TiltCard>

            {/* Card 5: EMI & Interest Calculator */}
            <TiltCard
              className="group p-7 bg-[#060E24]/80 border border-blue-900/40 hover:border-cyan-500/50 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between"
              glowColor="rgba(139, 92, 246, 0.2)"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/20 group-hover:scale-110 transition-all mb-5">
                  <Calculator className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  EMI & Interest Calculator
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                  Calculate monthly EMI, interest rates, and total repayment schedules before committing to loans.
                </p>

                {/* Calculation Quick Preview */}
                <div className="p-3.5 rounded-xl bg-[#030712]/70 border border-slate-800/80 mb-4 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">₹5,00,000 @ 8.5% (2 Yrs)</span>
                    <span className="font-bold text-purple-300 text-sm tabular-nums">₹22,732 / mo</span>
                  </div>
                  <span className="px-2 py-1 rounded bg-purple-900/40 text-purple-300 text-[10px] font-semibold border border-purple-500/30">
                    Calculated
                  </span>
                </div>
              </div>

              <div className="flex items-center text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 gap-1 pt-2">
                <span>Calculate Repayment</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </TiltCard>

            {/* Card 6: BANKO AI */}
            <TiltCard
              className="group p-7 bg-[#060E24]/80 border border-cyan-500/30 hover:border-cyan-400 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between shadow-[0_0_25px_rgba(6,182,212,0.1)]"
              glowColor="rgba(6, 182, 212, 0.3)"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-300 group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all mb-5">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  BANKO AI
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                  Ask BANKO in plain language about your balance, expenditures, recurring bills, and financial queries.
                </p>

                {/* AI Pulse Simulation */}
                <div className="p-3.5 rounded-xl bg-[#030712]/70 border border-cyan-500/20 mb-4 flex items-center gap-3 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-slate-300 italic">"How much can I safely save this month?"</span>
                </div>
              </div>

              <div className="flex items-center text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 gap-1 pt-2">
                <span>Chat with BANKO</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          HOW IT WORKS — ANIMATED JOURNEY (4-STEP DIGITAL STORY)
          ────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 relative z-10 bg-[#020617]/60 border-y border-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400">
              <Zap className="w-3.5 h-3.5" />
              <span>Step-by-Step Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              How BANKO Works
            </h2>
            <p className="text-base text-slate-300 font-normal">
              From secure registration to autonomous assistance, your financial ecosystem is synchronized
              in four seamless steps.
            </p>
          </div>

          {/* Connected Step Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div
              onClick={() => setActiveStep(1)}
              className={`p-6 rounded-2xl border backdrop-blur-xl transition-all cursor-pointer relative ${
                activeStep === 1
                  ? 'bg-blue-950/60 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.25)]'
                  : 'bg-[#060E24]/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="text-3xl font-extrabold text-cyan-400/40 mb-2 font-mono">01</div>
              <h3 className="text-lg font-bold text-white mb-2">Register</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Create your verified banking profile with institutional email authentication.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-cyan-300">
                <span>Account Setup</span>
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              </div>
            </div>

            {/* Step 2 */}
            <div
              onClick={() => setActiveStep(2)}
              className={`p-6 rounded-2xl border backdrop-blur-xl transition-all cursor-pointer relative ${
                activeStep === 2
                  ? 'bg-blue-950/60 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.25)]'
                  : 'bg-[#060E24]/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="text-3xl font-extrabold text-blue-400/40 mb-2 font-mono">02</div>
              <h3 className="text-lg font-bold text-white mb-2">Login</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Authenticate with cryptographic credential validation and session token protection.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-blue-300">
                <span>Credential Auth</span>
                <Lock className="w-4 h-4 text-blue-400" />
              </div>
            </div>

            {/* Step 3 */}
            <div
              onClick={() => setActiveStep(3)}
              className={`p-6 rounded-2xl border backdrop-blur-xl transition-all cursor-pointer relative ${
                activeStep === 3
                  ? 'bg-blue-950/60 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.25)]'
                  : 'bg-[#060E24]/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="text-3xl font-extrabold text-indigo-400/40 mb-2 font-mono">03</div>
              <h3 className="text-lg font-bold text-white mb-2">Manage Your Money</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Track balances, initiate transfers, monitor categories, and manage savings goals.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-indigo-300">
                <span>Live Management</span>
                <Activity className="w-4 h-4 text-indigo-400" />
              </div>
            </div>

            {/* Step 4 */}
            <div
              onClick={() => setActiveStep(4)}
              className={`p-6 rounded-2xl border backdrop-blur-xl transition-all cursor-pointer relative ${
                activeStep === 4
                  ? 'bg-blue-950/60 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.25)]'
                  : 'bg-[#060E24]/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="text-3xl font-extrabold text-cyan-400/40 mb-2 font-mono">04</div>
              <h3 className="text-lg font-bold text-white mb-2">Ask BANKO</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Converse naturally with BANKO for smart queries, calculations, and financial recommendations.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-cyan-300">
                <span>AI Assistance</span>
                <Bot className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
          </div>

          {/* Step Detail Interactive Viewport */}
          <div className="mt-8 p-6 rounded-2xl bg-[#060E24]/80 border border-blue-900/40 backdrop-blur-xl">
            {activeStep === 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="text-base font-bold text-white">Step 1: Rapid Institutional Onboarding</h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    Accepts MLRIT student IDs, student emails, and standard account registrations. Generates
                    instant Savings and Current accounts with mock routing numbers and initial deposits.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shrink-0"
                >
                  Create Account Now
                </button>
              </div>
            )}
            {activeStep === 2 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="text-base font-bold text-white">Step 2: Two-Factor Guarded Gate</h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    Secure login with instant password reveal toggles, persistent session state, and separate
                    administrative clearance credentials.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('login')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shrink-0"
                >
                  Go to Login
                </button>
              </div>
            )}
            {activeStep === 3 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="text-base font-bold text-white">Step 3: Centralized Operations Console</h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    Real-time balance deduction, IMPS reference generation, automated categorization, and monthly budget
                    health checks.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shrink-0"
                >
                  Preview Dashboard
                </button>
              </div>
            )}
            {activeStep === 4 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="text-base font-bold text-white">Step 4: Continuous Natural Language Advisory</h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    BANKO continuously parses your ledger to answer questions such as "Where did I spend the most?",
                    "How much can I save?", or "Simulate my laptop savings plan".
                  </p>
                </div>
                <a
                  href="#banko-showcase"
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shrink-0"
                >
                  Try BANKO Below
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          MEET BANKO SHOWCASE (INTERACTIVE CONVERSATIONAL LAB)
          ────────────────────────────────────────────────────────── */}
      <section id="banko-showcase" className="py-24 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-xs font-semibold text-cyan-400">
              <Bot className="w-3.5 h-3.5" />
              <span>Interactive Banking Intelligence</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Meet BANKO
            </h2>
            <p className="text-base text-slate-300 font-normal">
              Your Smart Banking Assistant is always ready to summarize balances, calculate EMI, and optimize your budget.
            </p>
          </div>

          {/* Interactive Chat Console Window */}
          <div className="rounded-2xl bg-[#060E24]/90 border border-blue-900/50 shadow-2xl backdrop-blur-2xl overflow-hidden">
            {/* Console Header */}
            <div className="px-6 py-4 bg-[#030712]/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    BANKO Assistant
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-[10px] text-slate-400">Autonomous Banking Intelligence Engine</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  Demo Sandbox
                </span>
              </div>
            </div>

            {/* Chat Body */}
            <div className="p-6 space-y-4 min-h-[280px] max-h-[360px] overflow-y-auto">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-blue-900/60 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-[#0B1739] text-slate-200 border border-blue-900/40 rounded-tl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="block text-[9px] text-slate-400 mt-1 text-right">{msg.time}</span>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-lg bg-blue-900/60 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-[#0B1739] border border-blue-900/40 text-cyan-400 text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[11px] text-slate-400 ml-2">BANKO is analyzing financial ledger...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Questions Interactive Selector */}
            <div className="p-4 bg-[#030712]/90 border-t border-slate-800 space-y-2">
              <div className="text-[11px] text-slate-400 font-medium">Click to ask BANKO:</div>
              <div className="flex flex-wrap gap-2">
                {[
                  "What's my balance?",
                  'Show my transactions',
                  'Where did I spend the most?',
                  'How much can I save?',
                  'Calculate my EMI'
                ].map((q, idx) => (
                  <button
                    key={idx}
                    disabled={isTyping}
                    onClick={() => handleQuickQuestion(q)}
                    className="px-3 py-1.5 text-xs rounded-xl bg-slate-900/80 hover:bg-blue-900/60 border border-blue-900/40 hover:border-cyan-400/50 text-slate-300 hover:text-white transition-all disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          FINANCIAL INSIGHT & DASHBOARD VISUALIZATION
          ────────────────────────────────────────────────────────── */}
      <section className="py-24 relative z-10 bg-[#020617]/50 border-t border-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Real-Time Financial Telemetry</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Understand Your Money
            </h2>
            <p className="text-base text-slate-300 font-normal">
              High-fidelity breakdown of accounts, cash inflow, expenditures, and net surplus.
            </p>
          </div>

          {/* Metric Overview Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="p-6 rounded-2xl bg-[#060E24]/80 border border-blue-900/40 backdrop-blur-xl">
              <div className="text-xs text-slate-400 font-medium">Consolidated Balance</div>
              <div className="text-2xl font-extrabold text-white mt-1 tabular-nums">₹85,420</div>
              <div className="text-[11px] text-cyan-400 mt-2 flex items-center gap-1">
                <span>Savings & Current Accounts</span>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-[#060E24]/80 border border-blue-900/40 backdrop-blur-xl">
              <div className="text-xs text-slate-400 font-medium">Monthly Inflow</div>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1 tabular-nums">₹45,000</div>
              <div className="text-[11px] text-emerald-300 mt-2 flex items-center gap-1">
                <span>Scholarships & Deposits</span>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-[#060E24]/80 border border-blue-900/40 backdrop-blur-xl">
              <div className="text-xs text-slate-400 font-medium">Monthly Outflow</div>
              <div className="text-2xl font-extrabold text-amber-400 mt-1 tabular-nums">₹22,400</div>
              <div className="text-[11px] text-amber-300 mt-2 flex items-center gap-1">
                <span>Shopping, Dining, Bills</span>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-[#060E24]/80 border border-blue-900/40 backdrop-blur-xl">
              <div className="text-xs text-slate-400 font-medium">Net Savings Rate</div>
              <div className="text-2xl font-extrabold text-cyan-400 mt-1 tabular-nums">₹22,600</div>
              <div className="text-[11px] text-cyan-300 mt-2 flex items-center gap-1">
                <span>50.2% Inflow Retained</span>
              </div>
            </div>
          </div>

          {/* Spending Category Distribution */}
          <div className="p-8 rounded-2xl bg-[#060E24]/80 border border-blue-900/40 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Monthly Expense Distribution</h3>
                <p className="text-xs text-slate-300">
                  Categorized transactions verified by BANKO algorithmic classification.
                </p>
              </div>
              <span className="text-[11px] px-3 py-1 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                Example Dashboard Data
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">Shopping & Electronics</span>
                  <span className="text-white font-bold tabular-nums">₹8,200 (36.6%)</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[36.6%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">Food, Groceries & Dining</span>
                  <span className="text-white font-bold tabular-nums">₹6,800 (30.3%)</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full w-[30.3%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">Transit & Travel</span>
                  <span className="text-white font-bold tabular-nums">₹3,400 (15.2%)</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-400 h-full w-[15.2%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">Utilities, Subscriptions & Bills</span>
                  <span className="text-white font-bold tabular-nums">₹2,800 (12.5%)</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-purple-400 h-full w-[12.5%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">Other & Uncategorized</span>
                  <span className="text-white font-bold tabular-nums">₹1,200 (5.4%)</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-slate-500 h-full w-[5.4%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SAVINGS VISUALIZATION (TURN GOALS INTO PROGRESS)
          ────────────────────────────────────────────────────────── */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
              <Target className="w-3.5 h-3.5" />
              <span>Goal Acceleration Engine</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Turn Goals Into Progress
            </h2>
            <p className="text-base text-slate-300 font-normal">
              Automated savings rules and visual milestones that keep your future clearly in sight.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Goal 1: Laptop Fund */}
            <div className="p-8 rounded-2xl bg-[#060E24]/80 border border-blue-900/40 backdrop-blur-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-cyan-400">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Laptop Fund</h3>
                    <span className="text-xs text-slate-400">Target Date: December 2026</span>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-cyan-400">58%</span>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Saved: ₹35,000</span>
                  <span className="text-slate-200 font-bold">Goal: ₹60,000</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 h-full w-[58%]" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Remaining: ₹25,000</span>
                <span className="text-cyan-400 font-medium">On track (₹8,000/mo)</span>
              </div>
            </div>

            {/* Goal 2: Emergency Reserve */}
            <div className="p-8 rounded-2xl bg-[#060E24]/80 border border-blue-900/40 backdrop-blur-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Emergency Reserve</h3>
                    <span className="text-xs text-slate-400">Target Date: Ongoing Security</span>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-emerald-400">72%</span>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Saved: ₹18,000</span>
                  <span className="text-slate-200 font-bold">Goal: ₹25,000</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[72%]" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Remaining: ₹7,000</span>
                <span className="text-emerald-400 font-medium">Protected Reserve</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          CALCULATOR SHOWCASE (PLAN BEFORE YOU DECIDE)
          ────────────────────────────────────────────────────────── */}
      <section className="py-24 relative z-10 bg-[#020617]/50 border-y border-blue-900/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-400">
              <Calculator className="w-3.5 h-3.5" />
              <span>Predictive Financial Modeling</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Plan Before You Decide
            </h2>
            <p className="text-base text-slate-300 font-normal">
              Test loans and repayment terms in real time with our dynamic EMI calculation engine.
            </p>
          </div>

          <div className="p-8 sm:p-10 rounded-2xl bg-[#060E24]/90 border border-blue-900/50 backdrop-blur-2xl shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Controls: Sliders */}
            <div className="lg:col-span-7 space-y-6">
              {/* Slider 1: Loan Amount */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">Loan Principal</span>
                  <span className="text-cyan-400 font-bold tabular-nums">
                    ₹{loanAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="2000000"
                  step="10000"
                  value={loanAmount}
                  onChange={e => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>₹50,000</span>
                  <span>₹20,00,000</span>
                </div>
              </div>

              {/* Slider 2: Interest Rate */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">Annual Interest Rate</span>
                  <span className="text-cyan-400 font-bold tabular-nums">{interestRate}% p.a.</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="20"
                  step="0.25"
                  value={interestRate}
                  onChange={e => setInterestRate(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>5%</span>
                  <span>20%</span>
                </div>
              </div>

              {/* Slider 3: Tenure Months */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">Tenure Duration</span>
                  <span className="text-cyan-400 font-bold tabular-nums">{tenureMonths} Months</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="60"
                  step="6"
                  value={tenureMonths}
                  onChange={e => setTenureMonths(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>6 Mo</span>
                  <span>60 Mo</span>
                </div>
              </div>
            </div>

            {/* Right Display: EMI Output */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#030712]/90 border border-blue-900/40 text-center space-y-5">
              <div>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  Monthly Installment (EMI)
                </span>
                <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mt-1 tabular-nums">
                  ₹{emiResults.monthlyEMI.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Interest:</span>
                  <span className="text-slate-200 font-bold tabular-nums">
                    ₹{emiResults.totalInterest.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Repayment:</span>
                  <span className="text-cyan-400 font-bold tabular-nums">
                    ₹{emiResults.totalPayment.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Open Full Calculator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECURITY SECTION (BUILT AROUND SECURITY)
          ────────────────────────────────────────────────────────── */}
      <section id="security" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400">
              <Shield className="w-3.5 h-3.5" />
              <span>Multi-Layer Defense</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Built Around Security
            </h2>
            <p className="text-base text-slate-300 font-normal">
              Every operation, balance check, and transfer is guarded by cryptographic isolation and strict audit controls.
            </p>
          </div>

          {/* Central Shield Graphic + 6 Security Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#060E24]/80 border border-blue-900/40 backdrop-blur-xl">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-cyan-400 mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Secure Authentication</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Multi-factor credential validation and hardened session tokens protect all client access.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#060E24]/80 border border-blue-900/40 backdrop-blur-xl">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Role-Based Access</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Rigid permissions isolate end-user banking records from administrative audit oversight.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#060E24]/80 border border-blue-900/40 backdrop-blur-xl">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Protected APIs</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Sensitive operations are verified and handled server-side through structured payloads.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#060E24]/80 border border-blue-900/40 backdrop-blur-xl">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Transaction Validation</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Balance sufficiency checks and recipient routing confirmation precede each wire execution.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#060E24]/80 border border-blue-900/40 backdrop-blur-xl">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Data Isolation</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Users access strictly their own ledger with zero leakage across cross-account tenancy.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#060E24]/80 border border-blue-900/40 backdrop-blur-xl">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Password Protection</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Passwords are never displayed in the clear or logged to insecure client repositories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          ABOUT THE PROJECT (MLRIT STUDENT ACADEMIC CREDITS)
          ────────────────────────────────────────────────────────── */}
      <section id="about" className="py-24 relative z-10 bg-[#020617]/60 border-t border-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
              <Landmark className="w-3.5 h-3.5" />
              <span>Academic Engineering Heritage</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              About the Project
            </h2>
            <p className="text-base text-slate-300 font-normal">
              Smart Banking Assistant was conceptualized, architected, and built by Computer Science &
              Engineering (Data Science) students at Marri Laxman Reddy Institute of Technology (MLRIT).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Student 1: Vamshi Krishna */}
            <div className="p-7 rounded-2xl bg-[#060E24]/80 border border-blue-900/40 backdrop-blur-xl text-center space-y-3 relative overflow-hidden group hover:border-cyan-500/50 transition-all">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 p-[2px] shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full rounded-full bg-[#030712] flex items-center justify-center text-lg font-bold text-white">
                  VK
                </div>
              </div>
              <h3 className="text-base font-bold text-white">Vamshi Krishna</h3>
              <div className="text-xs text-cyan-400 font-mono font-medium">Roll No: 25R21A67B5</div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-semibold text-cyan-300">
                Branch: Data Science (CSE-DS)
              </div>
              <p className="text-xs text-slate-400 font-normal">25r21a67b5@mlrit.ac.in</p>
              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-300">
                Lead Architect & AI Systems
              </div>
            </div>

            {/* Student 2: Abhiram */}
            <div className="p-7 rounded-2xl bg-[#060E24]/80 border border-blue-900/40 backdrop-blur-xl text-center space-y-3 relative overflow-hidden group hover:border-blue-500/50 transition-all">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 p-[2px] shadow-lg shadow-blue-500/20">
                <div className="w-full h-full rounded-full bg-[#030712] flex items-center justify-center text-lg font-bold text-white">
                  AB
                </div>
              </div>
              <h3 className="text-base font-bold text-white">Abhiram</h3>
              <div className="text-xs text-cyan-400 font-mono font-medium">Roll No: 25R21A67A0</div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-[11px] font-semibold text-blue-300">
                Branch: Data Science (CSE-DS)
              </div>
              <p className="text-xs text-slate-400 font-normal">25r21a67A0@mlrit.ac.in</p>
              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-300">
                Core Banking Engine & Data Schema
              </div>
            </div>

            {/* Student 3: Priyanshu */}
            <div className="p-7 rounded-2xl bg-[#060E24]/80 border border-blue-900/40 backdrop-blur-xl text-center space-y-3 relative overflow-hidden group hover:border-teal-500/50 transition-all">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-cyan-600 to-teal-500 p-[2px] shadow-lg shadow-teal-500/20">
                <div className="w-full h-full rounded-full bg-[#030712] flex items-center justify-center text-lg font-bold text-white">
                  PR
                </div>
              </div>
              <h3 className="text-base font-bold text-white">Priyanshu</h3>
              <div className="text-xs text-cyan-400 font-mono font-medium">Roll No: 25R21A6779</div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-[11px] font-semibold text-teal-300">
                Branch: Data Science (CSE-DS)
              </div>
              <p className="text-xs text-slate-400 font-normal">25r21a6779@mlrit.ac.in</p>
              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-300">
                Security Engineering & UI/UX
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          FINAL CALL TO ACTION
          ────────────────────────────────────────────────────────── */}
      <section className="py-24 relative z-10 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-cyan-500/15 to-indigo-600/10 rounded-3xl blur-2xl" />

          <div className="relative p-12 sm:p-16 rounded-3xl bg-[#060E24]/90 border border-blue-800/40 backdrop-blur-2xl shadow-2xl space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Bot className="w-9 h-9 text-white" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Bank Smarter?
            </h2>

            <p className="text-base text-slate-300 max-w-xl mx-auto font-normal">
              Explore your finances with a smarter digital banking experience powered by BANKO. Take
              control of your transactions, goals, and savings today.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => onNavigate('register')}
                className="px-8 py-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#banko-showcase"
                className="px-8 py-4 rounded-xl font-medium text-sm text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition-all"
              >
                Meet BANKO
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          DARK TECH FOOTER
          ────────────────────────────────────────────────────────── */}
      <footer className="pt-16 pb-12 bg-[#020617] border-t border-slate-900 relative z-10 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Col 1: Brand Info */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                  B
                </div>
                <span className="text-base font-bold text-white tracking-tight">BANKO</span>
              </div>
              <p className="text-slate-400 leading-relaxed font-normal">
                Smart Banking Assistant. An autonomous financial intelligence platform built for modern personal banking.
              </p>
              <div className="text-[11px] text-cyan-400 font-medium">
                Developed by MLRIT CSE (Data Science) Students: Vamshi Krishna, Abhiram, Priyanshu
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white">Platform</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#hero" className="hover:text-cyan-400 transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-cyan-400 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#banko-showcase" className="hover:text-cyan-400 transition-colors">
                    Meet BANKO
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Security & About */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white">Security & Project</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#security" className="hover:text-cyan-400 transition-colors">
                    Security Architecture
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-cyan-400 transition-colors">
                    About MLRIT Project
                  </a>
                </li>
                <li>
                  <button onClick={() => onNavigate('login')} className="hover:text-cyan-400 transition-colors">
                    User Login
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('admin')} className="hover:text-cyan-400 transition-colors">
                    Admin Portal
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Academic Disclosure */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white">Academic Details</h4>
              <p className="text-slate-400 leading-relaxed text-[11px] font-normal">
                Marri Laxman Reddy Institute of Technology (Autonomous), Dundigal, Hyderabad. Department of
                Computer Science and Engineering (Data Science).
              </p>
              <div className="pt-2">
                <span className="inline-block px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                  Demo Simulation Environment
                </span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <div>
              © 2026 Smart Banking Assistant (SBA) — Powered by BANKO. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Security Standards</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
