const { GoogleGenAI } = require('@google/genai');
const { buildStudentContext } = require('./aiContextService');
const { buildCareerPrompt } = require('./prompts/careerPrompt');
const { buildSkillGapPrompt } = require('./prompts/skillGapPrompt');
const { buildLearningPrompt } = require('./prompts/learningPrompt');
const { buildOpportunityPrompt } = require('./prompts/opportunityPrompt');
const { buildApplicationPrompt } = require('./prompts/applicationPrompt');
const opportunityService = require('./opportunityService');
const { calculateOpportunityMatch } = require('./matchingService');
const Student = require('../models/Student');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const mongoose = require('mongoose');

/**
 * Gemini AI Service
 *
 * Centralized service managing Google Gemini API interactions with:
 * - Controlled prompt assembly
 * - 5000ms timeout protection
 * - Automatic deterministic fallbacks whenever the API key is missing or offline
 * - Zero hallucination / single-source-of-truth adherence
 */

const GEMINI_TIMEOUT_MS = 5000;
const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

// Initialize SDK client if key is configured
let aiClient = null;
const apiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim();
if (apiKey && apiKey !== 'your_gemini_api_key_here') {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('[GeminiService] Failed to initialize GoogleGenAI client:', err.message);
    aiClient = null;
  }
}

/**
 * Safely parse JSON from LLM output, stripping markdown code fences if present
 */
function cleanAndParseJSON(rawText) {
  if (!rawText) return null;
  let text = rawText.trim();

  // Strip ```json ... ``` or ``` ... ```
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  }

  try {
    return JSON.parse(text);
  } catch {
    // Attempt relaxed parsing or regex extract
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

/**
 * Executes a Gemini prompt with a hard timeout
 */
async function callGemini(promptText) {
  if (!aiClient) {
    return null; // Key missing or client uninitialized -> triggers fallback
  }

  const apiCall = async () => {
    const response = await aiClient.models.generateContent({
      model: DEFAULT_MODEL,
      contents: promptText,
    });
    return response.text;
  };

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Gemini API call timed out after 5000ms')), GEMINI_TIMEOUT_MS)
  );

  try {
    return await Promise.race([apiCall(), timeoutPromise]);
  } catch (err) {
    console.warn('[GeminiService] Live call failed or timed out:', err.message);
    return null;
  }
}

// ==========================================
// DETERMINISTIC FALLBACK RESPONSES
// ==========================================

function getCareerFallback(userMessage, context) {
  return {
    source: 'fallback',
    reply: `Based on your current platform profile and skills, focusing on high-impact full-stack and modern web engineering competencies will yield the fastest career growth. Prioritize verified assessments to convert your self-reported skills into accredited badges, which recruiters value significantly.`,
    recommendedFocusSkills: ['REST APIs', 'TypeScript', 'Git & CI/CD'],
    actionableSteps: [
      'Take the pending technical skill assessments to demonstrate verified proficiency.',
      'Bridge core skill gaps by completing recommended hands-on learning modules.',
      'Apply to high-compatibility internship opportunities matching at 70% or above.',
    ],
    encouragement: 'Every completed assessment and closed skill gap directly improves your opportunity compatibility score!',
  };
}

function getSkillGapFallback(skillName, targetCareer) {
  return {
    source: 'fallback',
    skillName,
    industryRelevance: `${skillName} is a fundamental competency demanded across modern ${targetCareer || 'software engineering'} roles. Industry teams rely on it daily for production scalability, reliable architecture, and collaborative feature delivery.`,
    bridgeStrategy: `Build upon your existing programming foundations by following our structured learning modules and implementing a practical project that showcases ${skillName}.`,
    learningMilestones: [
      `Stage 1: Grasp core fundamentals and syntax of ${skillName}.`,
      `Stage 2: Build a mini feature utilizing ${skillName} with best practices.`,
      `Stage 3: Complete a portfolio-grade project and take the portal verification assessment.`,
    ],
    estimatedEffort: '2 to 3 weeks (approx. 8–10 hours/week)',
  };
}

