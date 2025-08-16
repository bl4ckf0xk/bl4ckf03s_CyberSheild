import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen, RegisterScreen, AdminLoginScreen } from '../screens';
import { AuthStackParamList } from '../types/navigation';

const Stack = createStackNavigator<AuthStackParamList>();

interface AuthNavigatorProps {
  onLogin: (email: string, password: string) => void;
  onRegister: (name: string, email: string, password: string) => void;
  onAdminLogin: (email: string, password: string, badgeNumber: string) => void;
}

const AuthNavigator: React.FC<AuthNavigatorProps> = ({ onLogin, onRegister, onAdminLogin }) => {
  const [currentScreen, setCurrentScreen] = React.useState<'Login' | 'Register' | 'AdminLogin'>('Login');

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {currentScreen === 'Login' ? (
        <Stack.Screen name="Login">
          {() => (
            <LoginScreen
              onLogin={onLogin}
              onSwitchToRegister={() => setCurrentScreen('Register')}
              onSwitchToAdminLogin={() => setCurrentScreen('AdminLogin')}
            />
          )}
        </Stack.Screen>
      ) : currentScreen === 'Register' ? (
        <Stack.Screen name="Register">
          {() => (
            <RegisterScreen
              onRegister={onRegister}
              onSwitchToLogin={() => setCurrentScreen('Login')}
            />
          )}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="AdminLogin">
          {() => (
            <AdminLoginScreen
              onLogin={onAdminLogin}
              onSwitchToUserLogin={() => setCurrentScreen('Login')}
            />
          )}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
