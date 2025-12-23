
import { ProjectPhase, TaskStatus, UserRole, Task, TeamMember, Language } from './types';

export const TRANSLATIONS: Record<Language, any> = {
  en: {
    dashboard: 'Dashboard',
    srs: 'SRS Insight',
    blueprint: 'BRD Estimation',
    tasks: 'Project Flow',
    resources: 'Resource Planner',
    employees: 'Team Members',
    frontend: 'Frontend Hub',
    vault: 'Secret Vault',
    testcenter: 'Ai Tester',
    integrations: 'Work Tools',
    notifications: 'Notifications',
    policy: 'Work Rules',
    system_files: 'System Files',
    sovereign_os: 'Sovereign OS',
    internal_node: 'Internal Node',
    command_center: 'Command Center',
    cycle_progress: 'Cycle Progress',
    ai_analysis: 'AI Analysis',
    risk_matrix: 'Risk Matrix',
    stack_vitality: 'Stack Vitality',
    gitlab_pulse: 'GitLab Pulse',
    day: 'Day',
    logout: 'Logout',
    download_env: 'Download .env',
    copy_env: 'Copy Configuration',
    env_backend: 'Backend Environment (.env)',
    env_frontend: 'Frontend Environment (.env)'
  },
  // Added Arabic translations to satisfy Language type requirement
  ar: {
    dashboard: 'لوحة القيادة',
    srs: 'رؤى SRS',
    blueprint: 'تقدير BRD',
    tasks: 'تدفق المشروع',
    resources: 'مخطط الموارد',
    employees: 'أعضاء الفريق',
    frontend: 'مركز الواجهة الأمامية',
    vault: 'الخزنة السرية',
    testcenter: 'مختبر الذكاء الاصطناعي',
    integrations: 'أدوات العمل',
    notifications: 'التنبيهات',
    policy: 'قواعد العمل',
    system_files: 'ملفات النظام',
    sovereign_os: 'نظام التشغيل السيادي',
    internal_node: 'العقدة الداخلية',
    command_center: 'مركز القيادة',
    cycle_progress: 'تقدم الدورة',
    ai_analysis: 'تحليل الذكاء الاصطناعي',
    risk_matrix: 'مصفوفة المخاطر',
    stack_vitality: 'حيوية المكدس',
    gitlab_pulse: 'نبض GitLab',
    day: 'يوم',
    logout: 'تسجيل الخروج',
    download_env: 'تحميل .env',
    copy_env: 'نسخ التكوين',
    env_backend: 'بيئة الخلفية (.env)',
    env_frontend: 'بيئة الواجهة الأمامية (.env)'
  }
};

export const TEAM_MEMBERS: TeamMember[] = [
  { id: '1', name: 'PM User', role: 'Project Manager', userRole: UserRole.PROJECT_MANAGER, projectType: 'Both', shiftStartTime: '09:00', email: 'pm@rhnetsa.com', status: 'Active' },
  { id: '2', name: 'Ahmed BA', role: 'Business Analyst', userRole: UserRole.BA, projectType: 'Both', shiftStartTime: '09:00', email: 'ahmed.ba@rhnetsa.com', status: 'Active' },
  { id: '3', name: 'Sara Design', role: 'UI/UX Designer', userRole: UserRole.DESIGNER, projectType: 'Both', shiftStartTime: '09:00', email: 'sara.design@rhnetsa.com', status: 'Active' },
  { id: '4', name: 'Omar Backend', role: 'Backend Developer', userRole: UserRole.BE_DEV, projectType: 'Both', shiftStartTime: '09:00', email: 'omar.be@rhnetsa.com', status: 'Active' },
  { id: '5', name: 'Khalid Android', role: 'Android Developer', userRole: UserRole.ANDROID_DEV, projectType: 'Mobile', shiftStartTime: '09:00', email: 'khalid.android@rhnetsa.com', status: 'Active' },
  { id: '6', name: 'Laila iOS', role: 'iOS Developer', userRole: UserRole.IOS_DEV, projectType: 'Mobile', shiftStartTime: '09:00', email: 'laila.ios@rhnetsa.com', status: 'Active' },
  { id: '7', name: 'Zaid QA', role: 'Quality Assurance', userRole: UserRole.QA, projectType: 'Both', shiftStartTime: '09:00', email: 'zaid.qa@rhnetsa.com', status: 'Active' },
];