function getLearningFallback(skillName, resourceTitle, targetCareer) {
  return {
    source: 'fallback',
    skillName,
    studyPlanSummary: `A fast-track hands-on learning roadmap for ${skillName} tailored to prepare you for ${targetCareer || 'industry opportunities'}.`,
    weeklyMilestones: [
      {
        week: 'Week 1',
        focus: `Fundamentals & Setup`,
        deliverable: `Working development environment and first working code example.`,
      },
      {
        week: 'Week 2',
        focus: `Intermediate Patterns & Data Handling`,
        deliverable: `Functional component or API integration handling real data.`,
      },
      {
        week: 'Week 3',
        focus: `Testing & Portfolio Deployment`,
        deliverable: `Clean Git repository with documentation and live demo link.`,
      },
    ],
    portfolioProjectIdea: {
      title: `${skillName} Interactive Dashboard`,
      description: `A responsive web application demonstrating state management, API integration, and clean modular code using ${skillName}.`,
      recommendedStack: [skillName, 'React', 'Tailwind CSS', 'Node.js'],
    },
    pitfallsToAvoid: [
      'Focusing exclusively on passive video tutorials without typing code yourself.',
      'Skipping unit tests and error handling patterns commonly evaluated during technical interviews.',
    ],
  };
}

function getOpportunityFallback(opportunity, matchAnalysis) {
  const matched = matchAnalysis.matchedSkills || [];
  const missing = matchAnalysis.missingSkills || [];

  return {
    source: 'fallback',
    matchOverview: `This ${opportunity.type} at ${opportunity.organization} represents a ${matchAnalysis.matchCategory} (${matchAnalysis.matchScore}%) with strong alignment to your technical background.`,
    primaryStrengths: matched.length
      ? matched.map((s) => `Your proficiency in ${s} directly matches a mandatory prerequisite for this position.`)
      : ['Your educational background aligns with candidate eligibility guidelines.'],
    areasToAddress: missing.length
      ? missing.map((s) => `Developing practical competency in ${s} will significantly increase your interview readiness.`)
      : ['Maintain active practice with your verified technical skills.'],
    interviewTips: [
      `Be prepared to explain architectural decisions and trade-offs made in your past projects.`,
      `Highlight how quickly you learn new tools and your commitment to continuous upskilling.`,
    ],
  };
}

function getApplicationFallback(opportunity, matchAnalysis) {
  return {
    source: 'fallback',
    roleTitle: opportunity.title,
    organization: opportunity.organization,
    preApplicationChecklist: [
      'Ensure your digital portfolio includes links to your best GitHub repositories and live deployments.',
      'Review your verified skills to confirm all recent assessment completions are highlighted.',
      'Tailor your cover letter note to address the specific problem space of ' + opportunity.organization,
    ],
    highPriorityRevisionTopics: (opportunity.requiredSkills || []).slice(0, 4).map(
      (s) => `Core concepts, performance considerations, and real-world patterns in ${s}`
    ),
    sampleInterviewQuestions: [
      {
        question: `How have you utilized ${(opportunity.requiredSkills && opportunity.requiredSkills[0]) || 'modern frameworks'} to solve a technical challenge in a past project?`,
        whatInterviewerLooksFor: 'Clear explanation of problem, your architectural solution, and measurable results.',
      },
      {
        question: `How do you approach debugging when an unexpected production issue or runtime error occurs?`,
        whatInterviewerLooksFor: 'Systematic root-cause analysis, logging, and test validation approach.',
      },
    ],
  };
}

// ==========================================
// EXPORTED AI SERVICE METHODS
// ==========================================

/**
 * 1. AI Career Assistant Conversation
 */
async function generateCareerGuidance(userId, userMessage, conversationHistory = []) {
  const studentContext = await buildStudentContext(userId);
  const prompt = buildCareerPrompt(studentContext, userMessage, conversationHistory);

  const raw = await callGemini(prompt);
  const parsed = cleanAndParseJSON(raw);

  if (parsed && parsed.reply) {
    return {
      source: 'gemini',
      ...parsed,
    };
  }

  return getCareerFallback(userMessage, studentContext);
}

/**
 * 2. AI Skill Gap Explanation
 */
async function explainSkillGap(userId, skillName, targetCareer) {
  const studentContext = await buildStudentContext(userId);
  const prompt = buildSkillGapPrompt(skillName, targetCareer, studentContext);

  const raw = await callGemini(prompt);
  const parsed = cleanAndParseJSON(raw);

  if (parsed && parsed.industryRelevance) {
    return {
      source: 'gemini',
      ...parsed,
    };
  }

  return getSkillGapFallback(skillName, targetCareer);
}

