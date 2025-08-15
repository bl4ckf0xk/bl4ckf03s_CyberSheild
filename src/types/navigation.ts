import { NavigatorScreenParams } from '@react-navigation/native';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'emergency';
  status: 'pending' | 'reviewing' | 'resolved';
  reportedAt: Date;
  userId: string;
}

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Overview: undefined;
  Report: undefined;
  Incidents: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