export const ZOHO_A21_TEMPLATE: Task[] = [
  { id: 'A21-T26', zohoTaskId: 'A21-T26', title: 'BA & Design Stage - 5 Days', ownerId: '1', status: TaskStatus.DONE, durationDays: 5, isDoDMet: true, priority: 'High', comments: [], dependencies: [], roleTarget: UserRole.PROJECT_MANAGER },
  { id: 'A21-T27', zohoTaskId: 'A21-T27', title: 'Gathering Requirement', ownerId: '2', status: TaskStatus.DONE, durationDays: 1, isDoDMet: true, priority: 'High', comments: [], dependencies: ['A21-T26'], roleTarget: UserRole.BA },
  { id: 'A21-T31', zohoTaskId: 'A21-T31', title: 'Writing BA Doc (SRS)', ownerId: '2', status: TaskStatus.DONE, durationDays: 2, isDoDMet: true, priority: 'High', comments: [], dependencies: ['A21-T27'], roleTarget: UserRole.BA },
  { id: 'A21-T29', zohoTaskId: 'A21-T29', title: 'UI/UX - First X', ownerId: '3', status: TaskStatus.DONE, durationDays: 2, isDoDMet: true, priority: 'Medium', comments: [], dependencies: ['A21-T27'], roleTarget: UserRole.DESIGNER },
  { id: 'A21-T30', zohoTaskId: 'A21-T30', title: 'UI/UX - Full X', ownerId: '3', status: TaskStatus.IN_PROGRESS, durationDays: 2, isDoDMet: false, priority: 'Medium', comments: [], dependencies: ['A21-T29'], roleTarget: UserRole.DESIGNER },
  { id: 'A21-T14', zohoTaskId: 'A21-T14', title: 'Brief & Estimation', ownerId: '1', status: TaskStatus.OPEN, durationDays: 2, isDoDMet: false, priority: 'High', comments: [], dependencies: ['A21-T31'], roleTarget: UserRole.PROJECT_MANAGER },
  { id: 'A21-T2', zohoTaskId: 'A21-T2', title: 'Backend API Development', ownerId: '4', status: TaskStatus.OPEN, durationDays: 8, isDoDMet: false, priority: 'High', comments: [], dependencies: ['A21-T14'], roleTarget: UserRole.BE_DEV },
  { id: 'A21-T7', zohoTaskId: 'A21-T7', title: 'Android - Base & Design Coding (Native)', ownerId: '5', status: TaskStatus.OPEN, durationDays: 8, isDoDMet: false, priority: 'High', comments: [], dependencies: ['A21-T30'], roleTarget: UserRole.ANDROID_DEV },
  { id: 'A21-T8', zohoTaskId: 'A21-T8', title: 'iOS - Base & Design Coding (Native)', ownerId: '6', status: TaskStatus.OPEN, durationDays: 8, isDoDMet: false, priority: 'High', comments: [], dependencies: ['A21-T30'], roleTarget: UserRole.IOS_DEV },
  { id: 'A21-T21', zohoTaskId: 'A21-T21', title: 'Testing Coded Design with Figma', ownerId: '7', status: TaskStatus.OPEN, durationDays: 2, isDoDMet: false, priority: 'Medium', comments: [], dependencies: ['A21-T7', 'A21-T8'], roleTarget: UserRole.QA },
  { id: 'A21-T17', zohoTaskId: 'A21-T17', title: 'Backend - Third Party INT (Nafath, Maps, Pay)', ownerId: '4', status: TaskStatus.OPEN, durationDays: 9, isDoDMet: false, priority: 'High', comments: [], dependencies: ['A21-T2'], roleTarget: UserRole.BE_DEV },
  { id: 'A21-T33', zohoTaskId: 'A21-T33', title: 'User Acceptance Testing (UAT)', ownerId: '7', status: TaskStatus.OPEN, durationDays: 5, isDoDMet: false, priority: 'High', comments: [], dependencies: ['A21-T17'], roleTarget: UserRole.QA },
];

export const WORKFLOW_RULES = {
  TOTAL_DAYS: 22,
  NATIVE_FOCUS: ['Android (Kotlin/Java)', 'iOS (Swift/SwiftUI)'],
  INTEGRATIONS: ['Nafath', 'Google Maps', 'Payment Gateway (Mada/Visa/Apple Pay)'],
  DOD_CHECKLIST: [
    'SRS Requirements Matched',
    'Figma Design Compliance',
    'Native Performance Audit',
    'GitLab Code Daily Update',
    'Automated Test Pass'
  ],
  TIME_DOCTOR_RULES: [
    'Idle time below 25%',
    'Daily commit verify in GitLab',
    'Windsurf AI integration check'
  ]
};
