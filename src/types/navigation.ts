import { NavigatorScreenParams } from '@react-navigation/native';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface AdminUser extends User {
  role: 'admin';
  department?: string;
  badgeNumber?: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'emergency';
  status: 'pending' | 'reviewing' | 'resolved' | 'forwarded_to_le' | 'closed';
  reportedAt: Date;
  userId: string;
  // Admin fields
  assignedTo?: string;
  adminNotes?: string;
  lawEnforcementRef?: string;
  forwardedAt?: Date;
  lastUpdatedBy?: string;
  lastUpdatedAt?: Date;
}

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Admin: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  AdminLogin: undefined;
};

export type MainTabParamList = {
  Overview: undefined;
  Report: undefined;
  Incidents: undefined;
};

export type AdminTabParamList = {
  Dashboard: undefined;
  AllIncidents: undefined;
  LawEnforcement: undefined;
};

export type AdminStackParamList = {
  IncidentDetail: { incidentId: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
