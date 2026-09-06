/**
 * Seed Script — Phase 6 Opportunities Discovery
 *
 * Populates 14 realistic, diverse opportunities (Internships, Jobs, Training)
 * across Software Engineering, Data, AI/ML, Cloud, and Cybersecurity.
 *
 * Run with: node src/data/seedOpportunities.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Opportunity = require('../models/Opportunity');

const now = Date.now();
const days = (n) => new Date(now + n * 24 * 60 * 60 * 1000);

const opportunitiesData = [
  // 1. Frontend Developer Intern
  {
    title: 'Frontend Developer Intern',
    organization: 'TechNova Labs',
    type: 'Internship',
    description:
      'Join TechNova Labs to build fast, responsive, and accessible client interfaces for our next-generation developer tooling ecosystem. You will collaborate with product designers and senior engineers to implement modern UI components using React and Tailwind CSS.',
    requiredSkills: ['React', 'JavaScript', 'HTML/CSS', 'Git'],
    preferredSkills: ['REST APIs', 'TypeScript', 'Tailwind CSS'],
    eligibility: 'Open to 3rd & 4th year B.Tech/B.E/BCA/MCA students or recent graduates with solid web fundamentals.',
    location: 'Bengaluru, India',
    workMode: 'Remote',
    experienceLevel: 'Beginner',
    stipend: '₹25,000 / month',
    salary: '',
    duration: '3 Months',
    openings: 4,
    deadline: days(25),
    applicationUrl: 'https://technovalabs.example.com/careers/fe-intern',
    category: 'Software Development',
    status: 'Active',
  },

  // 2. Backend Systems Engineer
  {
    title: 'Backend Systems Engineer',
    organization: 'CodeBridge Solutions',
    type: 'Job',
    description:
      'We are seeking an entry-to-intermediate Backend Engineer to scale our distributed core services. You will design, build, and optimize high-throughput REST APIs, maintain relational database schemas, and participate in code reviews.',
    requiredSkills: ['Node.js', 'SQL', 'REST APIs', 'Git'],
    preferredSkills: ['PostgreSQL', 'Docker', 'Redis', 'Unit Testing'],
    eligibility: 'B.Tech/B.E in Computer Science, Information Technology, or equivalent practical development experience.',
    location: 'Hyderabad, India',
    workMode: 'Hybrid',
    experienceLevel: 'Intermediate',
    stipend: '',
    salary: '₹8 - 12 LPA',
    duration: 'Full-time',
    openings: 2,
    deadline: days(40),
    applicationUrl: 'https://codebridge.example.com/jobs/backend-engineer',
    category: 'Software Development',
    status: 'Active',
  },

  // 3. Junior Full Stack Developer
  {
    title: 'Junior Full Stack Developer',
    organization: 'InnovateX Systems',
    type: 'Job',
    description:
      'Work across the full stack delivering enterprise web platforms. You will handle database queries, build backend API contracts, and craft sleek, dynamic frontend views that streamline academic-industry operations.',
    requiredSkills: ['React', 'Node.js', 'JavaScript', 'SQL', 'REST APIs'],
    preferredSkills: ['Git', 'Express.js', 'MongoDB', 'Responsive Design'],
    eligibility: 'Graduating batch of 2025/2026 or self-taught developers with 2+ completed end-to-end full-stack projects.',
    location: 'Pune, India',
    workMode: 'On-site',
    experienceLevel: 'Beginner',
    stipend: '',
    salary: '₹6 - 9 LPA',
    duration: 'Full-time',
    openings: 3,
    deadline: days(35),
    applicationUrl: 'https://innovatex.example.com/careers/fullstack-junior',
    category: 'Software Development',
    status: 'Active',
  },

  // 4. Data Analyst Intern
  {
    title: 'Data Analyst Intern',
    organization: 'QuantumData Analytics',
    type: 'Internship',
    description:
      'Extract actionable insights from rich organizational datasets. You will write complex SQL analytical queries, build automated exploratory data scripts in Python, and develop business intelligence dashboards.',
    requiredSkills: ['Python', 'SQL', 'Excel', 'Data Visualization'],
    preferredSkills: ['Tableau', 'Statistics', 'Pandas', 'PowerBI'],
    eligibility: 'Students pursuing degrees in Statistics, Mathematics, Computer Science, Economics, or Data Science.',
    location: 'Mumbai, India',
    workMode: 'Hybrid',
    experienceLevel: 'Beginner',
    stipend: '₹22,000 / month',
    salary: '',
    duration: '6 Months',
    openings: 2,
    deadline: days(20),
    applicationUrl: 'https://quantumdata.example.com/internships/data-analyst',
    category: 'Data',
    status: 'Active',
  },

  // 5. AI/ML Research Intern
  {
    title: 'AI/ML Research Intern',
    organization: 'Synapse AI Research',
    type: 'Internship',
    description:
      'Participate in foundational NLP and model fine-tuning experiments. You will preprocess diverse datasets, run benchmark evaluations, and assist in fine-tuning small parameter language models for production workflows.',
    requiredSkills: ['Python', 'Machine Learning', 'Statistics'],
    preferredSkills: ['PyTorch', 'Hugging Face', 'NumPy', 'Git'],
    eligibility: 'Pre-final and final year undergraduate or postgraduate students with demonstrated projects in ML/DL.',
    location: 'Bengaluru, India',
    workMode: 'Remote',
    experienceLevel: 'Intermediate',
    stipend: '₹35,000 / month',
    salary: '',
    duration: '6 Months',
    openings: 2,
    deadline: days(28),
    applicationUrl: 'https://synapseai.example.com/research/fellowship',
    category: 'AI/ML',
    status: 'Active',
  },

  // 6. Cloud Engineering & DevOps Intern
  {
    title: 'Cloud Engineering & DevOps Intern',
    organization: 'SkyVault Cloud Systems',
    type: 'Internship',
    description:
      'Learn how modern cloud infrastructure is built, secured, and maintained at scale. You will work alongside site reliability engineers managing containerized workloads, CI/CD pipelines, and infrastructure as code.',
    requiredSkills: ['Git', 'Linux', 'Docker'],
    preferredSkills: ['AWS', 'Kubernetes', 'CI/CD Pipelines', 'Bash Scripting'],
    eligibility: 'Engineering students in CS/IT/ECE with basic operating system and networking coursework completed.',
    location: 'Noida, India',
    workMode: 'Remote',
    experienceLevel: 'Beginner',
    stipend: '₹20,000 / month',
    salary: '',
    duration: '3 Months',
    openings: 3,
    deadline: days(32),
    applicationUrl: 'https://skyvault.example.com/careers/cloud-intern',
    category: 'Cloud',
    status: 'Active',
  },

  // 7. Associate Cybersecurity Analyst
  {
    title: 'Associate Cybersecurity Analyst',
    organization: 'Nexus Security Systems',
    type: 'Job',
    description:
      'Monitor network alerts, triage vulnerability reports, and perform initial incident response investigations. You will gain exposure to industry-standard SIEM tools, penetration testing fundamentals, and compliance policies.',
    requiredSkills: ['Network Security', 'Linux', 'Python'],
    preferredSkills: ['Wireshark', 'Vulnerability Assessment', 'OWASP Top 10'],
    eligibility: 'Bachelor’s degree in Computer Science, Cybersecurity, or relevant certifications (CEH, CompTIA Security+).',
    location: 'Chennai, India',
    workMode: 'On-site',
    experienceLevel: 'Beginner',
    stipend: '',
    salary: '₹6.5 - 9.5 LPA',
    duration: 'Full-time',
    openings: 2,
    deadline: days(42),
    applicationUrl: 'https://nexussec.example.com/jobs/cyber-associate',
    category: 'Cybersecurity',
    status: 'Active',
  },

  // 8. Java Backend Developer
  {
    title: 'Java Backend Developer',
    organization: 'Horizon FinTech',
    type: 'Job',
    description:
      'Develop core banking interfaces and transaction processing microservices. You will work in an agile squad utilizing Spring Boot, JPA/Hibernate, and relational databases adhering to strict reliability and latency standards.',
    requiredSkills: ['Java', 'SQL', 'REST APIs', 'Git'],
    preferredSkills: ['Spring Boot', 'Microservices', 'Maven', 'PostgreSQL'],
    eligibility: 'B.Tech/MCA graduates with strong object-oriented programming foundations and database skills.',
    location: 'Gurugram, India',
    workMode: 'Hybrid',
    experienceLevel: 'Intermediate',
    stipend: '',
    salary: '₹9 - 14 LPA',
    duration: 'Full-time',
    openings: 4,
    deadline: days(50),
    applicationUrl: 'https://horizonfintech.example.com/jobs/java-backend',
    category: 'Software Development',
    status: 'Active',
  },

  // 9. Python Automation & QA Intern
  {
    title: 'Python Automation & QA Intern',
    organization: 'NextGen Automations',
    type: 'Internship',
    description:
      'Design, write, and execute automated end-to-end regression suites for enterprise software. You will write clean Python automation scripts, inspect API contracts, and log telemetry into bug tracking boards.',
    requiredSkills: ['Python', 'Git', 'REST APIs'],
    preferredSkills: ['Selenium', 'PyTest', 'Postman', 'Linux'],
    eligibility: 'Students currently enrolled in any STEM degree program with scripting proficiency in Python.',
    location: 'Kolkata, India',
    workMode: 'Remote',
    experienceLevel: 'Beginner',
    stipend: '₹18,000 / month',
    salary: '',
    duration: '3 Months',
    openings: 2,
    deadline: days(18),
    applicationUrl: 'https://nextgenauto.example.com/careers/qa-intern',
    category: 'Software Development',
    status: 'Active',
  },

  // 10. UI/UX Product Design Intern
  {
    title: 'UI/UX Product Design Intern',
    organization: 'PixelCraft Studios',
    type: 'Internship',
    description:
      'Craft wireframes, interactive Figma prototypes, and comprehensive design system guidelines. You will conduct user research interviews with students and recruiters to shape intuitive career navigation flows.',
    requiredSkills: ['Figma', 'UI Design', 'Wireframing'],
    preferredSkills: ['HTML/CSS', 'User Research', 'Prototyping'],
    eligibility: 'Students or self-taught designers with a public portfolio demonstrating 2+ detailed product case studies.',
    location: 'Bengaluru, India',
    workMode: 'Hybrid',
    experienceLevel: 'Beginner',
    stipend: '₹20,000 / month',
    salary: '',
    duration: '4 Months',
    openings: 1,
    deadline: days(22),
    applicationUrl: 'https://pixelcraft.example.com/internships/design',
    category: 'Design',
    status: 'Active',
  },

  // 11. Cloud Architecture & Kubernetes Training Program
  {
    title: 'Cloud Architecture & Kubernetes Training Program',
    organization: 'CloudSphere Networks',
    type: 'Training',
    description:
      'An intensive 8-week corporate training cohort covering cloud-native deployment patterns, Kubernetes cluster management, container security, and CI/CD pipelines with hands-on lab sandbox environments.',
    requiredSkills: ['Linux', 'Docker', 'Git'],
    preferredSkills: ['Kubernetes', 'Networking', 'Cloud Fundamentals'],
    eligibility: 'Open to pre-final and final year engineering students seeking industry-certified cloud credentials.',
    location: 'Online Cohort',
    workMode: 'Remote',
    experienceLevel: 'Intermediate',
    stipend: 'Free Sponsored Training',
    salary: '',
    duration: '8 Weeks',
    openings: 50,
    deadline: days(15),
    applicationUrl: 'https://cloudsphere.example.com/cohorts/k8s-training',
    category: 'Cloud',
    status: 'Active',
  },

  // 12. Big Data & Spark Engineering Fellow
  {
    title: 'Big Data & Spark Engineering Fellow',
    organization: 'DataCraft Labs',
    type: 'Internship',
    description:
      'Join our data platform infrastructure team building scalable batch and streaming data pipelines. You will process multi-gigabyte datasets with Apache Spark and SQL, optimizing query execution plans.',
    requiredSkills: ['Python', 'SQL', 'Data Visualization'],
    preferredSkills: ['Apache Spark', 'Scala', 'Hadoop', 'Data Pipelines'],
    eligibility: 'Enrolled in M.Tech/B.Tech in Computer Science or Data Science with coursework in distributed systems.',
    location: 'Hyderabad, India',
    workMode: 'Hybrid',
    experienceLevel: 'Intermediate',
    stipend: '₹30,000 / month',
    salary: '',
    duration: '6 Months',
    openings: 2,
    deadline: days(38),
    applicationUrl: 'https://datacraft.example.com/fellows/big-data',
    category: 'Data',
    status: 'Active',
  },

  // 13. Security Operations Center (SOC) Training Cohort
  {
    title: 'Security Operations Center (SOC) Training Cohort',
    organization: 'CyberGuard Intelligence',
    type: 'Training',
    description:
      'Immersive training cohort focused on modern threat detection, SIEM log analysis, malware triage, and defense strategies. Top performers will be considered for immediate Junior Analyst roles.',
    requiredSkills: ['Network Security', 'Linux'],
    preferredSkills: ['SIEM', 'Threat Hunting', 'Incident Response'],
    eligibility: 'Students and graduates with baseline computer networking and operating system proficiency.',
    location: 'Online Cohort',
    workMode: 'Remote',
    experienceLevel: 'Beginner',
    stipend: 'Certified Training',
    salary: '',
    duration: '6 Weeks',
    openings: 40,
    deadline: days(14),
    applicationUrl: 'https://cyberguard.example.com/soc-bootcamp',
    category: 'Cybersecurity',
    status: 'Active',
  },

  // 14. Senior Frontend Architect
  {
    title: 'Senior Frontend Architect',
    organization: 'Apex Digital',
    type: 'Job',
    description:
      'Lead our enterprise portal frontend architecture. Establish web performance budgets, micro-frontend standards, build tooling, and code quality benchmarks across multiple cross-functional feature teams.',
    requiredSkills: ['React', 'JavaScript', 'HTML/CSS', 'Git', 'REST APIs'],
    preferredSkills: ['TypeScript', 'Micro-frontends', 'Webpack/Vite', 'CI/CD'],
    eligibility: 'Demonstrable expertise architecting production web applications with extensive JavaScript/React experience.',
    location: 'Bengaluru, India',
    workMode: 'Hybrid',
    experienceLevel: 'Advanced',
    stipend: '',
    salary: '₹18 - 28 LPA',
    duration: 'Full-time',
    openings: 1,
    deadline: days(60),
    applicationUrl: 'https://apexdigital.example.com/jobs/senior-frontend',
    category: 'Software Development',
    status: 'Active',
  },
];

const seedOpportunities = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/academia_portal';

  try {
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected for opportunities seeding.');

    let insertedCount = 0;
    let updatedCount = 0;

    for (const item of opportunitiesData) {
      const existing = await Opportunity.findOne({
        title: item.title,
        organization: item.organization,
      });

      if (!existing) {
        await Opportunity.create(item);
        insertedCount++;
      } else {
        await Opportunity.updateOne({ _id: existing._id }, { $set: item });
        updatedCount++;
      }
    }

    console.log(`\nOpportunities seed completed successfully:`);
    console.log(`- Inserted new: ${insertedCount}`);
    console.log(`- Updated existing: ${updatedCount}`);
    console.log(`- Total opportunities in catalog: ${opportunitiesData.length}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

// Run directly if invoked from command line
if (require.main === module) {
  seedOpportunities();
}

module.exports = { opportunitiesData, seedOpportunities };
