

import { ProjectPhase, TaskStatus, UserRole, Task, Language, TeamMember } from './types';

export const WORKFLOW_RULES = {
  TIME_DOCTOR_RULES: [
    "idle time must remain below 25%. system triggers auto-alerts to hr if threshold is breached.",
    "every session requires at least 1 commit. ghost sessions are flagged for manual review.",
    "architectural stubs must be generated via windsurf ai bridge for all core modules."
  ],
  DOD_CHECKLIST: [
    "self-code review completed",
    "unit tests passing in local node",
    "gitlab commit message follows a21 standards",
    "api documentation updated in bridge",
    "security scan passed (npm audit)",
    "figma design verified for mobile/web parity"
  ]
};

export const ROWAD_ESTIMATION_RULES = {
  QA_FIXED_BASE: 10,
  QA_PER_PLATFORM_INCREMENT: 3,
  ADMIN_PERCENT_OF_BACKEND: 0.20,
  WEB_STANDARD_DAYS: 30,
  WEB_PREMIUM_MODIFIER: 0.20,
  REUSE_DISCOUNT: 0.40,
  COMPLEXITY_MODIFIERS: {
    LOW: 0,
    MEDIUM: 0.10,
    HIGH: 0.20
  },
  DEFAULT_ROLE_RATES: {
    BA: 12000,
    Backend: 18000,
    Frontend: 17000,
    Android: 18000,
    iOS: 18000,
    QA: 14000,
    PM: 16000,
    AccountManager: 12000
  },
  REUSABLE_MODULES: [
    "AddressBook",
    "Orders",
    "Wallet",
    "Payments",
    "Notifications",
    "User Management",
    "Roles and Permissions",
    "Reporting",
    "CMS",
    "Chat",
    "Delivery Tracking"
  ]
};

export const TRANSLATIONS: Record<Language, any> = {
  en: {
    dashboard: 'dashboard',
    blueprint: 'estimator mesh',
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
    logout: 'logout',
    system_files: 'system files',
    env_backend: '.env (backend)',
    env_frontend: '.env (frontend)',
    download_env: 'download .env',
    copy_env: 'copy .env'
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
    logout: 'تسجيل الخروج',
    system_files: 'ملفات النظام',
    env_backend: '.env (الخلفية)',
    env_frontend: '.env (الواجهة)',
    download_env: 'تحميل .env',
    copy_env: 'نسخ .env'
  }
};

