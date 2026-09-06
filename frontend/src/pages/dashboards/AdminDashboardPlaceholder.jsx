import React from 'react';
import RoleDashboardPlaceholder from './RoleDashboardPlaceholder';
import { ShieldCheck } from 'lucide-react';

export default function AdminDashboardPlaceholder() {
  return (
    <RoleDashboardPlaceholder
      roleKey="admin"
      roleTitle="Administrator"
      phaseNumber={13}
      phaseTitle="Platform Governance & Analytics"
      Icon={ShieldCheck}
      upcomingFeatures={[
        'User & Role Management',
        'Global Skill Taxonomy Editor',
        'Opportunity Moderation & Audit',
        'System Health & Performance Telemetry',
        'Cross-Tenant Security Controls',
        'Platform Audit Logs'
      ]}
    />
  );
}
