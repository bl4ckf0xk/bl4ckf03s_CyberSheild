// Database types for CyberShield backend

export type UserRole = 'user' | 'admin';

export type IncidentStatus = 
  | 'pending' 
  | 'reviewing' 
  | 'resolved' 
  | 'forwarded_to_le' 
  | 'closed';

export type IncidentSeverity = 
  | 'low' 
  | 'medium' 
  | 'high' 
  | 'emergency';

export type IncidentCategory = 
  | 'phishing'
  | 'malware'
  | 'ransomware'
  | 'data_breach'
  | 'identity_theft'
  | 'financial_fraud'
  | 'social_engineering'
  | 'other';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  organization?: string;
  created_at: Date;
  updated_at: Date;
}

export interface AdminUser {
  id: string;
  badge_number: string;
  department: string;
  clearance_level: number;
  supervisor_id?: string;
  is_active: boolean;
  last_login?: Date;
  created_at: Date;
  // Extended from User
  user: User;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  user_id: string;
  
  // Admin fields
  assigned_to?: string;
  admin_notes?: string;
  law_enforcement_ref?: string;
  forwarded_at?: Date;
  last_updated_by?: string;
  last_updated_at: Date;
  
  // Evidence and attachments
  evidence_files: EvidenceFile[];
  
  // Location and technical details
  ip_address?: string;
  user_agent?: string;
  location?: LocationData;
  
  // Timestamps
  incident_date?: Date;
  reported_at: Date;
  resolved_at?: Date;
  
  // Relations
  user?: User;
  assignedAdmin?: AdminUser;
  updates?: IncidentUpdate[];
}

export interface EvidenceFile {
  id: string;
  filename: string;
  url: string;
  file_type: string;
  file_size: number;
  uploaded_at: Date;
}

export interface LocationData {
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

export interface IncidentUpdate {
  id: string;
  incident_id: string;
  updated_by: string;
  old_status: IncidentStatus;
  new_status: IncidentStatus;
  update_notes?: string;
  created_at: Date;
  
  // Relations
  updatedBy?: User;
}

export interface LawEnforcementCase {
  id: string;
  incident_id: string;
  reference_number: string;
  agency_name: string;
  officer_contact: OfficerContact;
  case_status: string;
  priority_level: number;
  forwarded_by: string;
  forwarded_at: Date;
  last_contact?: Date;
  case_notes?: string;
  
  // Relations
  incident?: Incident;
  forwardedBy?: AdminUser;
}

export interface OfficerContact {
  name: string;
  email: string;
  phone: string;
  badge: string;
}

export interface Notification {
  id: string;
  user_id: string;
  incident_id?: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_read: boolean;
  created_at: Date;
  
  // Relations
  user?: User;
  incident?: Incident;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
  
  // Relations
  user?: User;
}

// API Request/Response Types
export interface CreateIncidentRequest {
  title: string;
  description: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  incident_date?: string;
  evidence_files?: File[];
  location?: Partial<LocationData>;
}

export interface UpdateIncidentStatusRequest {
  status: IncidentStatus;
  admin_notes?: string;
  assigned_to?: string;
}

export interface ForwardToLERequest {
  law_enforcement_ref: string;
  agency_name: string;
  officer_contact: OfficerContact;
  priority_level: number;
  case_notes?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginRequest extends LoginRequest {
  badge_number: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  organization?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refresh_token: string;
  expires_in: number;
}

export interface AdminAuthResponse extends AuthResponse {
  admin_details: AdminUser;
}

// Dashboard Analytics Types
export interface DashboardStats {
  total_incidents: number;
  pending_incidents: number;
  reviewing_incidents: number;
  resolved_incidents: number;
  forwarded_incidents: number;
  emergency_incidents: number;
  incidents_today: number;
  incidents_this_week: number;
  incidents_this_month: number;
  average_resolution_time: number; // in hours
  severity_breakdown: {
    low: number;
    medium: number;
    high: number;
    emergency: number;
  };
  category_breakdown: Record<IncidentCategory, number>;
  status_breakdown: Record<IncidentStatus, number>;
  recent_incidents: Incident[];
}

// Database Table Names
export const Tables = {
  USERS: 'users',
  ADMIN_USERS: 'admin_users',
  INCIDENTS: 'incidents',
  INCIDENT_UPDATES: 'incident_updates',
  LAW_ENFORCEMENT_CASES: 'law_enforcement_cases',
  NOTIFICATIONS: 'notifications',
  AUDIT_LOGS: 'audit_logs'
} as const;

// Supabase Database Response Types
export interface DatabaseResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface DatabaseListResponse<T> {
  data: T[] | null;
  error: Error | null;
  count?: number;
}

// Query Options
export interface QueryOptions {
  limit?: number;
  offset?: number;
  order_by?: string;
  order_direction?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export interface IncidentFilters {
  status?: IncidentStatus[];
  severity?: IncidentSeverity[];
  category?: IncidentCategory[];
  assigned_to?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}
