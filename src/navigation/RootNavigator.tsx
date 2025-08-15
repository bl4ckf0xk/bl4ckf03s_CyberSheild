import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import AuthNavigator from './AuthNavigator';
import { RootStackParamList, User, Incident } from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

interface RootNavigatorProps {
  user: User | null;
  incidents: Incident[];
  onLogin: (email: string, password: string) => void;
  onRegister: (name: string, email: string, password: string) => void;
  onReportIncident: (incident: Omit<Incident, 'id' | 'userId' | 'reportedAt' | 'status'>) => void;
  onEscalateIncident: (incidentId: string) => void;
  showReportModal: boolean;
  setShowReportModal: (show: boolean) => void;
}

const RootNavigator: React.FC<RootNavigatorProps> = ({
  user,
  incidents,
  onLogin,
  onRegister,
  onReportIncident,
  onEscalateIncident,
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
              />
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Main">
            {() => (
              <TabNavigator
                user={user}
                incidents={incidents}
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
