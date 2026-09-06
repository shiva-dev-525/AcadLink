import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserCheck, 
  Building2, 
  GraduationCap, 
  Landmark, 
  ArrowRight, 
  CheckCircle2, 
  Server,
  RefreshCw,
  Check,
  ChevronRight,
  User,
  Zap,
  BarChart2,
  TrendingUp,
  BookOpen,
  Briefcase,
  Star
} from 'lucide-react';
import { healthService } from '../services/api';

// ─── Scroll Reveal Hook (respects prefers-reduced-motion) ───────────────────
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      setIsRevealed(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isRevealed };
}

// ─── Career Journey sequential-reveal hook ────────────────────────────────
function useJourneyReveal(total) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(Array(total).fill(false));
  const hasRun = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      setRevealed(Array(total).fill(true));
      return;
    }

    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          for (let i = 0; i < total; i++) {
            setTimeout(() => {
              setRevealed(prev => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, i * 110);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [total]);

  return { ref, revealed };
}

// ─── Career Growth Journey Component ──────────────────────────────────────
function CareerJourney({ stages }) {
  const { ref, revealed } = useJourneyReveal(stages.length);
  const anyRevealed = revealed.some(Boolean);

  return (
    <section ref={ref} className="pt-10 sm:pt-16 pb-4">
      {/* Section header */}
      <div 
        className="text-center mb-10 transition-all duration-500 ease-out"
        style={{
          opacity: anyRevealed ? 1 : 0,
          transform: anyRevealed ? 'translateY(0)' : 'translateY(15px)',
        }}
      >
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
          Student Growth Journey
        </span>
        <h2 className="text-2xl font-bold text-white mt-1 tracking-tight">
          From Profile to Career — One Connected Path
        </h2>
        <p className="text-xs text-slate-400 mt-2 max-w-xl mx-auto leading-relaxed">
          Build your profile. Discover your strengths. Close your skill gaps. Move toward the right opportunities.
        </p>
      </div>

      {/* Desktop: horizontal journey */}
      <div className="hidden md:flex items-start justify-between relative">
        {/* Connecting line behind the stages */}
        <div className="absolute top-[2.25rem] left-8 right-8 h-px bg-slate-800 z-0" />

        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isRevealed = revealed[idx];
          const isAccent = stage.accent;

          return (
            <div
              key={stage.id}
              className="relative z-10 flex flex-col items-center text-center group"
              style={{
                flex: '1 1 0%',
                opacity: isRevealed ? 1 : 0,
                transform: isRevealed ? 'translateY(0)' : 'translateY(14px)',
                transition: 'opacity 0.38s cubic-bezier(0.16,1,0.3,1), transform 0.38s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              {/* Icon node */}
              <div
                className={`w-[3rem] h-[3rem] rounded-xl flex items-center justify-center mb-3 border transition-all duration-200 group-hover:-translate-y-1 ${
                  isAccent
                    ? 'bg-indigo-950/70 border-indigo-700/60 text-cyan-400 shadow-lg shadow-indigo-950/40'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Stage number dot on connector line */}
              <span className="absolute top-[1.8rem] -translate-y-1/2 w-2 h-2 rounded-full border-2 border-slate-700 bg-slate-900" />

              {/* Title */}
              <span
                className={`text-sm font-semibold mb-1 ${
                  isAccent ? 'text-white' : 'text-slate-300'
                }`}
              >
                {stage.title}
              </span>

              {/* Description */}
              <p className="text-[11px] text-slate-500 leading-snug max-w-[7.5rem]">
                {stage.desc}
              </p>

              {/* Arrow connector (not on last item) */}
              {idx < stages.length - 1 && (
                <div className="absolute top-[2.25rem] -right-3 z-20 text-slate-700">
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                    <path d="M0 5H12M8 1L12 5L8 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical timeline */}
      <div className="flex flex-col md:hidden gap-0">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isRevealed = revealed[idx];
          const isAccent = stage.accent;
          const isLast = idx === stages.length - 1;

          return (
            <div
              key={stage.id}
              className="flex items-stretch gap-4"
              style={{
                opacity: isRevealed ? 1 : 0,
                transform: isRevealed ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 0.35s cubic-bezier(0.16,1,0.3,1), transform 0.35s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              {/* Left: icon + vertical line */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                    isAccent
                      ? 'bg-indigo-950/70 border-indigo-700/60 text-cyan-400'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>
                {!isLast && (
                  <div className="w-px flex-1 bg-slate-800 my-1 min-h-[1.5rem]" />
                )}
              </div>

              {/* Right: text */}
              <div className="pb-5">
                <span
                  className={`text-sm font-semibold ${
                    isAccent ? 'text-white' : 'text-slate-300'
                  }`}
                >
                  {stage.title}
                </span>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                  {stage.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function LandingPage() {
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const { ref: rolesRef, isRevealed: rolesRevealed } = useScrollReveal(0.12);
  const { ref: telemetryRef, isRevealed: telemetryRevealed } = useScrollReveal(0.15);

  const testApiHealth = async () => {
    setLoading(true);
    try {
      const data = await healthService.checkHealth();
      setApiResponse({ success: true, data });
    } catch (err) {
      setApiResponse({ 
        success: false, 
        message: err.message || 'Could not connect to backend server on port 5000' 
      });
    } finally {
      setLoading(false);
    }
  };

  const userRoles = [
    {
      id: 'student',
      title: 'Student',
      icon: UserCheck,
      badge: 'Hero Workflow',
      tagline: 'Diagnose skill gaps & apply to matched internships',
      description: 'Assess technical and soft skills through objective benchmarks, identify exact curriculum deficiencies, access learning roadmaps, and apply to vetted industry opportunities with a verified digital portfolio.',
      features: [
        'Objective Technical MCQs',
        'Visual Skill-Gap Engine',
        'Curated Remedial Roadmaps',
        'Verified Digital Portfolio'
      ],
      link: '/register',
      ctaText: 'Register as Student'
    },
    {
      id: 'industry',
      title: 'Industry Partner',
      icon: Building2,
      badge: 'Recruitment Hub',
      tagline: 'Source pre-assessed talent matching exact skill needs',
      description: 'Publish internships and entry-level positions with fine-grained skill prerequisites. Access a deterministic candidate ranking pipeline and directly manage applicants through structured lifecycle stages.',
      features: [
        'Role & Prerequisite Builder',
        '5-Factor Candidate Matching',
        'Pre-Assessed Talent Pipeline',
        'Application Status Kanban'
      ],
      link: '/register',
      ctaText: 'Register as Industry'
    },
    {
      id: 'academician',
      title: 'Academician',
      icon: GraduationCap,
      badge: 'Faculty Network',
      tagline: 'Engage in industry projects, FDPs & research',
      description: 'Bridge classroom curriculum with market evolution. Discover Faculty Development Programs (FDPs), industry-sponsored consultancy opportunities, and joint research collaborations.',
      features: [
        'Faculty Development Programs',
        'Industrial Training Modules',
        'Joint Research Proposals',
        'Student Industry Mentorship'
      ],
      link: '/register',
      ctaText: 'Register as Faculty'
    },
    {
      id: 'institution',
      title: 'Institution / Admin',
      icon: Landmark,
      badge: 'Cohort Analytics',
      tagline: 'Track cohort readiness & realign curriculum',
      description: 'Gain institutional-level visibility into student cohort competencies. Compare graduating class skills against live industry demand, identify curriculum deficits, and monitor placement progress.',
      features: [
        'Cohort Placement Readiness KPIs',
        'Skill Demand vs Gap Visuals',
        'Departmental Placement Funnel',
        'Industry Partnership Management'
      ],
      link: '/register',
      ctaText: 'Register as Institution'
    }
  ];

  const journeyStages = [
    {
      id: 'profile',
      icon: User,
      title: 'Profile',
      desc: 'Build a verified academic & professional profile.',
      accent: false
    },
    {
      id: 'skills',
      icon: Zap,
      title: 'Skills',
      desc: 'Map your technical and soft skills accurately.',
      accent: true
    },
    {
      id: 'assessment',
      icon: BarChart2,
      title: 'Assessment',
      desc: 'Benchmark competencies with objective diagnostics.',
      accent: true
    },
    {
      id: 'skillgap',
      icon: TrendingUp,
      title: 'Skill Gap',
      desc: 'Identify precise gaps against industry standards.',
      accent: false
    },
    {
      id: 'learning',
      icon: BookOpen,
      title: 'Learning',
      desc: 'Follow curated roadmaps to close every gap.',
      accent: true
    },
    {
      id: 'opportunities',
      icon: Briefcase,
      title: 'Opportunities',
      desc: 'Discover matched internships and entry roles.',
      accent: true
    },
    {
      id: 'career',
      icon: Star,
      title: 'Career',
      desc: 'Apply confidently with a verified portfolio.',
      accent: false
    }
  ];

  return (
    <div className="relative overflow-hidden bg-[#0B0F19] text-slate-100">
      {/* Subtle Background Accent & Grid Dot Pattern */}
      <div className="absolute inset-0 bg-grid-dots pointer-events-none opacity-25"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-950/40 via-cyan-950/10 to-transparent pointer-events-none -z-10"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-20">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-900/90 border border-slate-800 text-slate-300 shadow-xs mb-6 transition-all hover:border-cyan-500/50">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-cyan-300 font-medium">Higher Education & Industry Alignment</span>
            <ChevronRight className="w-3 h-3 text-slate-500" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
            Connect Skills to <br />
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
              High-Impact Opportunities
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
            AcadLink is a centralized, evidence-based platform connecting students, employers, academicians, and universities through continuous skill mapping, objective assessments, and transparent matching.
          </p>

          {/* Primary & Secondary Action CTAs */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-950 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 shadow-xs transition-all duration-150 hover:border-slate-700 hover:text-white"
            >
              Sign In to Account
            </Link>
          </div>

          {/* Micro Trust Proofs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 pt-6 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-cyan-400" />
              <span>Deterministic 5-Factor Scoring</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-cyan-400" />
              <span>Verified Skill Credentials</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-cyan-400" />
              <span>Role-Based Secure Workspaces</span>
            </div>
          </div>
        </section>

        {/* Career Growth Journey — sequential reveal, runs once on scroll into view */}
        <CareerJourney stages={journeyStages} />

        {/* Four User Roles Section with Staggered Scroll Reveal */}
        <section ref={rolesRef} className="space-y-8">
          <div 
            className="text-center max-w-2xl mx-auto transition-all duration-500 ease-out"
            style={{
              opacity: rolesRevealed ? 1 : 0,
              transform: rolesRevealed ? 'translateY(0)' : 'translateY(15px)',
            }}
          >
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Multi-Stakeholder Architecture</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 tracking-tight">Four Coordinated Stakeholder Roles</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Every participant operates within a tailored, role-governed interface engineered to eliminate talent mismatches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {userRoles.map((role, idx) => {
              const Icon = role.icon;
              return (
                <div 
                  key={role.id}
                  className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between shadow-xl card-hover group transition-all duration-500 ease-out"
                  style={{
                    opacity: rolesRevealed ? 1 : 0,
                    transform: rolesRevealed ? 'translateY(0)' : 'translateY(15px)',
                    transitionDelay: `${idx * 80}ms`,
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-indigo-950/60 border border-indigo-800/40 text-cyan-400 flex items-center justify-center transition-all duration-200 group-hover:bg-cyan-500 group-hover:text-slate-950 group-hover:border-cyan-400">
                        <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700/60">
                        {role.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1">{role.title}</h3>
                    <p className="text-xs font-medium text-cyan-400 mb-3">{role.tagline}</p>
                    <p className="text-xs text-slate-400 leading-relaxed mb-5">{role.description}</p>

                    <div className="space-y-2 pt-4 border-t border-slate-800/80">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Core Capabilities</span>
                      <ul className="space-y-2">
                        {role.features.map((feat) => (
                          <li key={feat} className="text-xs text-slate-300 flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80">
                    <Link
                      to={role.link}
                      className="w-full inline-flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-950 hover:bg-indigo-950/60 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all duration-150"
                    >
                      <span>{role.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Live Backend Telemetry Console Card */}
        <section 
          ref={telemetryRef} 
          className="max-w-3xl mx-auto transition-all duration-500 ease-out"
          style={{
            opacity: telemetryRevealed ? 1 : 0,
            transform: telemetryRevealed ? 'translateY(0)' : 'translateY(15px)',
          }}
        >
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 md:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-950 text-cyan-400 border border-slate-800 flex items-center justify-center shadow-xs">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">API Health & Telemetry Check</h3>
                  <p className="text-xs text-slate-400">Live verified ping to backend REST endpoints on port 5000</p>
                </div>
              </div>

              <button
                onClick={testApiHealth}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors disabled:opacity-50 border border-slate-700"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Pinging Gateway...' : 'Ping /api/health'}</span>
              </button>
            </div>

            <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-x-auto border border-slate-800/80 shadow-inner">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[10px] text-slate-500 mb-2">
                <span>GATEWAY CONSOLE</span>
                <span>STATUS: {apiResponse ? (apiResponse.success ? '200 OK' : 'FAILED') : 'IDLE'}</span>
              </div>
              {apiResponse ? (
                <pre className={apiResponse.success ? 'text-emerald-400' : 'text-rose-400'}>
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              ) : (
                <p className="text-slate-500">
                  Ready. Click &quot;Ping /api/health&quot; to test real-time communication with the Express server.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
