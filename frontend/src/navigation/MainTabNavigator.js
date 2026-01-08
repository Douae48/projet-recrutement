// src/navigation/MainTabNavigator.js
// TabNavigator avec onglets dynamiques selon le rôle (Candidat/Recruteur)

import React, { useContext } from 'react';
import { StyleSheet, Platform, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { COLORS, SHADOWS, getThemeColors } from '../utils/theme';

const { width } = Dimensions.get('window');

// Import des écrans Candidat
import JobFeedScreen from '../screens/JobFeedScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Import des écrans Recruteur
import DashboardRecruiter from '../screens/DashboardRecruiter';
import PostJobScreen from '../screens/PostJobScreen';
import MyJobsScreen from '../screens/MyJobsScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const { isRecruiter, primaryRole } = useContext(AuthContext);
  const themeColors = getThemeColors(primaryRole);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // Icônes selon la route
          switch (route.name) {
            case 'JobMatch':
              iconName = focused ? 'sparkles' : 'sparkles-outline';
              break;
            case 'Profil':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'Dashboard':
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
              break;
            case 'Publier':
              iconName = focused ? 'add-circle' : 'add-circle-outline';
              break;
            case 'MesOffres':
              iconName = focused ? 'briefcase' : 'briefcase-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: COLORS.neutral.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      })}
    >
      {isRecruiter ? (
        // ========== NAVIGATION RECRUTEUR ==========
        <>
          <Tab.Screen 
            name="Dashboard" 
            component={DashboardRecruiter}
            options={{ tabBarLabel: 'Dashboard' }}
          />
          <Tab.Screen 
            name="Publier" 
            component={PostJobScreen}
            options={{ tabBarLabel: 'Publier' }}
          />
          <Tab.Screen 
            name="MesOffres" 
            component={MyJobsScreen}
            options={{ tabBarLabel: 'Candidats' }}
          />
        </>
      ) : (
        // ========== NAVIGATION CANDIDAT ==========
        <>
          <Tab.Screen 
            name="JobMatch" 
            component={JobFeedScreen}
            options={{ tabBarLabel: 'JobMatch' }}
          />
          <Tab.Screen 
            name="Profil" 
            component={ProfileScreen}
            options={{ tabBarLabel: 'Mon Profil' }}
          />
        </>
      )}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: width > 768 ? `calc(50% - 300px)` : 0,
    right: width > 768 ? `calc(50% - 300px)` : 0,
    backgroundColor: COLORS.neutral.white,
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 85 : 65,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    paddingTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...SHADOWS.large,
    maxWidth: width > 768 ? 600 : '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  tabBarItem: {
    paddingVertical: 5,
  },
});
