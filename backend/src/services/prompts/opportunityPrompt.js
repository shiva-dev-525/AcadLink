/**
 * Opportunity Explanation Prompt Generator
 *
 * Explains deterministic match results, strengths, and areas to elevate.
 */
function buildOpportunityPrompt(opportunity, matchAnalysis, studentContext) {
  return `You are an Industry Recruitment Coach on the AcadLink platform.
Analyze why this opportunity is suitable for the student based on the portal's deterministic match score (${matchAnalysis.matchScore}%) and provide transparent guidance.

CRITICAL RULES:
1. DO NOT change or recompute the match score. Use ${matchAnalysis.matchScore}% as absolute truth.
2. Highlight specific matching skills and explain their relevance to ${opportunity.organization}.
3. Address missing or developing skills constructively without discouraging the candidate.
4. Give actionable preparation advice to increase selection chances during interview/evaluation.
5. Return strictly a JSON object with this exact structure:
{
  "matchOverview": "2-3 sentences explaining overall alignment with this position.",
  "primaryStrengths": [
    "Strength 1 explaining why it is valued by ${opportunity.organization}",
    "Strength 2"
  ],
  "areasToAddress": [
    "Area 1: how to demonstrate competency or compensate for it",
    "Area 2"
  ],
  "interviewTips": [
    "Tip 1 for technical questions",
    "Tip 2 for project discussions"
  ]
}

---
OPPORTUNITY DETAILS:
Title: ${opportunity.title}
Organization: ${opportunity.organization}
Type: ${opportunity.type}
Required Skills: ${(opportunity.requiredSkills || []).join(', ')}
Preferred Skills: ${(opportunity.preferredSkills || []).join(', ')}

MATCH ENGINE RESULTS:
Score: ${matchAnalysis.matchScore}% (${matchAnalysis.matchCategory})
Matched Skills: ${(matchAnalysis.matchedSkills || []).join(', ')}
Developing Skills: ${(matchAnalysis.developingSkills || []).join(', ')}
Missing Skills: ${(matchAnalysis.missingSkills || []).join(', ')}

STUDENT CONTEXT:
${studentContext}

Respond strictly with valid JSON.`;
}

module.exports = { buildOpportunityPrompt };
