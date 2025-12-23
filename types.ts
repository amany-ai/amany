
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
  url: string; // base64 or blob URL
  size: number;
}

export interface NotificationSettings {
  taskAssignments: boolean;
  deadlineApproaching: boolean;
  statusChanges: boolean;
  systemAlerts: boolean;
}

export interface Credential {
  id: string;
  title: string;
  type: 'API Key' | 'Database' | 'SSH/Server' | 'Service Account' | 'Web Login';
  environment: 'Dev' | 'Staging' | 'Production';
  identifier: string;
  secretValue: string;
  comments: string;
  lastUpdated: string;
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
  comments: string;
}

export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  status: 'Draft' | 'Deployed' | 'Deprecated';
  xcodeSynced: boolean;
  windsurfVerified: boolean;
  attachments?: FileAttachment[];
}

export interface TestCase {
  id: string;
  title: string;
  type: 'Functional' | 'UI' | 'Performance' | 'Security';
  priority: 'Critical' | 'High' | 'Medium';
  status: 'Pass' | 'Fail' | 'Pending' | 'Running';
  platform: 'Android' | 'iOS' | 'Web' | 'API';
  automationScript?: string;
  lastRun?: string;
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

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password?: string;
  avatar?: string;
  notificationSettings?: NotificationSettings;
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
  testResults?: {
    total: number;
    passed: number;
    failed: number;
  };
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

export interface Notification {
  id: string;
  source: 'Zoho' | 'Slack' | 'TimeDoctor' | 'GitLab' | 'System';
  message: string;
  timestamp: string;
  read: boolean;
  type: 'status' | 'alert' | 'system' | 'assignment' | 'deadline';
  channel?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  userRole: UserRole;
  projectType: 'Mobile' | 'Web' | 'Both';
  shiftStartTime: string;
  status: 'Active' | 'On Leave' | 'Offboarded';
  zohoId?: string;
  timeDoctorId?: string;
}

export interface IntegrationSettings {
  maxIdleMinutes: number;
  shiftStartTime: string;
  slackAlertChannel: string;
  reportingFrequency: string;
}

export interface ServiceConnection {
  id: string;
  name: string;
  status: string;
  lastSync: string;
}

export interface EstimationResult {
  totalHours: number;
  complexity: string;
  roleBreakdown: { role: string; hours: number }[];
  risks: string[];
  suggestedTimelineWeeks: number;
  estimatedCost: string;
}
