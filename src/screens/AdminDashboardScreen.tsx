import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cyberStyles, cyberColors } from '../styles/cybershield';
import { Incident, AdminUser } from '../types/navigation';

interface AdminDashboardScreenProps {
  user: AdminUser;
  incidents: Incident[];
  onNavigateToAllIncidents: () => void;
  onNavigateToLawEnforcement: () => void;
}

export function AdminDashboardScreen({ 
  user, 
  incidents, 
  onNavigateToAllIncidents,
  onNavigateToLawEnforcement 
}: AdminDashboardScreenProps) {
  const getStatusCount = (status: string) => {
    return incidents.filter(incident => incident.status === status).length;
  };

  const getSeverityCount = (severity: string) => {
    return incidents.filter(incident => incident.severity === severity).length;
  };

  const recentIncidents = incidents
    .sort((a, b) => b.reportedAt.getTime() - a.reportedAt.getTime())
    .slice(0, 5);

  const StatCard = ({ title, count, color, icon }: { 
    title: string; 
    count: number; 
    color: string; 
    icon: string; 
  }) => (
    <View style={[cyberStyles.card, { backgroundColor: color, marginBottom: 12 }]}>
      <View style={[cyberStyles.row, cyberStyles.spaceBetween]}>
        <View>
          <Text style={[cyberStyles.text, { color: '#fff', fontWeight: '600' }]}>
            {count}
          </Text>
          <Text style={[cyberStyles.textSmall, { color: '#fff', opacity: 0.9 }]}>
            {title}
          </Text>
        </View>
        <Ionicons name={icon as any} size={24} color="#fff" />
      </View>
    </View>
  );

  const QuickActionCard = ({ title, description, icon, onPress, color }: {
    title: string;
    description: string;
    icon: string;
    onPress: () => void;
    color: string;
  }) => (
    <TouchableOpacity 
      style={[cyberStyles.card, { borderLeftWidth: 4, borderLeftColor: color }]} 
      onPress={onPress}
    >
      <View style={[cyberStyles.row, { alignItems: 'center' }]}>
        <Ionicons name={icon as any} size={24} color={color} style={{ marginRight: 12 }} />
        <View style={{ flex: 1 }}>
          <Text style={[cyberStyles.text, { fontWeight: '600' }]}>{title}</Text>
          <Text style={cyberStyles.textSmall}>{description}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={cyberColors.mutedForeground} />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={cyberStyles.container} showsVerticalScrollIndicator={false}>
      <View style={cyberStyles.px4}>
        <Text style={[cyberStyles.title, cyberStyles.mt4]}>
          Welcome, Admin {user.name}
        </Text>
        <Text style={cyberStyles.subtitle}>
          Cybercrime Incident Management Dashboard
        </Text>

        {/* Statistics */}
        <Text style={[cyberStyles.text, { fontWeight: '600', marginTop: 24, marginBottom: 12 }]}>
          Status Overview
        </Text>
        <StatCard 
          title="Pending" 
          count={getStatusCount('pending')} 
          color={cyberColors.warning} 
          icon="time-outline" 
        />
        <StatCard 
          title="Under Review" 
          count={getStatusCount('reviewing')} 
          color={cyberColors.primary} 
          icon="eye-outline" 
        />
        <StatCard 
          title="Forwarded to LE" 
          count={getStatusCount('forwarded_to_le')} 
          color={cyberColors.danger} 
          icon="send-outline" 
        />
        <StatCard 
          title="Resolved" 
          count={getStatusCount('resolved')} 
          color={cyberColors.success} 
          icon="checkmark-circle-outline" 
        />

        {/* Severity Breakdown */}
        <Text style={[cyberStyles.text, { fontWeight: '600', marginTop: 24, marginBottom: 12 }]}>
          Severity Breakdown
        </Text>
        <View style={[cyberStyles.row, cyberStyles.spaceBetween, { marginBottom: 16 }]}>
          <View style={[cyberStyles.badge, { backgroundColor: '#f3f4f6' }]}>
            <Text style={[cyberStyles.badgeText, { color: '#374151' }]}>
              Low: {getSeverityCount('low')}
            </Text>
          </View>
          <View style={[cyberStyles.badge, { backgroundColor: '#fef3c7' }]}>
            <Text style={[cyberStyles.badgeText, { color: '#92400e' }]}>
              Medium: {getSeverityCount('medium')}
            </Text>
          </View>
          <View style={[cyberStyles.badge, { backgroundColor: '#fecaca' }]}>
            <Text style={[cyberStyles.badgeText, { color: '#991b1b' }]}>
              High: {getSeverityCount('high')}
            </Text>
          </View>
          <View style={[cyberStyles.badge, { backgroundColor: '#dc2626' }]}>
            <Text style={[cyberStyles.badgeText, { color: '#ffffff' }]}>
              Emergency: {getSeverityCount('emergency')}
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={[cyberStyles.text, { fontWeight: '600', marginTop: 24, marginBottom: 12 }]}>
          Quick Actions
        </Text>
        <QuickActionCard
          title="View All Incidents"
          description="Manage and review all reported incidents"
          icon="list-outline"
          onPress={onNavigateToAllIncidents}
          color={cyberColors.primary}
        />
        <QuickActionCard
          title="Law Enforcement Portal"
          description="Forward cases and manage LE communications"
          icon="shield-outline"
          onPress={onNavigateToLawEnforcement}
          color={cyberColors.danger}
        />

        {/* Recent Incidents */}
        <Text style={[cyberStyles.text, { fontWeight: '600', marginTop: 24, marginBottom: 12 }]}>
          Recent Incidents
        </Text>
        {recentIncidents.length > 0 ? (
          recentIncidents.map((incident) => (
            <View key={incident.id} style={[cyberStyles.card, { marginBottom: 8 }]}>
              <View style={[cyberStyles.row, cyberStyles.spaceBetween, cyberStyles.mb2]}>
                <Text style={[cyberStyles.text, { fontWeight: '600', flex: 1 }]} numberOfLines={1}>
                  {incident.title}
                </Text>
                <View style={[cyberStyles.badge, { 
                  backgroundColor: incident.severity === 'emergency' ? cyberColors.danger : cyberColors.mutedForeground
                }]}>
                  <Text style={[cyberStyles.badgeText, { color: '#fff' }]}>
                    {incident.severity}
                  </Text>
                </View>
              </View>
              <Text style={cyberStyles.textSmall} numberOfLines={1}>
                {incident.description}
              </Text>
              <Text style={[cyberStyles.textSmall, { marginTop: 4 }]}>
                Reported: {incident.reportedAt.toLocaleDateString()}
              </Text>
            </View>
          ))
        ) : (
          <Text style={cyberStyles.textSmall}>No incidents reported yet.</Text>
        )}
      </View>
    </ScrollView>
  );
}
