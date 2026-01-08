// src/navigation/AppNavigator.js
// Navigation principale avec aiguillage selon Token et Rôle

import React, { useContext } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';
import { COLORS } from '../utils/theme';

// Import des Stacks et Navigators
import AuthStack from './AuthStack';
import MainTabNavigator from './MainTabNavigator';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { userToken, isLoading } = useContext(AuthContext);

  // Écran de chargement pendant la restauration de session
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.candidate.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken == null ? (
          // Phase Auth : Pas de token -> Welcome/Login/Register
          <Stack.Screen name="AuthStack" component={AuthStack} />
        ) : (
          // Phase App : Token présent -> TabNavigator avec rôle
          <Stack.Screen name="MainApp" component={MainTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.neutral.white,
  },
});
