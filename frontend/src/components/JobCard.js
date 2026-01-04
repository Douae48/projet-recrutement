import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const JobCard = ({ job }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{job.title}</Text>
        <Text style={styles.match}>{job.matchScore}% Match</Text>
      </View>
      <Text style={styles.company}>{job.companyName}</Text>
      <Text style={styles.salary}>{job.salary}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  title: { fontSize: 18, fontWeight: 'bold' },
  match: { color: '#2ecc71', fontWeight: 'bold' },
  company: { fontSize: 14, color: '#666', marginTop: 4 },
  salary: { fontSize: 14, color: '#333', marginTop: 8, fontWeight: '500' },
});

export default JobCard;