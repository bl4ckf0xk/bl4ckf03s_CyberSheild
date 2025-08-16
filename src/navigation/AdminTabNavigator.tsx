import React from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { AdminDashboardScreen, AllIncidentsScreen, LawEnforcementScreen } from '../screens';
import { AdminTabParamList, Incident, AdminUser } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { cyberColors } from '../styles/cybershield';

const Tab = createMaterialTopTabNavigator<AdminTabParamList>();

interface AdminTabNavigatorProps {
  user: AdminUser;
  incidents: Incident[];
  onLogout: () => void;
  onUpdateIncidentStatus: (incidentId: string, status: string, adminNotes?: string) => void;
  onForwardToLawEnforcement: (incidentId: string, lawEnforcementRef: string) => void;
  onViewIncidentDetail: (incidentId: string) => void;
  onUpdateLEStatus: (incidentId: string, status: string) => void;
}

const AdminTabNavigator: React.FC<AdminTabNavigatorProps> = ({
  user,
  incidents,
  onLogout,
  onUpdateIncidentStatus,
  onForwardToLawEnforcement,
  onViewIncidentDetail,
  onUpdateLEStatus,
}) => {
  const handleLogoutPress = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to sign out from admin panel?',
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
      {/* Admin Top Bar */}
      <View style={{ backgroundColor: '#dc2626', paddingVertical: 20, paddingHorizontal: 16 }}>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700', marginTop: 50 }}>
          CyberShield Admin Panel
        </Text>
        <Text style={{ color: '#fecaca', fontSize: 12 }}>
          Incident Management System
        </Text>
      </View>

      {/* Admin Info Row */}
      <View style={{ 
        backgroundColor: '#fef2f2', 
        paddingVertical: 12, 
        paddingHorizontal: 16, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="shield-checkmark" size={16} color="#dc2626" style={{ marginRight: 8 }} />
          <Text style={{ fontSize: 16, color: '#000' }}>
            Admin: {user.name}
            {user.badgeNumber && ` (Badge: ${user.badgeNumber})`}
          </Text>
        </View>
        <TouchableOpacity onPress={handleLogoutPress}>
          <Ionicons name="log-out-outline" size={20} color="#dc2626" />
        </TouchableOpacity>
      </View>

      {/* Admin Tab Navigation */}
      <Tab.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: '#dc2626', height: '100%', borderRadius: 4 },
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
          name="Dashboard"
          options={{ tabBarLabel: 'Dashboard' }}
        >
          {(props) => (
            <AdminDashboardScreen
              {...props}
              user={user}
              incidents={incidents}
              onNavigateToAllIncidents={() => props.navigation.navigate('AllIncidents')}
              onNavigateToLawEnforcement={() => props.navigation.navigate('LawEnforcement')}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="AllIncidents"
          options={{ tabBarLabel: '📋 All Cases' }}
        >
          {(props) => (
            <AllIncidentsScreen
              {...props}
              user={user}
              incidents={incidents}
              onUpdateIncidentStatus={onUpdateIncidentStatus}
              onForwardToLawEnforcement={onForwardToLawEnforcement}
              onViewIncidentDetail={onViewIncidentDetail}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="LawEnforcement"
          options={{ tabBarLabel: '🚔 Law Enforcement' }}
        >
          {(props) => (
            <LawEnforcementScreen
              {...props}
              user={user}
              incidents={incidents}
              onViewIncidentDetail={onViewIncidentDetail}
              onUpdateLEStatus={onUpdateLEStatus}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

export default AdminTabNavigator;
