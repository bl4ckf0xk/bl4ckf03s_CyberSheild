import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cyberStyles, cyberColors } from '../styles/cybershield';
import { Incident, AdminUser } from '../types/navigation';

interface AllIncidentsScreenProps {
  user: AdminUser;
  incidents: Incident[];
  onUpdateIncidentStatus: (incidentId: string, status: string, adminNotes?: string) => void;
  onForwardToLawEnforcement: (incidentId: string, lawEnforcementRef: string) => void;
  onViewIncidentDetail: (incidentId: string) => void;
}

export function AllIncidentsScreen({ 
  user, 
  incidents, 
  onUpdateIncidentStatus,
  onForwardToLawEnforcement,
  onViewIncidentDetail
}: AllIncidentsScreenProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredIncidents = incidents.filter(incident => {
    const statusMatch = filterStatus === 'all' || incident.status === filterStatus;
    const severityMatch = filterSeverity === 'all' || incident.severity === filterSeverity;
    return statusMatch && severityMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return { bg: '#fef3c7', text: '#92400e' };
      case 'reviewing': return { bg: '#dbeafe', text: '#1e40af' };
      case 'resolved': return { bg: '#d1fae5', text: '#065f46' };
      case 'forwarded_to_le': return { bg: '#fecaca', text: '#991b1b' };
      case 'closed': return { bg: '#f3f4f6', text: '#374151' };
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

  const handleStatusChange = (incident: Incident) => {
    Alert.alert(
      'Update Status',
      `Change status for "${incident.title}"`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Set to Reviewing', onPress: () => onUpdateIncidentStatus(incident.id, 'reviewing') },
        { text: 'Mark Resolved', onPress: () => onUpdateIncidentStatus(incident.id, 'resolved') },
        { text: 'Close Case', onPress: () => onUpdateIncidentStatus(incident.id, 'closed') },
      ]
    );
  };

  const handleForwardToLE = (incident: Incident) => {
    Alert.prompt(
      'Forward to Law Enforcement',
      `Enter law enforcement reference number for "${incident.title}"`,
      (refNumber) => {
        if (refNumber) {
          onForwardToLawEnforcement(incident.id, refNumber);
        }
      },
      'plain-text',
      '',
      'default'
    );
  };

  const IncidentCard = ({ incident }: { incident: Incident }) => {
    const statusColors = getStatusColor(incident.status);
    const severityColors = getSeverityColor(incident.severity);

    return (
      <TouchableOpacity 
        style={cyberStyles.card} 
        onPress={() => onViewIncidentDetail(incident.id)}
      >
        <View style={[cyberStyles.row, cyberStyles.spaceBetween, cyberStyles.mb2]}>
          <Text style={[cyberStyles.text, { fontWeight: '600', flex: 1 }]} numberOfLines={1}>
            {incident.title}
          </Text>
          <View style={[cyberStyles.row, { gap: 8 }]}>
            <TouchableOpacity onPress={() => handleStatusChange(incident)}>
              <Ionicons name="create-outline" size={20} color={cyberColors.primary} />
            </TouchableOpacity>
            {incident.status !== 'forwarded_to_le' && (
              <TouchableOpacity onPress={() => handleForwardToLE(incident)}>
                <Ionicons name="send-outline" size={20} color={cyberColors.danger} />
              </TouchableOpacity>
            )}
          </View>
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

        {incident.assignedTo && (
          <Text style={[cyberStyles.textSmall, cyberStyles.mb2]}>
            Assigned to: {incident.assignedTo}
          </Text>
        )}

        {incident.lawEnforcementRef && (
          <Text style={[cyberStyles.textSmall, cyberColors.danger, cyberStyles.mb2]}>
            LE Ref: {incident.lawEnforcementRef}
          </Text>
        )}

        <View style={[cyberStyles.row, cyberStyles.spaceBetween]}>
          <View style={[cyberStyles.badge, { backgroundColor: statusColors.bg }]}>
            <Text style={[cyberStyles.badgeText, { color: statusColors.text }]}>
              {incident.status.replace('_', ' ')}
            </Text>
          </View>
          <View style={[cyberStyles.badge, { backgroundColor: severityColors.bg }]}>
            <Text style={[cyberStyles.badgeText, { color: severityColors.text }]}>
              {incident.severity}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={cyberStyles.container} showsVerticalScrollIndicator={false}>
      <View style={cyberStyles.px4}>
        <Text style={[cyberStyles.title, cyberStyles.mt4]}>All Incidents</Text>
        <Text style={cyberStyles.subtitle}>
          {filteredIncidents.length} of {incidents.length} incidents
        </Text>

        {/* Filters */}
        <View style={[cyberStyles.row, cyberStyles.spaceBetween, { marginVertical: 16 }]}>
          <View style={{ flex: 0.48 }}>
            <Text style={[cyberStyles.textSmall, { marginBottom: 4, fontWeight: '600' }]}>Status</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
              {['all', 'pending', 'reviewing', 'resolved', 'forwarded_to_le'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    cyberStyles.badge,
                    {
                      backgroundColor: filterStatus === status ? cyberColors.primary : '#f3f4f6',
                      marginBottom: 4,
                    }
                  ]}
                  onPress={() => setFilterStatus(status)}
                >
                  <Text style={[
                    cyberStyles.badgeText,
                    { color: filterStatus === status ? '#fff' : '#374151', fontSize: 10 }
                  ]}>
                    {status === 'all' ? 'All' : status.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{ flex: 0.48 }}>
            <Text style={[cyberStyles.textSmall, { marginBottom: 4, fontWeight: '600' }]}>Severity</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
              {['all', 'low', 'medium', 'high', 'emergency'].map((severity) => (
                <TouchableOpacity
                  key={severity}
                  style={[
                    cyberStyles.badge,
                    {
                      backgroundColor: filterSeverity === severity ? cyberColors.primary : '#f3f4f6',
                      marginBottom: 4,
                    }
                  ]}
                  onPress={() => setFilterSeverity(severity)}
                >
                  <Text style={[
                    cyberStyles.badgeText,
                    { color: filterSeverity === severity ? '#fff' : '#374151', fontSize: 10 }
                  ]}>
                    {severity === 'all' ? 'All' : severity}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Incidents List */}
        {filteredIncidents.length > 0 ? (
          filteredIncidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))
        ) : (
          <View style={cyberStyles.centerContainer}>
            <Ionicons name="document-text-outline" size={64} color={cyberColors.mutedForeground} />
            <Text style={[cyberStyles.title, { textAlign: 'center', marginTop: 16 }]}>
              No Incidents Found
            </Text>
            <Text style={[cyberStyles.subtitle, { textAlign: 'center' }]}>
              No incidents match your current filter criteria.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
