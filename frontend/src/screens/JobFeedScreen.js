// src/screens/JobFeedScreen.js
// Écran de recommandations d'emploi - Affichage simple

import React, { useContext, useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import JobCard from '../components/JobCard';
import { getRecommendedJobs } from '../api/jobs';
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY, BORDER_RADIUS, getThemeColors } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';

const JobFeedScreen = ({ navigation }) => {
  const { userData, primaryRole } = useContext(AuthContext);
  const themeColors = getThemeColors(primaryRole);
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // États pour la modal de détails
  const [selectedJob, setSelectedJob] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = useCallback(async () => {
    try {
      setError(null);
      const recommendations = await getRecommendedJobs();
      setJobs(recommendations);
    } catch (err) {
      setError('Impossible de charger les recommandations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadRecommendations();
  }, [loadRecommendations]);

  const handleJobPress = (job) => {
    setSelectedJob(job);
    setDetailModalVisible(true);
  };

  const getMatchColor = (score) => {
    if (score >= 80) return COLORS.match.excellent;
    if (score >= 60) return COLORS.match.good;
    if (score >= 40) return COLORS.match.average;
    return COLORS.match.low;
  };

  // État de chargement
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={themeColors.primary} />
        <Text style={styles.loadingText}>
          Analyse de votre profil en cours...
        </Text>
        <Text style={styles.loadingSubtext}>
          Nous recherchons les meilleures opportunités pour vous
        </Text>
      </View>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="cloud-offline-outline" size={64} color={COLORS.status.error} />
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorSubtext}>
          Vérifiez votre connexion et réessayez
        </Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: themeColors.primary }]}
          onPress={loadRecommendations}
        >
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title="JobMatch"
        subtitle={`${jobs.length} offres recommandées pour vous`}
        backgroundColor={themeColors.primary}
      />
      
      <FlatList
        data={jobs}
        renderItem={({ item }) => (
          <JobCard 
            job={{
              ...item,
              salary: item.salaryRange || item.salary,
            }}
            onPress={() => handleJobPress(item)}
          />
        )}
        keyExtractor={(item) => item.jobId || item.id || Math.random().toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[themeColors.primary]}
            tintColor={themeColors.primary}
          />
        }
        ListHeaderComponent={
          jobs.length > 0 && (
            <View style={styles.statsBar}>
              <View style={styles.statItem}>
                <Ionicons name="sparkles" size={18} color={COLORS.match.excellent} />
                <Text style={styles.statText}>
                  {jobs.filter(j => j.matchScore >= 80).length} Excellent match
                </Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="thumbs-up" size={18} color={COLORS.match.good} />
                <Text style={styles.statText}>
                  {jobs.filter(j => j.matchScore >= 60 && j.matchScore < 80).length} Bon match
                </Text>
              </View>
            </View>
          )
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color={COLORS.neutral.textLight} />
            <Text style={styles.emptyTitle}>Aucune recommandation</Text>
            <Text style={styles.emptyText}>
              Ajoutez des compétences à votre profil pour recevoir des offres personnalisées
            </Text>
          </View>
        }
      />

      {/* Modal de détails de l'offre */}
      <Modal
        visible={detailModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedJob && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedJob.title}</Text>
                  <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                    <Ionicons name="close" size={24} color={COLORS.neutral.text} />
                  </TouchableOpacity>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="business" size={20} color={COLORS.neutral.textSecondary} />
                  <Text style={styles.detailText}>
                    {selectedJob.companyName || 'Entreprise non spécifiée'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="cash" size={20} color={COLORS.status.success} />
                  <Text style={styles.detailText}>
                    {selectedJob.salaryRange || selectedJob.salary || 'Salaire non spécifié'}
                  </Text>
                </View>

                <View style={[styles.matchBadge, { backgroundColor: getMatchColor(selectedJob.matchScore) }]}>
                  <Ionicons name="analytics" size={18} color={COLORS.neutral.white} />
                  <Text style={styles.matchText}>
                    {selectedJob.matchScore}% de compatibilité
                  </Text>
                </View>

                <TouchableOpacity 
                  style={styles.closeDetailBtn}
                  onPress={() => setDetailModalVisible(false)}
                >
                  <Text style={styles.closeDetailBtnText}>Fermer</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.neutral.background,
    maxWidth: width > 768 ? 600 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.neutral.background,
    paddingHorizontal: SPACING.xl,
    maxWidth: width > 768 ? 600 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  loadingText: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.neutral.text,
    marginTop: SPACING.lg,
    textAlign: 'center',
  },
  loadingSubtext: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.textSecondary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  errorText: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.status.error,
    marginTop: SPACING.lg,
    textAlign: 'center',
  },
  errorSubtext: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.textSecondary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  retryButtonText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.neutral.white,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: 100,
    width: '100%',
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.textSecondary,
    marginLeft: SPACING.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: SPACING.xxl * 2,
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.neutral.text,
    marginTop: SPACING.lg,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.textSecondary,
    marginTop: SPACING.sm,
    textAlign: 'center',
    lineHeight: 22,
  },
  // Styles pour la modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    width: '100%',
    maxWidth: 400,
    ...SHADOWS.large,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    ...TYPOGRAPHY.title,
    color: COLORS.neutral.text,
    flex: 1,
    marginRight: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  detailText: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.text,
    marginLeft: SPACING.sm,
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginVertical: SPACING.md,
  },
  matchText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.neutral.white,
    marginLeft: SPACING.sm,
  },
  closeDetailBtn: {
    backgroundColor: COLORS.candidate.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  closeDetailBtnText: {
    ...TYPOGRAPHY.button,
    color: COLORS.neutral.white,
  },
});

export default JobFeedScreen;
