import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

// ... (Garde le style du message précédent)
const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>JobMatch Morocco</Text>
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#007AFF' }]} 
        onPress={() => navigation.navigate('Login', { role: 'Candidate' })}
      >
        <Text style={styles.text}>JE SUIS CANDIDAT</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#34C759' }]} 
        onPress={() => navigation.navigate('Login', { role: 'Recruiter' })}
      >
        <Text style={styles.text}>JE SUIS RECRUTEUR</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#007AFF', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 40 },
  buttonContainer: { width: '100%' },
  roleButton: { padding: 30, borderRadius: 15, marginBottom: 20, alignItems: 'center', elevation: 5 },
  candidateButton: { backgroundColor: '#007AFF' },
  recruiterButton: { backgroundColor: '#34C759' },
  buttonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  descriptionText: { color: '#fff', fontSize: 12, marginTop: 5 }
});

export default WelcomeScreen;