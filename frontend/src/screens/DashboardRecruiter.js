// src/screens/DashboardRecruiter.js
// Dashboard Recruteur avec statistiques depuis l'API

import React, { useContext, useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Modal,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import { getStats, getRecruiterJobs } from '../api/jobs';
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';

const DashboardRecruiter = ({ navigation }) => {
  const { logout, userData } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalJobs: 0, myJobs: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const [globalStats, myJobs] = await Promise.all([
        getStats(),
        getRecruiterJobs()
      ]);
      setStats({
        totalJobs: globalStats.totalJobs || 0,
        myJobs: myJobs?.length || 0
      });
    } catch (error) {

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Dashboard" 
        subtitle={`Bienvenue ${userData?.name || 'Recruteur'}`}
        backgroundColor={COLORS.recruiter.primary}
        rightIcon="log-out-outline"
        onRightPress={handleLogout}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.recruiter.primary]}
            tintColor={COLORS.recruiter.primary}
          />
        }
      >
        {/* Statistiques principales */}
        <View style={styles.statsCard}>
          <Text style={styles.statsCardTitle}>📊 Statistiques</Text>
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.recruiter.primary} />
          ) : (
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Ionicons name="briefcase" size={32} color={COLORS.recruiter.primary} />
                <Text style={styles.statValue}>{stats.myJobs}</Text>
                <Text style={styles.statLabel}>Mes offres</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Ionicons name="globe" size={32} color={COLORS.status.info} />
                <Text style={styles.statValue}>{stats.totalJobs}</Text>
                <Text style={styles.statLabel}>Total plateforme</Text>
              </View>
            </View>
          )}
        </View>

        {/* Boutons d'action rapide */}
        <View style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>Actions rapides</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Publier')}
            >
              <View style={[styles.actionIcon, { backgroundColor: COLORS.recruiter.background }]}>
                <Ionicons name="add-circle" size={24} color={COLORS.recruiter.primary} />
              </View>
              <Text style={styles.actionText}>Nouvelle offre</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('MesOffres')}
            >
              <View style={[styles.actionIcon, { backgroundColor: COLORS.candidate.background }]}>
                <Ionicons name="people" size={24} color={COLORS.candidate.primary} />
              </View>
              <Text style={styles.actionText}>Voir candidats</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Message d'aide */}
        <View style={styles.helpCard}>
          <Ionicons name="information-circle" size={24} color={COLORS.recruiter.primary} />
          <View style={styles.helpContent}>
            <Text style={styles.helpTitle}>Comment ça marche ?</Text>
            <Text style={styles.helpText}>
              1. Publiez vos offres via l'onglet "Publier"{'\n'}
              2. Notre système fait le matching avec les candidats{'\n'}
              3. Recevez les candidatures qualifiées
            </Text>
          </View>
        </View>

        {/* Conseil */}
        <View style={[styles.tipCard, { backgroundColor: COLORS.recruiter.background }]}>
          <Ionicons name="bulb-outline" size={24} color={COLORS.recruiter.primary} />
          <Text style={styles.tipText}>
            Plus vous ajoutez de compétences précises à vos offres, meilleur sera le matching !
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Modale Déconnexion */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <View style={[styles.modalIconContainer, { backgroundColor: COLORS.status.warning + '20' }]}>
              <Ionicons name="log-out-outline" size={32} color={COLORS.status.warning} />
            </View>
            <Text style={styles.modalTitle}>Déconnexion</Text>
            <Text style={styles.modalMessage}>Êtes-vous sûr de vouloir vous déconnecter ?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: COLORS.status.warning }]}
                onPress={confirmLogout}
              >
                <Text style={styles.confirmButtonText}>Déconnecter</Text>
              </TouchableOpacity>
            </View>
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    maxWidth: width > 768 ? 600 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  statsCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  statsCardTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.neutral.text,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: COLORS.neutral.border,
  },
  statValue: {
    ...TYPOGRAPHY.hero,
    color: COLORS.neutral.text,
    marginTop: SPACING.sm,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.textSecondary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  helpCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  helpContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  helpTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.neutral.text,
    marginBottom: SPACING.xs,
  },
  helpText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.textSecondary,
    lineHeight: 20,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  tipText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.textSecondary,
    flex: 1,
    marginLeft: SPACING.md,
    lineHeight: 18,
  },
  actionsCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  actionsTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.neutral.text,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  actionText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.text,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  confirmModal: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    ...SHADOWS.large,
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.neutral.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  modalMessage: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: SPACING.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.neutral.background,
  },
  cancelButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.neutral.textSecondary,
  },
  confirmButton: {
    ...SHADOWS.small,
  },
  confirmButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.neutral.white,
  },
});

export default DashboardRecruiter;
