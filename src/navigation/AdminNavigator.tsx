import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AdminLoginScreen } from '../screens';
import { AuthStackParamList } from '../types/navigation';

const Stack = createStackNavigator<AuthStackParamList>();

interface AdminNavigatorProps {
  onLogin: (email: string, password: string, badgeNumber: string) => void;
  onSwitchToUserLogin: () => void;
}

const AdminNavigator: React.FC<AdminNavigatorProps> = ({
  onLogin,
  onSwitchToUserLogin,
}) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AdminLogin">
        {() => (
          <AdminLoginScreen
            onLogin={onLogin}
            onSwitchToUserLogin={onSwitchToUserLogin}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AdminNavigator;
