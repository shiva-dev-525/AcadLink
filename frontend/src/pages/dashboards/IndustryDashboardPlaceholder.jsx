import React from 'react';
import RoleDashboardPlaceholder from './RoleDashboardPlaceholder';
import { Building2 } from 'lucide-react';

export default function IndustryDashboardPlaceholder() {
  return (
    <RoleDashboardPlaceholder
      roleKey="industry"
      roleTitle="Industry"
      phaseNumber={12}
      phaseTitle="Industry Recruiter Module"
      Icon={Building2}
      upcomingFeatures={[
        'Company Profile & Branding',
        'Post Internships & Jobs',
        'Define Required Skill Benchmarks',
        'Candidate Discovery Engine',
        'Applicant Match Score Breakdown',
        'Candidate Shortlisting & Pipeline',
        'Status Progression Management',
        'Academia Collaboration Exchange'
      ]}
    />
  );
}
