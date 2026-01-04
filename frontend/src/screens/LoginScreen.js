import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { loginUser } from '../api/auth';

// N'oublie pas d'ajouter "navigation" dans les arguments ici :
const LoginScreen = ({ route, navigation }) => {
    const { role } = route.params || { role: 'Candidate' };
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs !");
            return;
        }

        setLoading(true);
        try {
            const data = await loginUser(email, password);
            if (data.token) {
                await login(data.token, data.roles); 
            }
        } catch (error) {
            Alert.alert("Échec", "Email ou mot de passe incorrect.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Connexion {role}</Text>
            
            <TextInput 
                style={styles.input} 
                placeholder="Email" 
                value={email} 
                onChangeText={setEmail} 
                autoCapitalize="none" 
            />
            
            <TextInput 
                style={styles.input} 
                placeholder="Mot de passe" 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry 
            />

            {/* BOUTON DE CONNEXION */}
            <TouchableOpacity 
                style={[styles.button, {backgroundColor: role === 'Recruiter' ? '#34C759' : '#007AFF'}]} 
                onPress={handleLogin} 
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>SE CONNECTER</Text>
                )}
            </TouchableOpacity>

            {/* NOUVEAU : BOUTON DE CRÉATION DE COMPTE */}
            <TouchableOpacity 
                style={styles.registerLink}
                onPress={() => navigation.navigate('Register', { role: role })}
            >
                <Text style={styles.registerText}>
                    Pas encore de compte ? <Text style={styles.boldText}>S'inscrire ici</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
    input: { borderBottomWidth: 1, borderColor: '#ddd', marginBottom: 20, padding: 10 },
    button: { padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    registerLink: { marginTop: 25, alignItems: 'center' },
    registerText: { color: '#666', fontSize: 14 },
    boldText: { color: '#007AFF', fontWeight: 'bold' }
});

export default LoginScreen;