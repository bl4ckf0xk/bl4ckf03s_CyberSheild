import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cyberStyles, cyberColors } from '../styles/cybershield';
import { Incident } from '../types/navigation';

interface IncidentsScreenProps {
  incidents: Incident[];
  onEscalate: (incidentId: string) => void;
}

export function IncidentsScreen({ incidents, onEscalate }: IncidentsScreenProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return { bg: '#fef3c7', text: '#92400e' };
      case 'reviewing': return { bg: '#dbeafe', text: '#1e40af' };
      case 'resolved': return { bg: '#d1fae5', text: '#065f46' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return { bg: '#f3f4f6', text: '#374151' };
      case 'medium': return { bg: '#fef3c7', text: '#92400e' };
      case 'high': return { bg: '#fecaca', text: '#991b1b' };
      case 'emergency': return { bg: '#dc2626', text: '#ffffff' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const handleEscalate = (incident: Incident) => {
    Alert.alert(
      'Escalate Incident',
      `Are you sure you want to escalate "${incident.title}" to emergency priority?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Escalate', 
          style: 'destructive',
          onPress: () => onEscalate(incident.id)
        }
      ]
    );
  };

  const IncidentCard = ({ incident }: { incident: Incident }) => {
    const statusColors = getStatusColor(incident.status);
    const severityColors = getSeverityColor(incident.severity);

    return (
      <View style={cyberStyles.card}>
        <View style={[cyberStyles.row, cyberStyles.spaceBetween, cyberStyles.mb2]}>
          <Text style={[cyberStyles.text, { fontWeight: '600', flex: 1 }]} numberOfLines={1}>
            {incident.title}
          </Text>
          <TouchableOpacity 
            onPress={() => handleEscalate(incident)}
            style={{ marginLeft: 8 }}
            disabled={incident.severity === 'emergency'}
          >
            <Ionicons 
              name="alert-circle-outline" 
              size={20} 
              color={incident.severity === 'emergency' ? cyberColors.mutedForeground : cyberColors.danger} 
            />
          </TouchableOpacity>
        </View>

        <Text style={[cyberStyles.textSmall, cyberStyles.mb2]} numberOfLines={2}>
          {incident.description}
        </Text>

        <View style={[cyberStyles.row, cyberStyles.spaceBetween, cyberStyles.mb2]}>
          <Text style={cyberStyles.textSmall}>{incident.category}</Text>
          <Text style={cyberStyles.textSmall}>
            {incident.reportedAt.toLocaleDateString()}
          </Text>
        </View>

        <View style={[cyberStyles.row, cyberStyles.spaceBetween]}>
          <View style={[cyberStyles.badge, { backgroundColor: statusColors.bg }]}>
            <Text style={[cyberStyles.badgeText, { color: statusColors.text }]}>
              {incident.status}
            </Text>
          </View>
          <View style={[cyberStyles.badge, { backgroundColor: severityColors.bg }]}>
            <Text style={[cyberStyles.badgeText, { color: severityColors.text }]}>
              {incident.severity}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (incidents.length === 0) {
    return (
      <View style={cyberStyles.centerContainer}>
        <Ionicons name="document-text-outline" size={64} color={cyberColors.mutedForeground} />
        <Text style={[cyberStyles.title, { textAlign: 'center', marginTop: 16 }]}>
          No Incidents Reported
        </Text>
        <Text style={[cyberStyles.subtitle, { textAlign: 'center' }]}>
          Your reported incidents will appear here once you submit them.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={cyberStyles.container} showsVerticalScrollIndicator={false}>
      <View style={cyberStyles.px4}>
        <Text style={[cyberStyles.title, cyberStyles.mt4]}>My Reports</Text>
        <Text style={cyberStyles.subtitle}>
          {incidents.length} incident{incidents.length !== 1 ? 's' : ''} reported
        </Text>

        {incidents.map((incident) => (
          <IncidentCard key={incident.id} incident={incident} />
        ))}
      </View>
    </ScrollView>
  );
}
