import React from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { OverviewScreen, ReportScreen, ReportTabScreen, IncidentsScreen, LoginScreen } from '../screens';
import { MainTabParamList, Incident, User } from '../types/navigation';
import Ionicons from '@expo/vector-icons/build/Ionicons';

const Tab = createMaterialTopTabNavigator<MainTabParamList>();

interface TabNavigatorProps {
  user: User;
  incidents: Incident[];
  onLogout: () => void;
  onReportIncident: (incident: Omit<Incident, 'id' | 'userId' | 'reportedAt' | 'status'>) => void;
  onEscalateIncident: (incidentId: string) => void;
  showReportModal: boolean;
  setShowReportModal: (show: boolean) => void;
}

const TabNavigator: React.FC<TabNavigatorProps> = ({
  user,
  incidents,
  onLogout,
  onReportIncident,
  onEscalateIncident,
  showReportModal,
  setShowReportModal,
}) => {
  const handleLogoutPress = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: onLogout,
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Top Bar */}
      <View style={{ backgroundColor: '#000', paddingVertical: 20, paddingHorizontal: 16 }}>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700', marginTop:50 }}>Cyber Shield</Text>
        <Text style={{ color: '#ccc', fontSize: 12 }}>Incident Reporting System</Text>
      </View>

      {/* User Info Row */}
      <View style={{ backgroundColor: '#e5e5e5', paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#000' }}>Welcome, {user.name || 'John Doe'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogoutPress}>
          <Ionicons name="log-out-outline" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Top Tab Navigation */}
      <Tab.Navigator
        initialRouteName="Overview"
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: '#000', height: '100%', borderRadius: 4 },
          tabBarStyle: {
            backgroundColor: '#f5f5f5',
            height: 44,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: '500',
            textTransform: 'none',
          },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#000',
        }}
      >
        <Tab.Screen
          name="Overview"
          options={{ tabBarLabel: 'Overview' }}
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
          options={{ tabBarLabel: '+ Report' }}
        >
          {() => (
            <ReportTabScreen
              onSubmit={onReportIncident}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Incidents"
          options={{ tabBarLabel: '⚠ My Reports' }}
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
      
      {/* Modal for Overview screen's Report button */}
      <ReportScreen
        onSubmit={onReportIncident}
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
      />
    </View>
  );
};

export default TabNavigator;
