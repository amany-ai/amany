
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
  SAUDI_REGULATIONS_NOTICE: "all integrations must comply with saudi commercial and software regulations (nafath, sama, citc).",
  REUSABLE_MODULES: [
    "users & auth",
    "address book",
    "orders management",
    "wallet & transactions",
    "notifications hub",
    "settings & profile",
    "search & filters"
  ]
};

export const TRANSLATIONS: Record<Language, any> = {
  en: {
    dashboard: 'dashboard',
    blueprint: 'estimator agent',
    tasks: 'workflow agent',
    resources: 'planner agent',
    employees: 'hr agent',
    integrations: 'int. agent',
    notifications: 'notifications',
    policy: 'work rules',
    internal_node: 'internal node',
    command_center: 'command center',
    cycle_progress: 'cycle progress',
    ai_analysis: 'ai analysis',
    risk_matrix: 'risk matrix',
    stack_vitality: 'stack vitality',
    gitlab_pulse: 'gitlab pulse',
    day: 'day',
    logout: 'logout'
  },
  ar: {
    dashboard: 'لوحة القيادة',
    blueprint: 'وكيل التقدير',
    tasks: 'وكيل سير العمل',
    resources: 'وكيل التخطيط',
    employees: 'وكيل الموارد البشرية',
    integrations: 'وكيل التكامل',
    notifications: 'التنبيهات',
    policy: 'قواعد العمل',
    internal_node: 'العقدة الداخلية',
    command_center: 'مركز القيادة',
    cycle_progress: 'تقدم الدورة',
    ai_analysis: 'تحليل الذكاء الاصطناعي',
    risk_matrix: 'مصفوفة المخاطر',
    stack_vitality: 'حيوية الموارد',
    gitlab_pulse: 'نبض GitLab',
    day: 'يوم',
    logout: 'تسجيل الخروج'
  }
};

export const WORKFLOW_RULES = {
  TIME_DOCTOR_RULES: [
    "idle time must be below 25%",
    "at least one gitlab commit per day is mandatory",
    "windsurf ai bridge must be used for all coding tasks"
  ],
  DOD_CHECKLIST: [
    "unit tests pass",
    "code reviewed by lead",
    "figma design match",
    "api documentation updated",
    "time doctor logs synced",
    "gitlab commit pushed"
  ]
};

export const TEAM_MEMBERS: TeamMember[] = [
  { id: '1', name: 'amany', email: 'amany@rh.net.sa', role: 'admin', userRole: UserRole.ADMIN, status: 'Active', projectType: 'Both', shiftStartTime: '09:00', zohoId: 'Z-001', timeDoctorId: 'TD-001' },
  { id: '2', name: 'ahmed ba', email: 'ahmed@rh.net.sa', role: 'business analyst', userRole: UserRole.BA, status: 'Active', projectType: 'Both', shiftStartTime: '09:00', zohoId: 'Z-002', timeDoctorId: 'TD-002' },
  { id: '4', name: 'omar backend', email: 'omar@rh.net.sa', role: 'backend developer', userRole: UserRole.BE_DEV, status: 'Active', projectType: 'Web', shiftStartTime: '09:00', zohoId: 'Z-004', timeDoctorId: 'TD-004' },
  { id: '5', name: 'khalid android', email: 'khalid@rh.net.sa', role: 'android developer', userRole: UserRole.ANDROID_DEV, status: 'Active', projectType: 'Mobile', shiftStartTime: '09:00', zohoId: 'Z-005', timeDoctorId: 'TD-005' },
  { id: '7', name: 'sara qa', email: 'sara@rh.net.sa', role: 'quality assurance', userRole: UserRole.QA, status: 'Active', projectType: 'Both', shiftStartTime: '09:00', zohoId: 'Z-007', timeDoctorId: 'TD-007' }
];

export const ZOHO_A21_TEMPLATE: Task[] = [
  { id: 'A21-T26', zohoTaskId: 'A21-T26', title: 'ba & design stage - 5 days', ownerId: '1', status: TaskStatus.DONE, durationDays: 5, isDoDMet: true, priority: 'High', comments: [], dependencies: [], roleTarget: UserRole.PROJECT_MANAGER },
  { id: 'A21-T27', zohoTaskId: 'A21-T27', title: 'gathering requirement', ownerId: '2', status: TaskStatus.DONE, durationDays: 1, isDoDMet: true, priority: 'High', comments: [], dependencies: ['A21-T26'], roleTarget: UserRole.BA },
  { id: 'A21-T31', zohoTaskId: 'A21-T31', title: 'writing ba doc (srs)', ownerId: '2', status: TaskStatus.DONE, durationDays: 2, isDoDMet: true, priority: 'High', comments: [], dependencies: ['A21-T27'], roleTarget: UserRole.BA },
  { id: 'A21-T2', zohoTaskId: 'A21-T2', title: 'backend api development', ownerId: '4', status: TaskStatus.OPEN, durationDays: 8, isDoDMet: false, priority: 'High', comments: [], dependencies: [], roleTarget: UserRole.BE_DEV },
  { id: 'A21-T33', zohoTaskId: 'A21-T33', title: 'user acceptance testing (uat)', ownerId: '7', status: TaskStatus.OPEN, durationDays: 5, isDoDMet: false, priority: 'High', comments: [], dependencies: [], roleTarget: UserRole.QA },
];
