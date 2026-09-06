/**
 * Learning Guidance Prompt Generator
 *
 * Generates actionable learning roadmaps, hands-on mini-projects, and common pitfalls.
 */
function buildLearningPrompt(skillName, resourceTitle, targetCareer, studentContext) {
  return `You are an expert Technical Curriculum Coach for university students.
Provide personalized learning guidance for mastering "${skillName}"${resourceTitle ? ` while studying "${resourceTitle}"` : ''} to prepare for "${targetCareer}".

CRITICAL RULES:
1. Focus on practical, hands-on tasks rather than purely passive reading or video watching.
2. Emphasize real-world project development that can be showcased on a portfolio.
3. List common beginner pitfalls and how to avoid them.
4. Return strictly a JSON object with this exact structure:
{
  "skillName": "${skillName}",
  "studyPlanSummary": "A concise roadmap summary of what to learn first, second, and third.",
  "weeklyMilestones": [
    { "week": "Week 1", "focus": "Core fundamentals", "deliverable": "Simple script or component" },
    { "week": "Week 2", "focus": "Practical application", "deliverable": "Interactive module" },
    { "week": "Week 3", "focus": "Full integration", "deliverable": "Mini portfolio project" }
  ],
  "portfolioProjectIdea": {
    "title": "Title of mini project",
    "description": "Short description of what to build to prove mastery",
    "recommendedStack": ["Tool 1", "Tool 2"]
  },
  "pitfallsToAvoid": [
    "Common mistake 1",
    "Common mistake 2"
  ]
}

---
STUDENT CONTEXT:
${studentContext}

Respond strictly with valid JSON.`;
}

module.exports = { buildLearningPrompt };
