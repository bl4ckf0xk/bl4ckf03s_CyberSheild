import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import AuthNavigator from './AuthNavigator';
import AdminTabNavigator from './AdminTabNavigator';
import { RootStackParamList, User, Incident, AdminUser } from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

interface RootNavigatorProps {
  user: User | null;
  incidents: Incident[];
  onLogin: (email: string, password: string) => void;
  onRegister: (name: string, email: string, password: string) => void;
  onAdminLogin: (email: string, password: string, badgeNumber: string) => void;
  onLogout: () => void;
  onReportIncident: (incident: Omit<Incident, 'id' | 'userId' | 'reportedAt' | 'status'>) => void;
  onEscalateIncident: (incidentId: string) => void;
  onUpdateIncidentStatus: (incidentId: string, status: string, adminNotes?: string) => void;
  onForwardToLawEnforcement: (incidentId: string, lawEnforcementRef: string) => void;
  onViewIncidentDetail: (incidentId: string) => void;
  onUpdateLEStatus: (incidentId: string, status: string) => void;
  showReportModal: boolean;
  setShowReportModal: (show: boolean) => void;
}

const RootNavigator: React.FC<RootNavigatorProps> = ({
  user,
  incidents,
  onLogin,
  onRegister,
  onAdminLogin,
  onLogout,
  onReportIncident,
  onEscalateIncident,
  onUpdateIncidentStatus,
  onForwardToLawEnforcement,
  onViewIncidentDetail,
  onUpdateLEStatus,
  showReportModal,
  setShowReportModal,
}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!user ? (
          <Stack.Screen name="Auth">
            {() => (
              <AuthNavigator
                onLogin={onLogin}
                onRegister={onRegister}
                onAdminLogin={onAdminLogin}
              />
            )}
          </Stack.Screen>
        ) : user.role === 'admin' ? (
          <Stack.Screen name="Admin">
            {() => (
              <AdminTabNavigator
                user={user as AdminUser}
                incidents={incidents}
                onLogout={onLogout}
                onUpdateIncidentStatus={onUpdateIncidentStatus}
                onForwardToLawEnforcement={onForwardToLawEnforcement}
                onViewIncidentDetail={onViewIncidentDetail}
                onUpdateLEStatus={onUpdateLEStatus}
              />
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Main">
            {() => (
              <TabNavigator
                user={user}
                incidents={incidents}
                onLogout={onLogout}
                onReportIncident={onReportIncident}
                onEscalateIncident={onEscalateIncident}
                showReportModal={showReportModal}
                setShowReportModal={setShowReportModal}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
