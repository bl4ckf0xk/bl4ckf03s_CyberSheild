import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation';
import { storage } from './src/utils/storage';
import { User, Incident, AdminUser } from './src/types/navigation';
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
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: 'user'
      };
      setUser(mockUser);
      await storage.setItem('cyberShieldUser', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'Failed to sign in. Please try again.');
    }
  };

  const handleAdminLogin = async (email: string, password: string, badgeNumber: string) => {
    try {
      // Mock admin login - in real app this would validate against backend
      // For demo purposes, any email with 'admin' will be treated as admin
      if (!email.toLowerCase().includes('admin')) {
        Alert.alert('Error', 'Invalid admin credentials');
        return;
      }
      
      const mockAdminUser: AdminUser = {
        id: 'admin_' + Date.now().toString(),
        email,
        name: email.split('@')[0],
        role: 'admin',
        badgeNumber,
        department: 'Cybercrime Unit'
      };
      setUser(mockAdminUser);
      await storage.setItem('cyberShieldUser', JSON.stringify(mockAdminUser));
    } catch (error) {
      console.error('Error during admin login:', error);
      Alert.alert('Error', 'Failed to sign in as admin. Please try again.');
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      // Mock registration - in real app this would create account in backend
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role: 'user'
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

  // Admin-specific functions
  const handleUpdateIncidentStatus = async (incidentId: string, status: string, adminNotes?: string) => {
    if (!user || user.role !== 'admin') return;
    
    try {
      const updatedIncidents = incidents.map(incident =>
        incident.id === incidentId
          ? { 
              ...incident, 
              status: status as any,
              adminNotes: adminNotes || incident.adminNotes,
              lastUpdatedBy: user.name,
              lastUpdatedAt: new Date()
            }
          : incident
      );
      setIncidents(updatedIncidents);
      await storage.setItem('cyberShieldIncidents', JSON.stringify(updatedIncidents));
      
      Alert.alert('Success', `Incident status updated to ${status.replace('_', ' ')}`);
    } catch (error) {
      console.error('Error updating incident status:', error);
      Alert.alert('Error', 'Failed to update incident status. Please try again.');
    }
  };

  const handleForwardToLawEnforcement = async (incidentId: string, lawEnforcementRef: string) => {
    if (!user || user.role !== 'admin') return;
    
    try {
      const updatedIncidents = incidents.map(incident =>
        incident.id === incidentId
          ? { 
              ...incident, 
              status: 'forwarded_to_le' as const,
              lawEnforcementRef,
              forwardedAt: new Date(),
              lastUpdatedBy: user.name,
              lastUpdatedAt: new Date()
            }
          : incident
      );
      setIncidents(updatedIncidents);
      await storage.setItem('cyberShieldIncidents', JSON.stringify(updatedIncidents));
      
      Alert.alert('Success', `Incident forwarded to law enforcement with reference: ${lawEnforcementRef}`);
    } catch (error) {
      console.error('Error forwarding to law enforcement:', error);
      Alert.alert('Error', 'Failed to forward incident. Please try again.');
    }
  };

  const handleViewIncidentDetail = (incidentId: string) => {
    // In a real app, this would navigate to a detailed view
    const incident = incidents.find(i => i.id === incidentId);
    if (incident) {
      Alert.alert(
        incident.title,
        `Description: ${incident.description}\nCategory: ${incident.category}\nSeverity: ${incident.severity}\nStatus: ${incident.status}\nReported: ${incident.reportedAt.toLocaleString()}`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleUpdateLEStatus = async (incidentId: string, status: string) => {
    if (!user || user.role !== 'admin') return;
    
    try {
      const updatedIncidents = incidents.map(incident =>
        incident.id === incidentId
          ? { 
              ...incident, 
              status: status as any,
              lastUpdatedBy: user.name,
              lastUpdatedAt: new Date()
            }
          : incident
      );
      setIncidents(updatedIncidents);
      await storage.setItem('cyberShieldIncidents', JSON.stringify(updatedIncidents));
      
      Alert.alert('Success', `Law enforcement status updated to ${status.replace('_', ' ')}`);
    } catch (error) {
      console.error('Error updating LE status:', error);
      Alert.alert('Error', 'Failed to update law enforcement status. Please try again.');
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
        onAdminLogin={handleAdminLogin}
        onLogout={handleLogout}
        onReportIncident={handleReportIncident}
        onEscalateIncident={handleEscalateIncident}
        onUpdateIncidentStatus={handleUpdateIncidentStatus}
        onForwardToLawEnforcement={handleForwardToLawEnforcement}
        onViewIncidentDetail={handleViewIncidentDetail}
        onUpdateLEStatus={handleUpdateLEStatus}
        showReportModal={showReportModal}
        setShowReportModal={setShowReportModal}
      />
    </SafeAreaProvider>
  );
}
