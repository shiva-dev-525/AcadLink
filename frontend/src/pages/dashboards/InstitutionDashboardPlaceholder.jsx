import React from 'react';
import RoleDashboardPlaceholder from './RoleDashboardPlaceholder';
import { Landmark } from 'lucide-react';

export default function InstitutionDashboardPlaceholder() {
  return (
    <RoleDashboardPlaceholder
      roleKey="institution"
      roleTitle="Institution"
      phaseNumber={13}
      phaseTitle="Institution Analytics Module"
      Icon={Landmark}
      upcomingFeatures={[
        'Cohort Placement Readiness KPIs',
        'Skill Demand vs Gap Bar Charts',
        'Departmental Progress Tracking',
        'Internship Participation Metrics',
        'Industry Partner Relationship Management',
        'Placement Funnel Visualizations',
        'Student Outcome Reports',
        'Curriculum Realignment Analytics'
      ]}
    />
  );
}