/**
 * 3. AI Learning Guidance
 */
async function generateLearningGuidance(userId, skillName, resourceTitle, targetCareer) {
  const studentContext = await buildStudentContext(userId);
  const prompt = buildLearningPrompt(skillName, resourceTitle, targetCareer, studentContext);

  const raw = await callGemini(prompt);
  const parsed = cleanAndParseJSON(raw);

  if (parsed && parsed.weeklyMilestones) {
    return {
      source: 'gemini',
      ...parsed,
    };
  }

  return getLearningFallback(skillName, resourceTitle, targetCareer);
}

/**
 * 4. AI Opportunity Match Explanation
 */
async function explainOpportunityMatch(userId, opportunityId) {
  // Retrieve opportunity
  let opportunity = null;
  try {
    opportunity = await opportunityService.getOpportunityById(opportunityId);
  } catch (e) {
    const error = new Error('Opportunity not found');
    error.statusCode = 404;
    throw error;
  }
  if (!opportunity) {
    const error = new Error('Opportunity not found');
    error.statusCode = 404;
    throw error;
  }

  // Retrieve student profile & attempts for deterministic match
  let studentProfile = { technicalSkills: [], careerInterests: [] };
  const assessmentScoresMap = new Map();

  if (mongoose.connection.readyState === 1) {
    const student = await Student.findOne({ userId }).lean();
    if (student) studentProfile = student;

    const attempts = await AssessmentAttempt.find({ student: userId, status: 'completed' })
      .populate('assessment', 'skill')
      .lean();

    attempts.forEach((att) => {
      const skill = att.assessment?.skill;
      if (skill) assessmentScoresMap.set(skill.toLowerCase().trim(), att.percentage || 0);
    });
  }

  // Calculate deterministic match
  const matchAnalysis = calculateOpportunityMatch(opportunity, studentProfile, assessmentScoresMap);

  const studentContext = await buildStudentContext(userId);
  const prompt = buildOpportunityPrompt(opportunity, matchAnalysis, studentContext);

  const raw = await callGemini(prompt);
  const parsed = cleanAndParseJSON(raw);

  if (parsed && parsed.matchOverview) {
    return {
      source: 'gemini',
      matchScore: matchAnalysis.matchScore,
      matchCategory: matchAnalysis.matchCategory,
      ...parsed,
    };
  }

  const fallback = getOpportunityFallback(opportunity, matchAnalysis);
  return {
    ...fallback,
    matchScore: matchAnalysis.matchScore,
    matchCategory: matchAnalysis.matchCategory,
  };
}

/**
 * 5. AI Application Guidance
 */
async function generateApplicationGuidance(userId, opportunityId) {
  let opportunity = null;
  try {
    opportunity = await opportunityService.getOpportunityById(opportunityId);
  } catch (e) {
    const error = new Error('Opportunity not found');
    error.statusCode = 404;
    throw error;
  }
  if (!opportunity) {
    const error = new Error('Opportunity not found');
    error.statusCode = 404;
    throw error;
  }

  let studentProfile = { technicalSkills: [], careerInterests: [] };
  const assessmentScoresMap = new Map();

  if (mongoose.connection.readyState === 1) {
    const student = await Student.findOne({ userId }).lean();
    if (student) studentProfile = student;

    const attempts = await AssessmentAttempt.find({ student: userId, status: 'completed' })
      .populate('assessment', 'skill')
      .lean();

    attempts.forEach((att) => {
      const skill = att.assessment?.skill;
      if (skill) assessmentScoresMap.set(skill.toLowerCase().trim(), att.percentage || 0);
    });
  }

  const matchAnalysis = calculateOpportunityMatch(opportunity, studentProfile, assessmentScoresMap);
  const studentContext = await buildStudentContext(userId);
  const prompt = buildApplicationPrompt(opportunity, matchAnalysis, studentContext);

  const raw = await callGemini(prompt);
  const parsed = cleanAndParseJSON(raw);

  if (parsed && parsed.preApplicationChecklist) {
    return {
      source: 'gemini',
      ...parsed,
    };
  }

  return getApplicationFallback(opportunity, matchAnalysis);
}

module.exports = {
  generateCareerGuidance,
  explainSkillGap,
  generateLearningGuidance,
  explainOpportunityMatch,
  generateApplicationGuidance,
};
