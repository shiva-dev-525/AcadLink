import React, { useState, useEffect, useRef } from 'react';
import aiService from '../../services/aiService';
import studentService from '../../services/studentService';
import skillGapService from '../../services/skillGapService';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Target,
  RefreshCw,
  HelpCircle,
  Compass,
  TrendingUp,
  Award,
} from 'lucide-react';

const STARTER_PROMPTS = [
  'What skills should I prioritize to improve my career readiness?',
  'How can I prepare for a technical software developer internship?',
  'What should I learn next based on my current skill gaps?',
  'How do I bridge the gap between academic theory and industry expectations?',
];

export default function CareerAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am your AI Career & Skills Advisor. I analyze your declared profile, verified assessments, and identified skill gaps to offer actionable career guidance.\n\nAsk me about upskilling roadmaps, interview preparation, or which opportunities best fit your profile.',
      recommendedFocusSkills: ['REST APIs', 'Git', 'Testing'],
      actionableSteps: [
        'Review your identified skill gaps in the Skill Gap tab.',
        'Complete pending technical assessments to earn verified badges.',
        'Explore recommended internship opportunities matching your career goal.',
      ],
      encouragement: 'Ask a question below or pick one of the recommended starter topics!',
      timestamp: new Date(),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileSummary, setProfileSummary] = useState(null);
  const chatBottomRef = useRef(null);

  // Load student context summary for top banner
  useEffect(() => {
    let isMounted = true;
    const fetchContext = async () => {
      try {
        const [profileRes, gapRes] = await Promise.all([
          studentService.getProfile().catch(() => null),
          skillGapService.getMySkillGaps().catch(() => null),
        ]);

        if (isMounted) {
          const profile = profileRes?.data?.student || {};
          const gaps = gapRes?.data?.gaps || [];

          setProfileSummary({
            targetGoal: profile.careerInterests?.[0] || 'Software Developer',
            skillsCount: (profile.technicalSkills || []).length,
            topSkills: (profile.technicalSkills || []).slice(0, 3).map((s) => s.name),
            gapCount: gaps.length,
            topGaps: gaps.slice(0, 2).map((g) => g.name),
          });
        }
      } catch {
        // Safe fallback
      }
    };

    fetchContext();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    setError(null);
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputMessage('');
    setLoading(true);

    // Build compact recent history (last 4 items)
    const history = newMessages.slice(-4).map((m) => ({
      sender: m.sender,
      text: m.text,
    }));

    try {
      const response = await aiService.getCareerGuidance(text, history);

      if (response && response.success && response.data) {
        const aiData = response.data;
        const botMsg = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: aiData.reply || 'Here is what I recommend based on your current profile.',
          recommendedFocusSkills: aiData.recommendedFocusSkills || [],
          actionableSteps: aiData.actionableSteps || [],
          encouragement: aiData.encouragement || '',
          source: aiData.source || 'gemini',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        setError(response?.message || 'AI service response was unavailable.');
        // Fallback message
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-fallback-${Date.now()}`,
            sender: 'assistant',
            text: 'I am currently operating in resilient offline mode. Based on standard industry benchmarks, focusing on verified skills, completing your skill gap courses, and reviewing opportunity requirements is the most direct path to internship selection.',
            recommendedFocusSkills: ['REST APIs', 'System Fundamentals'],
            actionableSteps: [
              'Check your current gaps on the Skill Gap page.',
              'Review recommended internships on the Opportunities page.',
            ],
            encouragement: 'You can continue browsing deterministic matching and learning roadmaps!',
            source: 'fallback',
            timestamp: new Date(),
          },
        ]);
      }
    } catch {
      setError('An unexpected error occurred while contacting the AI assistant.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: 'Conversation cleared. How can I assist with your career planning today?',
        timestamp: new Date(),
      },
    ]);
    setError(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-indigo-950/70 border border-indigo-800/60 flex items-center justify-center text-indigo-400 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
              AI Career Assistant
            </h1>
            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-800/60 text-cyan-300">
              Gemini Powered
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Personalized guidance grounded in your verified skills, career goals, and active skill gaps.
          </p>
        </div>

        <button
          onClick={handleClearChat}
          title="Reset conversation"
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs font-medium transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset Chat</span>
        </button>
      </div>

      {/* Top Profile Context Banner */}
      {profileSummary && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 sm:p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-950/50 border border-indigo-800/40 flex items-center justify-center text-indigo-400 shrink-0">
              <Target className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Target Career</span>
              <span className="text-slate-200 font-semibold">{profileSummary.targetGoal}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-950/50 border border-emerald-800/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Award className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Declared Skills</span>
              <span className="text-slate-200 font-semibold">
                {profileSummary.topSkills.join(', ') || `${profileSummary.skillsCount} skills`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-950/50 border border-amber-800/40 flex items-center justify-center text-amber-400 shrink-0">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Active Skill Gaps</span>
              <span className="text-slate-200 font-semibold">
                {profileSummary.topGaps.join(', ') || `${profileSummary.gapCount} identified`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Starter Prompts Carousel */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
          Suggested Questions:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {STARTER_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              disabled={loading}
              className="text-left text-xs bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-slate-300 p-2.5 rounded-xl transition-colors flex items-center justify-between group disabled:opacity-50"
            >
              <span className="truncate pr-2">{prompt}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-3 bg-amber-950/40 border border-amber-800/50 text-amber-300 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Chat Messages Container */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-6 min-h-[420px] max-h-[560px] overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-950/80 border border-indigo-700/50 text-cyan-300 shadow-sm'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-3 ${
                  isUser
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-[#0F172A] border border-slate-800 text-slate-200'
                }`}
              >
                {/* Main Text Body */}
                <p className="whitespace-pre-line text-slate-200">{msg.text}</p>

                {/* Structured Sections (for assistant responses) */}
                {!isUser && msg.recommendedFocusSkills && msg.recommendedFocusSkills.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-400 block">
                      Recommended Focus Skills:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.recommendedFocusSkills.map((sk, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 text-[11px] font-medium"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {!isUser && msg.actionableSteps && msg.actionableSteps.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-400 block">
                      Next Practical Steps:
                    </span>
                    <ul className="space-y-1 text-slate-300 text-xs">
                      {msg.actionableSteps.map((st, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{st}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {!isUser && msg.encouragement && (
                  <div className="pt-1 text-[11px] text-cyan-300/90 font-medium italic">
                    "{msg.encouragement}"
                  </div>
                )}

                {/* Source Badge */}
                {!isUser && (
                  <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500">
                    <span>
                      {msg.source === 'gemini' ? 'Generated via Google Gemini' : 'Curated platform guidance'}
                    </span>
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-950/80 border border-indigo-700/50 text-cyan-300 flex items-center justify-center shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Analyzing profile & formulating guidance...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Box Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 sm:p-3 flex items-center gap-2 focus-within:border-indigo-500/50 transition-colors">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          maxLength={1000}
          placeholder="Ask anything about your skills, roadmap, or career prep (e.g., 'What should I learn next?')..."
          className="flex-1 bg-transparent border-0 resize-none text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none px-2 py-1 max-h-24 overflow-y-auto"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={loading || !inputMessage.trim()}
          className="p-2.5 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white rounded-xl font-semibold text-xs transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
        >
          <span className="hidden sm:inline">Ask AI</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
        <span>AI guidance is tailored to your declared and assessed competencies.</span>
        <span>{inputMessage.length}/1000</span>
      </div>
    </div>
  );
}
