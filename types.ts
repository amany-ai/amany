
export type Language = 'en' | 'ar';

export enum ProjectPhase {
  BA_DESIGN = 'BA & Design Stage',
  FOUNDATION = 'First Phase - Foundation',
  INTEGRATION = 'Second Phase - Integration',
  REFINEMENT = 'Third Phase - Refinement',
  UAT = 'User Acceptance Testing'
}

export enum TaskStatus {
  OPEN = 'Open',
  IN_REVIEW = 'In Review',
  IN_PROGRESS = 'In Progress',
  HOLD = 'Hold',
  DONE = 'Done'
}

export enum UserRole {
  ADMIN = 'Admin',
  PROJECT_MANAGER = 'Project Manager',
  BA = 'Business Analyst',
  DESIGNER = 'UI/UX Designer',
  FE_DEV = 'Frontend Developer',
  BE_DEV = 'Backend Developer',
  ANDROID_DEV = 'Android Developer',
  IOS_DEV = 'iOS Developer',
  QA = 'Quality Assurance',
  SALES = 'Sales Department',
  TEAM_MEMBER = 'Team Member',
  ACCOUNT_MANAGER = 'Account Manager'
}

// Storage & File System Types
export interface StorageNode {
  id: string;
  name: string;
  type: 'Local' | 'S3' | 'GridFS';
  status: 'online' | 'offline';
  usagePercentage: number;
  totalSize: string;
}

export interface SystemFile {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  source: 'zoho' | 'timedoctor' | 'internal';
  externalId?: string;
  storagePath: string;
  createdAt: string;
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  url: string; 
  size: number;
}

// Planner Mesh Specific Types
export interface PlannerAllocation {
  id: string;
  memberId: string;
  memberName: string;
  hours: number;
  project: string;
  priority: 'High' | 'Medium' | 'Low';
  isOverCapacity: boolean;
}

export interface PlannerSyncStatus {
  lastSync: string;
  status: 'active' | 'syncing' | 'failed';
  deltaCount: number;
  mappingGaps: number;
}

export interface AuditFinding {
  id: string;
  agent: string;
  severity: 'Critical' | 'Warning' | 'Info';
  message: string;
  fixSteps: string[];
}

export interface PortfolioHealth {
  pmName: string;
  score: number;
  utilization: number;
  missedDeadlines: number;
  blockers: number;
}

export interface IntegrationDetail {
  vendor: string;
  type: string;
  complexity: 'Low' | 'Medium' | 'High';
  effort_days: number;
  assumptions: string[];
}

export interface RoleAllocation {
  role: string;
  count: number;
  rate_monthly: number;
}

export interface MethodologyOption {
  type: 'Waterfall' | 'Agile Iterations' | '22-Day Role Model';
  justification: string;
  pros: string;
  cons: string;
  timeline_adjustment: string;
}

export interface ValidationIssue {
  rule: string;
  severity: 'high' | 'medium' | 'low';
  impact: string;
  fix_steps: string[];
  missing_user_inputs: string[];
}

export interface EstimationResult {
  scope: {
    project_name: string;
    domain: string;
    platforms: string[];
    user_types: string[];
    core_modules: string[];
    complexity: 'Low' | 'Medium' | 'High';
  };
  methodology_options: MethodologyOption[];
  selected_methodology?: string;
  effort_days: {
    backend: number;
    dashboard: number;
    website: number;
    android: number;
    ios: number;
    qa: number;
    deployment: number;
    integrations: number;
  };
  duration_working_days: number;
  team: {
    BA: number;
    Backend: number;
    Frontend: number;
    Android: number;
    iOS: number;
    QA: number;
    PM: number;
    AccountManager: number;
  };
  rates_monthly: Record<string, number>;
  budget: {
    monthly_cost: number;
    project_cost: number;
    vat_amount: number;
    total_with_vat: number;
  };
  integrations: IntegrationDetail[];
  export_plan: {
    method: string;
    output: string;
    steps: string[];
    code_snippet: string;
  };
  validation: {
    status: 'pass' | 'fail';
    issues: ValidationIssue[];
  };
  assumptions: string[];
  exclusions: string[];
  next_questions: string[];
  human_summary?: string;
}

export interface Project {
  id: string;
  name: string;
  type: 'Mobile' | 'Web' | 'Both';
  currentDay: number;
  totalDays: number;
  phase: ProjectPhase;
  tasks: Task[];
  gitUpdates: GitLabUpdate[];
  testCases: TestCase[];
  endpoints: ApiEndpoint[];
  allocations: ResourceAllocation[];
  credentials: Credential[];
  stackInfo?: {
    framework: string;
    database: string;
    version: string;
  };
}

export interface Task {
  id: string;
  zohoTaskId: string;
  title: string;
  ownerId: string;
  status: TaskStatus;
  durationDays: number;
  priority: 'High' | 'Medium' | 'Low';
  comments: string[];
  isDoDMet: boolean;
  dependencies: string[];
  roleTarget: UserRole;
  dueDate?: string;
  attachments?: FileAttachment[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface GitLabUpdate {
  id: string;
  author: string;
  repo: string;
  message: string;
  timestamp: string;
  linesAdded: number;
  linesRemoved: number;
}

export interface ResourceAllocation {
  id: string;
  employeeId: string;
  employeeName: string;
  title: string;
  projectName: string;
  taskName: string;
  startDate: string;
  endDate: string;
  comments?: string;
}

export interface Credential {
  id: string;
  title: string;
  type: 'API Key' | 'Database' | 'SSH/Server' | 'Service Account' | 'Web Login';
  environment: 'Dev' | 'Staging' | 'Production';
  identifier: string;
  secretValue: string;
  comments?: string;
  lastUpdated: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  // Added profile field to match Google Sheet
  profile: string; 
  userRole: UserRole;
  status: 'Active' | 'On Leave' | 'Offboarded' | 'Inactive';
  projectType: 'Mobile' | 'Web' | 'Both';
  shiftStartTime: string;
  zohoId?: string;
  timeDoctorId?: string;
  reportingManager?: string;
}

export interface Notification {
  id: string;
  source: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'status' | 'assignment' | 'deadline' | 'system';
  channel?: string;
}

export interface NotificationSettings {
  taskAssignments: boolean;
  deadlineApproaching: boolean;
  statusChanges: boolean;
  systemAlerts: boolean;
}

export interface TestCase {
  id: string;
  title: string;
  platform: 'Android' | 'iOS' | 'Web';
  status: 'Pass' | 'Fail' | 'Running' | 'Pending';
  priority: 'Critical' | 'High' | 'Medium';
  lastRun: string;
  type: string;
  automationScript?: string;
}

export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  status: 'Draft' | 'Staging' | 'Production';
  xcodeSynced: boolean;
  windsurfVerified: boolean;
}

export interface UIDesignResult {
  typography?: {
    fontFamily: string;
    letterSpacing: string;
    wordSpacing: string;
    caseStyle: string;
  };
  components: {
    name: string;
    tailwind: string;
    explanation: string;
  }[];
  spacingSystem?: string[];
}