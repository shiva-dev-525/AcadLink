/**
 * Skill Gap Explanation Prompt Generator
 *
 * Explains why a specific skill gap exists for a target career and how to bridge it.
 */
function buildSkillGapPrompt(skillName, targetCareer, studentContext, gapDetails) {
  return `You are a Technical Skills Advisor on the AcadLink platform.
Explain in plain, practical language why the skill "${skillName}" is crucial for a student pursuing the career goal "${targetCareer}".

CRITICAL RULES:
1. Explain WHY industries demand this skill for this specific role.
2. Outline HOW the student's existing skills connect to learning "${skillName}".
3. Provide 3-4 realistic, graduated milestones to bridge the gap.
4. Do NOT calculate scores or modify proficiency ratings.
5. Return strictly a JSON object with this exact structure:
{
  "skillName": "${skillName}",
  "industryRelevance": "2-3 sentences explaining real-world utility and industry demand.",
  "bridgeStrategy": "How to leverage current foundational skills to learn this faster.",
  "learningMilestones": [
    "Milestone 1 (Foundations)",
    "Milestone 2 (Practical Application)",
    "Milestone 3 (Integration/Project)"
  ],
  "estimatedEffort": "e.g., 2-3 weeks (approx. 10 hours/week)"
}

---
STUDENT CONTEXT:
${studentContext}

GAP INFORMATION:
Skill: ${skillName}
Career Goal: ${targetCareer}
${gapDetails ? `Details: ${JSON.stringify(gapDetails)}` : ''}

Respond strictly with valid JSON.`;
}

module.exports = { buildSkillGapPrompt };
