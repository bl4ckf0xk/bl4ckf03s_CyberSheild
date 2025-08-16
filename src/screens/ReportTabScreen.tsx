import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cyberStyles, cyberColors } from '../styles/cybershield';
import { Incident } from '../types/navigation';

interface ReportTabScreenProps {
  onSubmit: (incident: Omit<Incident, 'id' | 'userId' | 'reportedAt' | 'status'>) => void;
}

const categories = [
  'Phishing',
  'Malware',
  'Data Breach',
  'Identity Theft',
  'Financial Fraud',
  'Ransomware',
  'Social Engineering',
  'Other'
];

const severityLevels = [
  { value: 'low' as const, label: 'Low', color: '#6b7280' },
  { value: 'medium' as const, label: 'Medium', color: '#f59e0b' },
  { value: 'high' as const, label: 'High', color: '#ef4444' },
  { value: 'emergency' as const, label: 'Emergency', color: '#dc2626' },
];

export function ReportTabScreen({ onSubmit }: ReportTabScreenProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'emergency'>('low');

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for the incident');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please provide a description of the incident');
      return;
    }

    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      category,
      severity,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setCategory('');
    setSeverity('low');
  };

  const CategoryButton = ({ cat }: { cat: string }) => (
    <TouchableOpacity
      style={[
        cyberStyles.button,
        cyberStyles.buttonOutline,
        { marginBottom: 8, marginRight: 8 },
        category === cat && { backgroundColor: cyberColors.primary, borderColor: cyberColors.primary }
      ]}
      onPress={() => setCategory(cat)}
    >
      <Text style={[
        cyberStyles.buttonText,
        cyberStyles.buttonOutlineText,
        category === cat && { color: cyberColors.primaryForeground }
      ]}>
        {cat}
      </Text>
    </TouchableOpacity>
  );

  const SeverityButton = ({ level }: { level: typeof severityLevels[0] }) => (
    <TouchableOpacity
      style={[
        cyberStyles.button,
        cyberStyles.buttonOutline,
        { marginBottom: 8, marginRight: 8 },
        severity === level.value && { backgroundColor: level.color, borderColor: level.color }
      ]}
      onPress={() => setSeverity(level.value)}
    >
      <Text style={[
        cyberStyles.buttonText,
        cyberStyles.buttonOutlineText,
        severity === level.value && { color: cyberColors.primaryForeground }
      ]}>
        {level.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={[cyberStyles.container, { backgroundColor: '#fff' }]} 
      showsVerticalScrollIndicator={false}
    >
      <View style={[cyberStyles.px4, { marginTop: 20 }]}>
        {/* Header */}
        <View style={[cyberStyles.row, { marginBottom: 16, alignItems: 'center' }]}>
          <Ionicons name="document-text" size={24} color={cyberColors.primary} />
          <Text style={[cyberStyles.headerTitle, { marginLeft: 8, color: cyberColors.foreground }]}>
            Report New Incident
          </Text>
        </View>

        <Text style={[cyberStyles.subtitle, cyberStyles.mb4]}>
          Report cybercrime incidents to the appropriate authorities
        </Text>

        {/* Incident Title */}
        <View style={cyberStyles.mb4}>
          <Text style={[cyberStyles.text, { fontWeight: '600', marginBottom: 8 }]}>
            Incident Title *
          </Text>
          <TextInput
            style={cyberStyles.input}
            placeholder="Brief title describing the incident"
            value={title}
            onChangeText={setTitle}
            multiline={false}
          />
        </View>

        {/* Description */}
        <View style={cyberStyles.mb4}>
          <Text style={[cyberStyles.text, { fontWeight: '600', marginBottom: 8 }]}>
            Description *
          </Text>
          <TextInput
            style={[cyberStyles.input, { height: 120, textAlignVertical: 'top' }]}
            placeholder="Provide detailed information about the incident, including what happened, when it occurred, and any relevant details..."
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        {/* Category */}
        <View style={cyberStyles.mb4}>
          <Text style={[cyberStyles.text, { fontWeight: '600', marginBottom: 8 }]}>
            Category *
          </Text>
          <View style={[cyberStyles.row, { flexWrap: 'wrap' }]}>
            {categories.map((cat) => (
              <CategoryButton key={cat} cat={cat} />
            ))}
          </View>
        </View>

        {/* Severity Level */}
        <View style={cyberStyles.mb4}>
          <Text style={[cyberStyles.text, { fontWeight: '600', marginBottom: 8 }]}>
            Severity Level
          </Text>
          <View style={[cyberStyles.row, { flexWrap: 'wrap' }]}>
            {severityLevels.map((level) => (
              <SeverityButton key={level.value} level={level} />
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[cyberStyles.button, { marginBottom: 40 }]} 
          onPress={handleSubmit}
        >
          <Text style={cyberStyles.buttonText}>Submit Report</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
