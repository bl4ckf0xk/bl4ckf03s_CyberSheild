import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { OverviewScreen, ReportScreen, IncidentsScreen } from '../screens';
import { MainTabParamList, Incident, User } from '../types/navigation';
import { cyberColors } from '../styles/cybershield';

const Tab = createBottomTabNavigator<MainTabParamList>();

interface TabNavigatorProps {
  user: User;
  incidents: Incident[];
  onReportIncident: (incident: Omit<Incident, 'id' | 'userId' | 'reportedAt' | 'status'>) => void;
  onEscalateIncident: (incidentId: string) => void;
  showReportModal: boolean;
  setShowReportModal: (show: boolean) => void;
}

const TabNavigator: React.FC<TabNavigatorProps> = ({
  user,
  incidents,
  onReportIncident,
  onEscalateIncident,
  showReportModal,
  setShowReportModal,
}) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5E7',
          paddingBottom: 8,
          paddingTop: 8,
          height: 84,
        },
        tabBarActiveTintColor: cyberColors.primary,
        tabBarInactiveTintColor: cyberColors.mutedForeground,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Overview"
        options={{
          tabBarLabel: 'Overview',
          tabBarIcon: ({ color }) => (
            <TabIcon name="📊" color={color} />
          ),
        }}
      >
        {(props) => (
          <OverviewScreen
            {...props}
            incidents={incidents}
            onNavigateToReport={() => setShowReportModal(true)}
            onNavigateToIncidents={() => props.navigation.navigate('Incidents')}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Report"
        options={{
          tabBarLabel: 'Report',
          tabBarIcon: ({ color }) => (
            <TabIcon name="📝" color={color} />
          ),
        }}
      >
        {() => (
          <ReportScreen
            onSubmit={onReportIncident}
            visible={showReportModal}
            onClose={() => setShowReportModal(false)}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Incidents"
        options={{
          tabBarLabel: 'My Reports',
          tabBarIcon: ({ color }) => (
            <TabIcon name="📋" color={color} />
          ),
        }}
      >
        {(props) => (
          <IncidentsScreen
            {...props}
            incidents={incidents.filter(i => i.userId === user.id)}
            onEscalate={onEscalateIncident}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

interface TabIconProps {
  name: string;
  color: string;
}

const TabIcon: React.FC<TabIconProps> = ({ name }) => {
  return <Text style={{ fontSize: 24 }}>{name}</Text>;
};

export default TabNavigator;
