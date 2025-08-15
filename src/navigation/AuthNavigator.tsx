import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen, RegisterScreen } from '../screens';
import { AuthStackParamList } from '../types/navigation';

const Stack = createStackNavigator<AuthStackParamList>();

interface AuthNavigatorProps {
  onLogin: (email: string, password: string) => void;
  onRegister: (name: string, email: string, password: string) => void;
}

const AuthNavigator: React.FC<AuthNavigatorProps> = ({ onLogin, onRegister }) => {
  const [currentScreen, setCurrentScreen] = React.useState<'Login' | 'Register'>('Login');

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {currentScreen === 'Login' ? (
        <Stack.Screen name="Login">
          {() => (
            <LoginScreen
              onLogin={onLogin}
              onSwitchToRegister={() => setCurrentScreen('Register')}
            />
          )}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="Register">
          {() => (
            <RegisterScreen
              onRegister={onRegister}
              onSwitchToLogin={() => setCurrentScreen('Login')}
            />
          )}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
