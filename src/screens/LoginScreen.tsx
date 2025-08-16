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

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToRegister: () => void;
  onSwitchToAdminLogin: () => void;
}

export function LoginScreen({ onLogin, onSwitchToRegister, onSwitchToAdminLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    onLogin(email, password);
  };

  return (
    <KeyboardAvoidingView
      style={cyberStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={cyberStyles.centerContainer}>
        <View style={cyberStyles.card}>
          <View style={[cyberStyles.row, { justifyContent: 'center', marginBottom: 20 }]}>
            <Ionicons name="shield-checkmark" size={32} color={cyberColors.primary} />
          </View>
          
          <Text style={cyberStyles.title}>CyberShield</Text>
          <Text style={cyberStyles.subtitle}>
            Sign in to access the cybercrime incident reporting system
          </Text>

          <TextInput
            style={cyberStyles.input}
            placeholder="Email address"
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

          <TouchableOpacity style={cyberStyles.button} onPress={handleLogin}>
            <Text style={cyberStyles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <View style={[cyberStyles.row, { justifyContent: 'center', marginTop: 20 }]}>
            <Text style={cyberStyles.textSmall}>Don't have an account? </Text>
            <TouchableOpacity onPress={onSwitchToRegister}>
              <Text style={[cyberStyles.textSmall, { color: cyberColors.primary, fontWeight: '600' }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[cyberStyles.row, { justifyContent: 'center', marginTop: 12 }]}>
            <Text style={cyberStyles.textSmall}>Administrator? </Text>
            <TouchableOpacity onPress={onSwitchToAdminLogin}>
              <Text style={[cyberStyles.textSmall, { color: cyberColors.danger, fontWeight: '600' }]}>
                Admin Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
