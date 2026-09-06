import React from 'react';
import RoleDashboardPlaceholder from './RoleDashboardPlaceholder';
import { BookOpen } from 'lucide-react';

export default function AcademicianDashboardPlaceholder() {
  return (
    <RoleDashboardPlaceholder
      roleKey="academician"
      roleTitle="Academician"
      phaseNumber={14}
      phaseTitle="Academician Collaboration Module"
      Icon={BookOpen}
      upcomingFeatures={[
        'Faculty Professional Profile',
        'Industry-Sponsored FDPs',
        'Faculty Industrial Training',
        'Consultancy Project Discovery',
        'Collaborative Research Proposals',
        'Student Mentorship Hub',
        'Curriculum Advisory Collaboration',
        'Guest Lecture Exchange'
      ]}
    />
  );
}
