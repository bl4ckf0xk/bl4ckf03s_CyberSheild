import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation';
import { storage } from './src/utils/storage';
import { User, Incident } from './src/types/navigation';
import { Loading } from './src/components';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Load user data
      const storedUser = await storage.getItem('cyberShieldUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      // Load incidents data
      const storedIncidents = await storage.getItem('cyberShieldIncidents');
      if (storedIncidents) {
        const parsedIncidents = JSON.parse(storedIncidents).map((incident: any) => ({
          ...incident,
          reportedAt: new Date(incident.reportedAt)
        }));
        setIncidents(parsedIncidents);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      // Mock login - in real app this would validate against backend
      const mockUser = {
        id: '1',
        email,
        name: email.split('@')[0]
      };
      setUser(mockUser);
      await storage.setItem('cyberShieldUser', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'Failed to sign in. Please try again.');
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      // Mock registration - in real app this would create account in backend
      const mockUser = {
        id: Date.now().toString(),
        email,
        name
      };
      setUser(mockUser);
      await storage.setItem('cyberShieldUser', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert('Error', 'Failed to create account. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      setUser(null);
      await storage.removeItem('cyberShieldUser');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleReportIncident = async (incidentData: Omit<Incident, 'id' | 'userId' | 'reportedAt' | 'status'>) => {
    if (!user) return;

    try {
      const newIncident: Incident = {
        ...incidentData,
        id: Date.now().toString(),
        userId: user.id,
        reportedAt: new Date(),
        status: 'pending'
      };
      
      const updatedIncidents = [...incidents, newIncident];
      setIncidents(updatedIncidents);
      await storage.setItem('cyberShieldIncidents', JSON.stringify(updatedIncidents));
      
      setShowReportModal(false);
      Alert.alert('Success', 'Incident reported successfully!');
    } catch (error) {
      console.error('Error reporting incident:', error);
      Alert.alert('Error', 'Failed to report incident. Please try again.');
    }
  };

  const handleEscalateIncident = async (incidentId: string) => {
    try {
      const updatedIncidents = incidents.map(incident =>
        incident.id === incidentId
          ? { ...incident, severity: 'emergency' as const }
          : incident
      );
      setIncidents(updatedIncidents);
      await storage.setItem('cyberShieldIncidents', JSON.stringify(updatedIncidents));
      
      Alert.alert('Success', 'Incident escalated to emergency priority!');
    } catch (error) {
      console.error('Error escalating incident:', error);
      Alert.alert('Error', 'Failed to escalate incident. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <Loading visible={true} text="Loading CyberShield..." overlay={false} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <RootNavigator
        user={user}
        incidents={incidents}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onReportIncident={handleReportIncident}
        onEscalateIncident={handleEscalateIncident}
        showReportModal={showReportModal}
        setShowReportModal={setShowReportModal}
      />
    </SafeAreaProvider>
  );
}
