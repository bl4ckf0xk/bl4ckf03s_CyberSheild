import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cyberStyles, cyberColors } from '../styles/cybershield';
import { Incident, AdminUser } from '../types/navigation';

interface LawEnforcementScreenProps {
  user: AdminUser;
  incidents: Incident[];
  onViewIncidentDetail: (incidentId: string) => void;
  onUpdateLEStatus: (incidentId: string, status: string) => void;
}

export function LawEnforcementScreen({ 
  user, 
  incidents,
  onViewIncidentDetail,
  onUpdateLEStatus
}: LawEnforcementScreenProps) {
  const forwardedIncidents = incidents.filter(incident => 
    incident.status === 'forwarded_to_le' || incident.lawEnforcementRef
  );

  const handleContactLE = () => {
    Alert.alert(
      'Contact Law Enforcement',
      'Choose contact method',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Emergency', onPress: () => Linking.openURL('tel:911') },
        { text: 'Call Non-Emergency', onPress: () => Linking.openURL('tel:311') },
        { text: 'Email Cybercrime Unit', onPress: () => Linking.openURL('mailto:cybercrime@law.enforcement.gov') },
      ]
    );
  };

  const handleUpdateStatus = (incident: Incident) => {
    Alert.alert(
      'Update LE Status',
      `Update law enforcement status for "${incident.title}"`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Under Investigation', onPress: () => onUpdateLEStatus(incident.id, 'under_investigation') },
        { text: 'Completed', onPress: () => onUpdateLEStatus(incident.id, 'completed') },
        { text: 'Closed', onPress: () => onUpdateLEStatus(incident.id, 'closed') },
      ]
    );
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

  const ForwardedIncidentCard = ({ incident }: { incident: Incident }) => {
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
          <TouchableOpacity onPress={() => handleUpdateStatus(incident)}>
            <Ionicons name="create-outline" size={20} color={cyberColors.primary} />
          </TouchableOpacity>
        </View>

        <Text style={[cyberStyles.textSmall, cyberStyles.mb2]} numberOfLines={2}>
          {incident.description}
        </Text>

        <View style={[cyberStyles.row, cyberStyles.spaceBetween, cyberStyles.mb2]}>
          <Text style={cyberStyles.textSmall}>{incident.category}</Text>
          <Text style={cyberStyles.textSmall}>
            Reported: {incident.reportedAt.toLocaleDateString()}
          </Text>
        </View>

        {incident.lawEnforcementRef && (
          <View style={[cyberStyles.row, cyberStyles.mb2]}>
            <Ionicons name="shield-outline" size={16} color={cyberColors.danger} style={{ marginRight: 4 }} />
            <Text style={[cyberStyles.textSmall, { color: cyberColors.danger, fontWeight: '600' }]}>
              LE Ref: {incident.lawEnforcementRef}
            </Text>
          </View>
        )}

        {incident.forwardedAt && (
          <Text style={[cyberStyles.textSmall, cyberStyles.mb2]}>
            Forwarded: {incident.forwardedAt.toLocaleDateString()}
          </Text>
        )}

        <View style={[cyberStyles.row, cyberStyles.spaceBetween]}>
          <View style={[cyberStyles.badge, { backgroundColor: cyberColors.danger }]}>
            <Text style={[cyberStyles.badgeText, { color: '#fff' }]}>
              Forwarded to LE
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
        <Text style={[cyberStyles.title, cyberStyles.mt4]}>Law Enforcement Portal</Text>
        <Text style={cyberStyles.subtitle}>
          {forwardedIncidents.length} cases forwarded to law enforcement
        </Text>

        {/* Contact Law Enforcement */}
        <TouchableOpacity 
          style={[cyberStyles.card, { backgroundColor: cyberColors.danger, marginVertical: 16 }]}
          onPress={handleContactLE}
        >
          <View style={[cyberStyles.row, { alignItems: 'center' }]}>
            <Ionicons name="call-outline" size={24} color="#fff" style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={[cyberStyles.text, { color: '#fff', fontWeight: '600' }]}>
                Contact Law Enforcement
              </Text>
              <Text style={[cyberStyles.textSmall, { color: '#fff', opacity: 0.9 }]}>
                Emergency and non-emergency contacts
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Statistics */}
        <View style={[cyberStyles.row, cyberStyles.spaceBetween, { marginBottom: 16 }]}>
          <View style={[cyberStyles.card, { flex: 0.32, alignItems: 'center', paddingVertical: 12 }]}>
            <Text style={[cyberStyles.text, { fontWeight: '600', color: cyberColors.danger }]}>
              {forwardedIncidents.length}
            </Text>
            <Text style={[cyberStyles.textSmall, { textAlign: 'center' }]}>
              Total Forwarded
            </Text>
          </View>
          
          <View style={[cyberStyles.card, { flex: 0.32, alignItems: 'center', paddingVertical: 12 }]}>
            <Text style={[cyberStyles.text, { fontWeight: '600', color: cyberColors.warning }]}>
              {forwardedIncidents.filter(i => i.severity === 'emergency').length}
            </Text>
            <Text style={[cyberStyles.textSmall, { textAlign: 'center' }]}>
              Emergency
            </Text>
          </View>
          
          <View style={[cyberStyles.card, { flex: 0.32, alignItems: 'center', paddingVertical: 12 }]}>
            <Text style={[cyberStyles.text, { fontWeight: '600', color: cyberColors.success }]}>
              {forwardedIncidents.filter(i => i.status === 'resolved').length}
            </Text>
            <Text style={[cyberStyles.textSmall, { textAlign: 'center' }]}>
              Resolved
            </Text>
          </View>
        </View>

        {/* Forwarded Incidents */}
        <Text style={[cyberStyles.text, { fontWeight: '600', marginBottom: 12 }]}>
          Forwarded Cases
        </Text>

        {forwardedIncidents.length > 0 ? (
          forwardedIncidents
            .sort((a, b) => {
              // Sort by severity (emergency first) then by forwarded date
              const severityOrder = { emergency: 4, high: 3, medium: 2, low: 1 };
              const aSeverity = severityOrder[a.severity as keyof typeof severityOrder] || 0;
              const bSeverity = severityOrder[b.severity as keyof typeof severityOrder] || 0;
              
              if (aSeverity !== bSeverity) {
                return bSeverity - aSeverity;
              }
              
              return (b.forwardedAt?.getTime() || 0) - (a.forwardedAt?.getTime() || 0);
            })
            .map((incident) => (
              <ForwardedIncidentCard key={incident.id} incident={incident} />
            ))
        ) : (
          <View style={cyberStyles.centerContainer}>
            <Ionicons name="shield-outline" size={64} color={cyberColors.mutedForeground} />
            <Text style={[cyberStyles.title, { textAlign: 'center', marginTop: 16 }]}>
              No Cases Forwarded
            </Text>
            <Text style={[cyberStyles.subtitle, { textAlign: 'center' }]}>
              Cases forwarded to law enforcement will appear here.
            </Text>
          </View>
        )}

        {/* Important Information */}
        <View style={[cyberStyles.card, { backgroundColor: '#f0f9ff', marginTop: 16, marginBottom: 24 }]}>
          <View style={[cyberStyles.row, { alignItems: 'flex-start' }]}>
            <Ionicons name="information-circle-outline" size={20} color={cyberColors.primary} style={{ marginRight: 8, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={[cyberStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                Important Information
              </Text>
              <Text style={[cyberStyles.textSmall, { lineHeight: 18 }]}>
                • Emergency cases are automatically escalated to law enforcement{'\n'}
                • Include all relevant evidence when forwarding cases{'\n'}
                • Follow up with law enforcement within 48 hours{'\n'}
                • Keep detailed records of all communications
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
