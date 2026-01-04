import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const JobFeedScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flux d'offres d'emploi</Text>
      <Text>Bientôt, tes recommandations s'afficheront ici !</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 }
});

export default JobFeedScreen;