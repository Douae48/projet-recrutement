import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [userRoles, setUserRoles] = useState([]);

    // Cette fonction sera appelée par le LoginScreen
    const login = async (token, roles) => {
        setUserToken(token);
        setUserRoles(roles);
        // On le cache dans le téléphone pour la prochaine fois
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userRoles', JSON.stringify(roles));
    };

    const logout = async () => {
        setUserToken(null);
        setUserRoles([]);
        await AsyncStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ userToken, userRoles, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};