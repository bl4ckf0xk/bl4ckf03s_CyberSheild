import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cyberStyles, cyberColors } from '../styles/cybershield';
import { Incident } from '../types/navigation';

interface OverviewScreenProps {
  incidents: Incident[];
  onNavigateToReport: () => void;
  onNavigateToIncidents: () => void;
}

export function OverviewScreen({ incidents, onNavigateToReport, onNavigateToIncidents }: OverviewScreenProps) {
  const pendingIncidents = incidents.filter(i => i.status === 'pending').length;
  const reviewingIncidents = incidents.filter(i => i.status === 'reviewing').length;
  const resolvedIncidents = incidents.filter(i => i.status === 'resolved').length;

  const StatCard = ({ icon, count, label, color }: { 
    icon: keyof typeof Ionicons.glyphMap; 
    count: number; 
    label: string; 
    color: string;
  }) => (
    <View style={[cyberStyles.card, { flex: 1, marginHorizontal: 5, alignItems: 'center' }]}>
      <Ionicons name={icon} size={24} color={color} style={{ marginBottom: 8 }} />
      <Text style={[cyberStyles.title, { fontSize: 32, marginBottom: 4 }]}>{count}</Text>
      <Text style={cyberStyles.textSmall}>{label}</Text>
    </View>
  );

  return (
    <ScrollView style={cyberStyles.container} showsVerticalScrollIndicator={false}>
      <View style={cyberStyles.px4}>
        <Text style={[cyberStyles.title, cyberStyles.mt4]}>Dashboard Overview</Text>
        <Text style={cyberStyles.subtitle}>Track your incident reports and their status</Text>

        <View style={[cyberStyles.row, cyberStyles.mb4]}>
          <StatCard 
            icon="time-outline" 
            count={pendingIncidents} 
            label="Pending" 
            color={cyberColors.warning}
          />
          <StatCard 
            icon="eye-outline" 
            count={reviewingIncidents} 
            label="Reviewing" 
            color={cyberColors.primary}
          />
          <StatCard 
            icon="checkmark-circle-outline" 
            count={resolvedIncidents} 
            label="Resolved" 
            color={cyberColors.success}
          />
        </View>

        <View style={cyberStyles.card}>
          <Text style={[cyberStyles.text, { fontWeight: '600', marginBottom: 16 }]}>Quick Actions</Text>
          
          <TouchableOpacity 
            style={[cyberStyles.button, cyberStyles.mb2]} 
            onPress={onNavigateToReport}
          >
            <View style={cyberStyles.row}>
              <Ionicons name="add" size={20} color={cyberColors.primaryForeground} />
              <Text style={[cyberStyles.buttonText, { marginLeft: 8 }]}>Report New Incident</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[cyberStyles.button, cyberStyles.buttonOutline]}
            onPress={onNavigateToIncidents}
          >
            <View style={cyberStyles.row}>
              <Ionicons name="document-text-outline" size={20} color={cyberColors.foreground} />
              <Text style={[cyberStyles.buttonText, cyberStyles.buttonOutlineText, { marginLeft: 8 }]}>
                View My Reports
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {incidents.length > 0 && (
          <View style={cyberStyles.card}>
            <Text style={[cyberStyles.text, { fontWeight: '600', marginBottom: 16 }]}>Recent Activity</Text>
            {incidents.slice(0, 3).map((incident) => (
              <View key={incident.id} style={[cyberStyles.row, cyberStyles.spaceBetween, cyberStyles.mb2]}>
                <View style={{ flex: 1 }}>
                  <Text style={cyberStyles.text} numberOfLines={1}>{incident.title}</Text>
                  <Text style={cyberStyles.textSmall}>
                    {incident.reportedAt.toLocaleDateString()}
                  </Text>
                </View>
                <View style={[cyberStyles.badge, { 
                  backgroundColor: incident.status === 'pending' ? '#fef3c7' :
                                   incident.status === 'reviewing' ? '#dbeafe' : '#d1fae5'
                }]}>
                  <Text style={[cyberStyles.badgeText, {
                    color: incident.status === 'pending' ? '#92400e' :
                           incident.status === 'reviewing' ? '#1e40af' : '#065f46'
                  }]}>
                    {incident.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
