import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { getJobRecommendations } from '../api/jobs';
import JobCard from '../components/JobCard';

const JobFeedScreen = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const CANDIDATE_ID = "can1"; // Hardcoded as requested

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await getJobRecommendations(CANDIDATE_ID);
      setJobs(data);
      setError(null);
    } catch (err) {
      setError("Could not load recommendations. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recommended for You</Text>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.jobId.toString()}
        renderItem={({ item }) => <JobCard job={item} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingHorizontal: 15 },
  header: { fontSize: 22, fontWeight: 'bold', marginVertical: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', textAlign: 'center' },
  listContent: { paddingBottom: 20 }
});

export default JobFeedScreen;