export const TEAM_MEMBERS: TeamMember[] = [
  { id: '1', name: 'Ahmad Anwar', email: 'ahmed.anwar@rowaad.net', role: 'BA', profile: 'Business', userRole: UserRole.BA, status: 'Active', projectType: 'Both', shiftStartTime: '09:00', reportingManager: 'amany@rh.net.sa' },
  { id: '2', name: 'Ahmed Saleh', email: 'ahmed.saleh@rowaad.net', role: 'IOS', profile: 'Engineering', userRole: UserRole.IOS_DEV, status: 'Active', projectType: 'Mobile', shiftStartTime: '09:00', reportingManager: 'amany@rh.net.sa' },
  { id: '3', name: 'ahmed zayed', email: 'ahmed.zaid@rowaad.net', role: 'BA', profile: 'Business', userRole: UserRole.BA, status: 'Active', projectType: 'Both', shiftStartTime: '09:00', reportingManager: 'amany@rh.net.sa' },
  { id: '4', name: 'Amany Youssef', email: 'amany@rh.net.sa', role: 'PM', profile: 'Management', userRole: UserRole.PROJECT_MANAGER, status: 'Active', projectType: 'Both', shiftStartTime: '09:00', reportingManager: 'amany@rh.net.sa' },
  { id: '5', name: 'anass atef', email: 'ceo@rh.net.sa', role: 'CEO', profile: 'Executive', userRole: UserRole.ADMIN, status: 'Active', projectType: 'Both', shiftStartTime: '09:00', reportingManager: 'ceo@rh.net.sa' },
  { id: '6', name: 'Aya Shoala', email: 'aya.shoala@rowaad.net', role: 'project coordinator', profile: 'Management', userRole: UserRole.PROJECT_MANAGER, status: 'Active', projectType: 'Both', shiftStartTime: '09:00', reportingManager: 'amany@rh.net.sa' },
  { id: '7', name: 'Eman Awad', email: 'eman.awd@rowaad.net', role: 'Frontend-React', profile: 'Engineering', userRole: UserRole.FE_DEV, status: 'Active', projectType: 'Web', shiftStartTime: '09:00', reportingManager: 'amany@rh.net.sa' },
  { id: '8', name: 'Enas Magdy', email: 'enas.magdy@rowaad.net', role: 'Frontend', profile: 'Engineering', userRole: UserRole.FE_DEV, status: 'Active', projectType: 'Web', shiftStartTime: '09:00', reportingManager: 'aya.sayed@rowaad.net' },
  { id: '9', name: 'gehad rezk', email: 'ge.rezk@rowaad.net', role: 'Frontend', profile: 'Engineering', userRole: UserRole.FE_DEV, status: 'Active', projectType: 'Web', shiftStartTime: '09:00', reportingManager: 'aya.sayed@rowaad.net' },
  { id: '10', name: 'Hala ElDeeb', email: 'hala@rh.net.sa', role: 'Account Manager', profile: 'Client Success', userRole: UserRole.ACCOUNT_MANAGER, status: 'Active', projectType: 'Both', shiftStartTime: '09:00', reportingManager: 'ceo@rh.net.sa' },
  { id: '11', name: 'Hamada Badr', email: 'hamada@rh.net.sa', role: 'Server', profile: 'Engineering', userRole: UserRole.BE_DEV, status: 'Active', projectType: 'Both', shiftStartTime: '09:00', reportingManager: 'ceo@rh.net.sa' },
  { id: '12', name: 'hamza talha', email: 'hamza.talha@rowaad.net', role: 'Frontend-React', profile: 'Engineering', userRole: UserRole.FE_DEV, status: 'Active', projectType: 'Web', shiftStartTime: '09:00', reportingManager: 'amany@rh.net.sa' },
  { id: '13', name: 'k.hasan', email: 'k.hasan@rowaad.net', role: 'Android', profile: 'Engineering', userRole: UserRole.ANDROID_DEV, status: 'Active', projectType: 'Mobile', shiftStartTime: '09:00', reportingManager: 'amany@rh.net.sa' },
  { id: '14', name: 'Mahmoud Heshmat', email: 'm.heshmat@rowaad.net', role: 'IOS', profile: 'Engineering', userRole: UserRole.IOS_DEV, status: 'Active', projectType: 'Mobile', shiftStartTime: '09:00', reportingManager: 'amany@rh.net.sa' },
  { id: '15', name: 'Marwa Mahmoud', email: 'marwa@rowaad.net', role: 'Backend', profile: 'Engineering', userRole: UserRole.BE_DEV, status: 'Active', projectType: 'Web', shiftStartTime: '09:00', reportingManager: 'amany@rh.net.sa' },
  { id: '16', name: 'Moamen Ramadi', email: 'moaa@rh.net.sa', role: 'designer', profile: 'Design', userRole: UserRole.DESIGNER, status: 'Active', projectType: 'Both', shiftStartTime: '09:00', reportingManager: 'amany@rh.net.sa' },
  { id: '17', name: 'mohamed fayez', email: 'm.fayez@rowaad.net', role: 'Backend', profile: 'Engineering', userRole: UserRole.BE_DEV, status: 'Active', projectType: 'Web', shiftStartTime: '09:00', reportingManager: 'amany@rh.net.sa' },
  { id: '18', name: 'Mohamed Saleh', email: 'mo.salah@rowaad.net', role: 'Frontend', profile: 'Engineering', userRole: UserRole.FE_DEV, status: 'Active', projectType: 'Web', shiftStartTime: '09:00', reportingManager: 'aya.sayed@rowaad.net' },
  { id: '19', name: 'Mohamed Wessam', email: 'm.wessam@rowaad.net', role: 'Android', profile: 'Engineering', userRole: UserRole.ANDROID_DEV, status: 'Active', projectType: 'Mobile', shiftStartTime: '09:00', reportingManager: 'amany@rh.net.sa' },
  { id: '20', name: 'Nuha Mekkawy', email: 'nuha@rowaad.net', role: 'Account Manager', profile: 'Client Success', userRole: UserRole.ACCOUNT_MANAGER, status: 'Active', projectType: 'Both', shiftStartTime: '09:00', reportingManager: 'hala@rh.net.sa' },
  { id: '21', name: 'radwa osama', email: 'ra.osama@rowaad.net', role: 'Frontend', profile: 'Engineering', userRole: UserRole.FE_DEV, status: 'Active', projectType: 'Web', shiftStartTime: '09:00', reportingManager: 'aya.sayed@rowaad.net' },
  { id: '22', name: 'rana hesham', email: 'rana.hesham@rowaad.net', role: 'Account Manager', profile: 'Client Success', userRole: UserRole.ACCOUNT_MANAGER, status: 'Active', projectType: 'Both', shiftStartTime: '09:00', reportingManager: 'hala@rh.net.sa' }
];

export const ZOHO_A21_TEMPLATE: Task[] = [
  { id: 'A21-T26', zohoTaskId: 'A21-T26', title: 'ba & design stage - 5 days', ownerId: '4', status: TaskStatus.DONE, durationDays: 5, isDoDMet: true, priority: 'High', comments: [], dependencies: [], roleTarget: UserRole.PROJECT_MANAGER },
  { id: 'A21-T27', zohoTaskId: 'A21-T27', title: 'gathering requirement', ownerId: '1', status: TaskStatus.DONE, durationDays: 1, isDoDMet: true, priority: 'High', comments: [], dependencies: ['A21-T26'], roleTarget: UserRole.BA },
  { id: 'A21-T31', zohoTaskId: 'A21-T31', title: 'writing ba doc (srs)', ownerId: '1', status: TaskStatus.DONE, durationDays: 2, isDoDMet: true, priority: 'High', comments: [], dependencies: ['A21-T27'], roleTarget: UserRole.BA },
  { id: 'A21-T2', zohoTaskId: 'A21-T2', title: 'backend api development', ownerId: '15', status: TaskStatus.OPEN, durationDays: 8, isDoDMet: false, priority: 'High', comments: [], dependencies: [], roleTarget: UserRole.BE_DEV },
  { id: 'A21-T33', zohoTaskId: 'A21-T33', title: 'user acceptance testing (uat)', ownerId: '4', status: TaskStatus.OPEN, durationDays: 5, isDoDMet: false, priority: 'High', comments: [], dependencies: [], roleTarget: UserRole.QA },
];