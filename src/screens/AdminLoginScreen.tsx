import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cyberStyles, cyberColors } from '../styles/cybershield';

interface AdminLoginScreenProps {
  onLogin: (email: string, password: string, badgeNumber: string) => void;
  onSwitchToUserLogin: () => void;
}

export function AdminLoginScreen({ onLogin, onSwitchToUserLogin }: AdminLoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [badgeNumber, setBadgeNumber] = useState('');

  const handleLogin = () => {
    if (!email || !password || !badgeNumber) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    onLogin(email, password, badgeNumber);
  };

  return (
    <KeyboardAvoidingView
      style={cyberStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={cyberStyles.centerContainer}>
        <View style={cyberStyles.card}>
          <View style={[cyberStyles.row, { justifyContent: 'center', marginBottom: 20 }]}>
            <Ionicons name="shield-checkmark" size={32} color={cyberColors.danger} />
          </View>
          
          <Text style={cyberStyles.title}>CyberShield Admin</Text>
          <Text style={cyberStyles.subtitle}>
            Administrator access to incident management system
          </Text>

          <TextInput
            style={cyberStyles.input}
            placeholder="Admin email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={cyberStyles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <TextInput
            style={cyberStyles.input}
            placeholder="Badge Number"
            value={badgeNumber}
            onChangeText={setBadgeNumber}
            autoCapitalize="none"
          />

          <TouchableOpacity style={[cyberStyles.button, { backgroundColor: cyberColors.danger }]} onPress={handleLogin}>
            <Text style={cyberStyles.buttonText}>Admin Sign In</Text>
          </TouchableOpacity>

          <View style={[cyberStyles.row, { justifyContent: 'center', marginTop: 20 }]}>
            <Text style={cyberStyles.textSmall}>Not an admin? </Text>
            <TouchableOpacity onPress={onSwitchToUserLogin}>
              <Text style={[cyberStyles.textSmall, { color: cyberColors.primary, fontWeight: '600' }]}>
                User Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
