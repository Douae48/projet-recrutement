import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { registerUser } from '../api/auth'; // On créera cette fonction juste après

const RegisterScreen = ({ route, navigation }) => {
  const { role } = route.params || { role: 'Candidate' };
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
        Alert.alert("Erreur", "Tous les champs sont obligatoires");
        return;
    }

    try {
        // On appelle ton API
        await registerUser({ name, email, password, role }); 
        Alert.alert("Succès", "Compte créé ! Connecte-toi maintenant.");
        navigation.navigate('Login'); // Retour au login
    } catch (error) {
        Alert.alert("Erreur", "Impossible de créer le compte");
    }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inscription {role}</Text>
      
      <TextInput style={styles.input} placeholder="Nom complet" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={[styles.button, { backgroundColor: role === 'Recruiter' ? '#34C759' : '#007AFF' }]} onPress={handleRegister}>
        <Text style={styles.buttonText}>CRÉER MON COMPTE</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#000' },
  input: { borderBottomWidth: 1, borderColor: '#ddd', marginBottom: 20, padding: 10 },
  button: { padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { marginTop: 20, textAlign: 'center', color: '#007AFF' }
});

export default RegisterScreen;