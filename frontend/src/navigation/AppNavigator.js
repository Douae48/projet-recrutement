import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import JobFeedScreen from '../screens/JobFeedScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      {/* Login Screen - Header hidden for a cleaner look */}
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ headerShown: false }} 
      />
      
      {/* Job Feed Screen */}
      <Stack.Screen 
        name="JobFeed" 
        component={JobFeedScreen} 
        options={{ title: 'Recommended Jobs' }} 
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;