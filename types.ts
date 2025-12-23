
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
  TEAM_MEMBER = 'Team Member'
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  url: string; 
  size: number;
}

export interface EstimationResult {
  totalDurationDays: number;
  breakdown: {
    backend: number;
    admin: number;
    web: number;
    android: number;
    ios: number;
    qa: number;
  };
  complexity: 'Low' | 'Medium' | 'High';
  reusableModulesFound: string[];
  externalIntegrations: string[];
  risks: string[];
  justification: string;
}

export interface EstimationMethodology {
  id: string;
  category: string;
  task: string;
  standardHours: number;
  description: string;
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

export interface Notification {
  id: string;
  source: 'Zoho' | 'Slack' | 'TimeDoctor' | 'GitLab' | 'System';
  message: string;
  timestamp: string;
  read: boolean;
  type: 'status' | 'alert' | 'system' | 'assignment' | 'deadline';
  channel?: string;
}

// Added missing GitLabUpdate interface
export interface GitLabUpdate {
  id: string;
  author: string;
  repo: string;
  message: string;
  timestamp: string;
  linesAdded: number;
  linesRemoved: number;
}

// Added missing TestCase interface
export interface TestCase {
  id: string;
  title: string;
  platform: 'Android' | 'iOS' | 'Web';
  status: 'Pass' | 'Fail' | 'Running' | 'Pending';
  priority: 'Critical' | 'Medium' | 'Low';
  type: string;
  lastRun: string;
  automationScript?: string;
}

// Added missing ApiEndpoint interface
export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  status: 'Deployed' | 'Draft' | 'Deprecated';
  xcodeSynced: boolean;
  windsurfVerified: boolean;
}

// Added missing ResourceAllocation interface
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

// Added missing Credential interface
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

// Added missing NotificationSettings interface
export interface NotificationSettings {
  taskAssignments: boolean;
  deadlineApproaching: boolean;
  statusChanges: boolean;
  systemAlerts: boolean;
}

// Added missing IntegrationSettings interface
export interface IntegrationSettings {
  maxIdleMinutes: number;
  shiftStartTime: string;
  slackAlertChannel: string;
  reportingFrequency: 'Daily' | 'Weekly' | 'Monthly';
}

// Added missing ServiceConnection interface
export interface ServiceConnection {
  id: string;
  name: string;
  status: 'Connected' | 'Disconnected' | 'Syncing';
  lastSync: string;
}

// Added missing TeamMember interface
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  userRole: UserRole;
  status: 'Active' | 'On Leave' | 'Offboarded';
  projectType: 'Mobile' | 'Web' | 'Both';
  shiftStartTime: string;
  zohoId?: string;
  timeDoctorId?: string;
}
