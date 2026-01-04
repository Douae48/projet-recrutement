import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';

// Import des Stacks (qu'on va créer juste après)
import AuthStack from './AuthStack';
import JobFeedScreen from '../screens/JobFeedScreen'; 
// Ajoute ici ton écran Recruteur quand il sera prêt

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { userToken, userRoles } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken == null ? (
          // 1. SI PAS CONNECTÉ : On montre le flux d'entrée (Welcome -> Login)
          <Stack.Screen name="AuthStack" component={AuthStack} />
        ) : (
          // 2. SI CONNECTÉ : On regarde le rôle pour savoir quoi montrer
          userRoles.includes('Recruiter') ? (
            <Stack.Screen name="RecruiterHome" component={JobFeedScreen} /> // Dashboard Recruteur à venir
          ) : (
            <Stack.Screen name="CandidateHome" component={JobFeedScreen} /> // Flux de jobs
          )
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}