
import { ProjectPhase, TaskStatus, UserRole, Task, Language, TeamMember } from './types';

export const ROWAD_ESTIMATION_RULES = {
  QA_FIXED_DAYS: 10,
  ADMIN_PERCENT_OF_BACKEND: 0.20,
  WEB_STANDARD_DAYS: 30,
  WEB_PREMIUM_MODIFIER: 0.20,
  COMPLEXITY_MODIFIERS: {
    LOW: 0,
    MEDIUM: 0.10,
    HIGH: 0.20
  },
  SAUDI_REGULATIONS_NOTICE: "All integrations must comply with Saudi commercial and software regulations (Nafath, SAMA, CITC).",
  REUSABLE_MODULES: [
    "Users & Auth",
    "Address Book",
    "Orders Management",
    "Wallet & Transactions",
    "Notifications Hub",
    "Settings & Profile",
    "Search & Filters"
  ]
};

// Fixed: Added missing 'ar' translation property
export const TRANSLATIONS: Record<Language, any> = {
  en: {
    dashboard: 'Dashboard',
    srs: 'SRS Insight',
    blueprint: 'Estimation Hub',
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
    copy_env: 'Copy Configuration'
  },
  ar: {
    dashboard: 'لوحة القيادة',
    srs: 'تحليل المتطلبات',
    blueprint: 'مركز التقدير',
    tasks: 'تدفق المشروع',
    resources: 'مخطط الموارد',
    employees: 'أعضاء الفريق',
    frontend: 'مركز الواجهة الأمامية',
    vault: 'خزنة الأسرار',
    testcenter: 'مختبر الذكاء الاصطناعي',
    integrations: 'أدوات العمل',
    notifications: 'التنبيهات',
    policy: 'قواعد العمل',
    system_files: 'ملفات النظام',
    sovereign_os: 'نظام Sovereign OS',
    internal_node: 'العقدة الداخلية',
    command_center: 'مركز القيادة',
    cycle_progress: 'تقدم الدورة',
    ai_analysis: 'تحليل الذكاء الاصطناعي',
    risk_matrix: 'مصفوفة المخاطر',
    stack_vitality: 'حيوية الموارد',
    gitlab_pulse: 'نبض GitLab',
    day: 'يوم',
    logout: 'تسجيل الخروج',
    download_env: 'تحميل .env',
    copy_env: 'نسخ الإعدادات'
  }
};

// Added missing WORKFLOW_RULES constant
export const WORKFLOW_RULES = {
  TIME_DOCTOR_RULES: [
    "Idle time must be below 25%",
    "At least one GitLab commit per day is mandatory",
    "Windsurf AI Bridge must be used for all coding tasks"
  ],
  DOD_CHECKLIST: [
    "Unit tests pass",
    "Code reviewed by lead",
    "Figma design match",
    "API documentation updated",
    "Time Doctor logs synced",
    "GitLab commit pushed"
  ]
};

// Added missing TEAM_MEMBERS constant
export const TEAM_MEMBERS: TeamMember[] = [
  { id: '1', name: 'Amany', email: 'amany@rh.net.sa', role: 'Admin', userRole: UserRole.ADMIN, status: 'Active', projectType: 'Both', shiftStartTime: '09:00', zohoId: 'Z-001', timeDoctorId: 'TD-001' },
  { id: '2', name: 'Ahmed BA', email: 'ahmed@rh.net.sa', role: 'Business Analyst', userRole: UserRole.BA, status: 'Active', projectType: 'Both', shiftStartTime: '09:00', zohoId: 'Z-002', timeDoctorId: 'TD-002' },
  { id: '4', name: 'Omar Backend', email: 'omar@rh.net.sa', role: 'Backend Developer', userRole: UserRole.BE_DEV, status: 'Active', projectType: 'Web', shiftStartTime: '09:00', zohoId: 'Z-004', timeDoctorId: 'TD-004' },
  { id: '5', name: 'Khalid Android', email: 'khalid@rh.net.sa', role: 'Android Developer', userRole: UserRole.ANDROID_DEV, status: 'Active', projectType: 'Mobile', shiftStartTime: '09:00', zohoId: 'Z-005', timeDoctorId: 'TD-005' },
  { id: '7', name: 'Sara QA', email: 'sara@rh.net.sa', role: 'Quality Assurance', userRole: UserRole.QA, status: 'Active', projectType: 'Both', shiftStartTime: '09:00', zohoId: 'Z-007', timeDoctorId: 'TD-007' }
];

export const ZOHO_A21_TEMPLATE: Task[] = [
  { id: 'A21-T26', zohoTaskId: 'A21-T26', title: 'BA & Design Stage - 5 Days', ownerId: '1', status: TaskStatus.DONE, durationDays: 5, isDoDMet: true, priority: 'High', comments: [], dependencies: [], roleTarget: UserRole.PROJECT_MANAGER },
  { id: 'A21-T27', zohoTaskId: 'A21-T27', title: 'Gathering Requirement', ownerId: '2', status: TaskStatus.DONE, durationDays: 1, isDoDMet: true, priority: 'High', comments: [], dependencies: ['A21-T26'], roleTarget: UserRole.BA },
  { id: 'A21-T31', zohoTaskId: 'A21-T31', title: 'Writing BA Doc (SRS)', ownerId: '2', status: TaskStatus.DONE, durationDays: 2, isDoDMet: true, priority: 'High', comments: [], dependencies: ['A21-T27'], roleTarget: UserRole.BA },
  { id: 'A21-T2', zohoTaskId: 'A21-T2', title: 'Backend API Development', ownerId: '4', status: TaskStatus.OPEN, durationDays: 8, isDoDMet: false, priority: 'High', comments: [], dependencies: [], roleTarget: UserRole.BE_DEV },
  { id: 'A21-T33', zohoTaskId: 'A21-T33', title: 'User Acceptance Testing (UAT)', ownerId: '7', status: TaskStatus.OPEN, durationDays: 5, isDoDMet: false, priority: 'High', comments: [], dependencies: [], roleTarget: UserRole.QA },
];
