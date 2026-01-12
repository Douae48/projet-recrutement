// src/context/AuthContext.js
// Gestion globale de l'authentification - JobMatch Morocco

import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

const STORAGE_KEYS = {
  TOKEN: 'userToken',
  ROLES: 'userRoles',
  USER: 'userData',
};

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const [token, rolesJson, userJson] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.ROLES),
        AsyncStorage.getItem(STORAGE_KEYS.USER),
      ]);

      if (token) {
        setUserToken(token);
        setUserRoles(rolesJson ? JSON.parse(rolesJson) : []);
        setUserData(userJson ? JSON.parse(userJson) : null);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // Connexion utilisateur
  const login = useCallback(async (token, roles, user = null) => {
    try {
      setUserToken(token);
      setUserRoles(roles);
      setUserData(user);

      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token),
        AsyncStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(roles)),
        user && AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
      ]);
    } catch (error) {
      throw error;
    }
  }, []);

  // Déconnexion
  const logout = useCallback(async () => {
    try {
      setUserToken(null);
      setUserRoles([]);
      setUserData(null);
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
    }
  }, []);

  const isCandidate = userRoles.includes('Candidate');
  const isRecruiter = userRoles.includes('Recruiter');
  const primaryRole = isRecruiter ? 'Recruiter' : 'Candidate';

  const value = {
    userToken,
    userRoles,
    userData,
    isLoading,
    isCandidate,
    isRecruiter,
    primaryRole,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};