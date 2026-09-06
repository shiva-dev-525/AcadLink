import React from 'react';
import RoleDashboardPlaceholder from './RoleDashboardPlaceholder';
import { GraduationCap } from 'lucide-react';

export default function StudentDashboardPlaceholder() {
  return (
    <RoleDashboardPlaceholder
      roleKey="student"
      roleTitle="Student"
      phaseNumber={3}
      phaseTitle="Student Profile & Dashboard"
      Icon={GraduationCap}
      upcomingFeatures={[
        'Degree, Department & CGPA Setup',
        'Target Career Goal Selection',
        'Technical & Soft Skill Taxonomy',
        'Distraction-free MCQ Assessments',
        'Visual Skill-Gap Bar Charts',
        'Personalized Learning Recommendations',
        'Deterministic Internship Matching',
        'Digital Verified Portfolio'
      ]}
    />
  );
}
