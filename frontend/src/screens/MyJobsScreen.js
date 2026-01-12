// src/screens/MyJobsScreen.js
// Écran pour voir les offres du recruteur et les candidats recommandés

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { getRecruiterJobs, getRecommendedCandidates, deleteJob, updateJob } from '../api/jobs';
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../utils/theme';

const { width } = Dimensions.get('window');

const MyJobsScreen = ({ navigation }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedJob, setExpandedJob] = useState(null);
  const [candidates, setCandidates] = useState({});
  const [loadingCandidates, setLoadingCandidates] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // États pour la modal d'édition
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSalary, setEditSalary] = useState('');
  const [editSkills, setEditSkills] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = useCallback(async () => {
    try {
      const data = await getRecruiterJobs();
      setJobs(data || []);
    } catch (error) {
      setErrorMessage('Erreur lors du chargement de vos offres');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadJobs();
  };

  // Supprimer une offre
  const handleDeleteJob = (jobId, jobTitle) => {
    setJobToDelete({ jobId, jobTitle });
    setShowDeleteModal(true);
  };

  const confirmDeleteJob = async () => {
    setShowDeleteModal(false);
    try {
      await deleteJob(jobToDelete.jobId);
      setSuccessMessage('Offre supprimée avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
      loadJobs();
    } catch (error) {
      setErrorMessage('Erreur lors de la suppression de l\'offre');
      setTimeout(() => setErrorMessage(''), 3000);
    }
    setJobToDelete(null);
  };

  // Ouvrir la modal d'édition
  const openEditModal = (job) => {
    setEditingJob(job);
    setEditTitle(job.title);
    setEditSalary(job.salaryRange || '');
    setEditSkills(job.skills ? job.skills.join(', ') : '');
    setEditModalVisible(true);
  };

  // Sauvegarder les modifications
  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      setErrorMessage('Le titre est obligatoire');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    try {
      const skillsArray = editSkills.split(',').map(s => s.trim()).filter(s => s);
      await updateJob(editingJob.jobId, {
        title: editTitle,
        salaryRange: editSalary,
        skills: skillsArray.length > 0 ? skillsArray : undefined
      });
      setSuccessMessage('Offre mise à jour avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
      setEditModalVisible(false);
      loadJobs(); // Rafraîchir la liste
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      setErrorMessage('Erreur lors de la mise à jour de l\'offre');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const loadCandidatesForJob = async (jobId) => {
    if (candidates[jobId]) {
      // Déjà chargé, juste toggle
      setExpandedJob(expandedJob === jobId ? null : jobId);
      return;
    }

    setLoadingCandidates(prev => ({ ...prev, [jobId]: true }));
    try {
      const data = await getRecommendedCandidates(jobId);
      setCandidates(prev => ({ ...prev, [jobId]: data || [] }));
      setExpandedJob(jobId);
    } catch (error) {
      setErrorMessage('Erreur lors du chargement des candidats');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoadingCandidates(prev => ({ ...prev, [jobId]: false }));
    }
  };

  const getMatchScoreColor = (score) => {
    if (score >= 70) return COLORS.status.success;
    if (score >= 50) return COLORS.status.warning;
    return COLORS.status.info;
  };

  const renderCandidate = (candidate) => (
    <View key={candidate.candidateId} style={styles.candidateCard}>
      <View style={styles.candidateHeader}>
        <View style={styles.candidateAvatar}>
          <Ionicons name="person" size={20} color={COLORS.neutral.white} />
        </View>
        <View style={styles.candidateInfo}>
          <Text style={styles.candidateName}>{candidate.name}</Text>
          <Text style={styles.candidateEmail}>{candidate.email}</Text>
        </View>
        <View style={[styles.matchBadge, { backgroundColor: getMatchScoreColor(candidate.matchScore) }]}>
          <Text style={styles.matchScore}>{Math.round(candidate.matchScore)}%</Text>
        </View>
      </View>
      
      {candidate.skills && candidate.skills.length > 0 && (
        <View style={styles.skillsContainer}>
          <Text style={styles.skillsLabel}>Compétences:</Text>
          <View style={styles.skillsRow}>
            {candidate.skills.map((skill, index) => (
              <View key={index} style={styles.skillBadge}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  const renderJob = ({ item }) => {
    const isExpanded = expandedJob === item.jobId;
    const jobCandidates = candidates[item.jobId] || [];
    const isLoading = loadingCandidates[item.jobId];

    return (
      <View style={styles.jobCard}>
        {/* Boutons d'action en haut à droite */}
        <View style={styles.jobActions}>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => openEditModal(item)}
          >
            <Ionicons name="pencil" size={18} color={COLORS.status.info} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => handleDeleteJob(item.jobId, item.title)}
          >
            <Ionicons name="trash" size={18} color={COLORS.status.error} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.jobHeader}
          onPress={() => loadCandidatesForJob(item.jobId)}
          activeOpacity={0.7}
        >
          <View style={styles.jobInfo}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            {item.salaryRange && (
              <Text style={styles.jobSalary}>💰 {item.salaryRange}</Text>
            )}
            {item.skills && item.skills.length > 0 && (
              <View style={styles.jobSkillsRow}>
                {item.skills.slice(0, 3).map((skill, index) => (
                  <View key={index} style={styles.jobSkillBadge}>
                    <Text style={styles.jobSkillText}>{skill}</Text>
                  </View>
                ))}
                {item.skills.length > 3 && (
                  <Text style={styles.moreSkills}>+{item.skills.length - 3}</Text>
                )}
              </View>
            )}
          </View>
          
          <View style={styles.expandButton}>
            {isLoading ? (
              <ActivityIndicator size="small" color={COLORS.recruiter.primary} />
            ) : (
              <Ionicons 
                name={isExpanded ? "chevron-up" : "chevron-down"} 
                size={24} 
                color={COLORS.recruiter.primary} 
              />
            )}
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.candidatesSection}>
            <View style={styles.candidatesSectionHeader}>
              <Ionicons name="people" size={18} color={COLORS.recruiter.primary} />
              <Text style={styles.candidatesSectionTitle}>
                Candidats recommandés ({jobCandidates.length})
              </Text>
            </View>
            
            {jobCandidates.length === 0 ? (
              <View style={styles.noCandidates}>
                <Ionicons name="person-outline" size={32} color={COLORS.neutral.textSecondary} />
                <Text style={styles.noCandidatesText}>
                  Aucun candidat correspondant pour le moment
                </Text>
              </View>
            ) : (
              jobCandidates.map(renderCandidate)
            )}
          </View>
        )}
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="briefcase-outline" size={64} color={COLORS.neutral.textSecondary} />
      <Text style={styles.emptyTitle}>Aucune offre publiée</Text>
      <Text style={styles.emptyText}>
        Publiez votre première offre pour voir les candidats recommandés
      </Text>
      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => navigation.navigate('Publier')}
      >
        <Ionicons name="add-circle" size={20} color={COLORS.neutral.white} />
        <Text style={styles.createButtonText}>Publier une offre</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="Mes Offres" 
        subtitle={`${jobs.length} offre${jobs.length > 1 ? 's' : ''} publiée${jobs.length > 1 ? 's' : ''}`}
        backgroundColor={COLORS.recruiter.primary}
      />

      {/* Messages de succès/erreur */}
      {successMessage && (
        <View style={styles.successBanner}>
          <View style={styles.messageContent}>
            <Ionicons name="checkmark-circle" size={24} color={COLORS.status.success} />
            <View style={styles.messageTextContainer}>
              <Text style={styles.successTitle}>Succès !</Text>
              <Text style={styles.messageSubtitle}>{successMessage}</Text>
            </View>
          </View>
        </View>
      )}
      
      {errorMessage && (
        <View style={styles.errorBanner}>
          <View style={styles.messageContent}>
            <Ionicons name="alert-circle" size={24} color={COLORS.status.error} />
            <View style={styles.messageTextContainer}>
              <Text style={styles.errorTitle}>Erreur</Text>
              <Text style={styles.messageSubtitle}>{errorMessage}</Text>
            </View>
          </View>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.recruiter.primary} />
          <Text style={styles.loadingText}>Chargement de vos offres...</Text>
        </View>
      ) : (
        <FlatList
          data={jobs}
          renderItem={renderJob}
          keyExtractor={(item) => item.jobId}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.recruiter.primary]}
              tintColor={COLORS.recruiter.primary}
            />
          }
        />
      )}

      {/* Modal d'édition */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Modifier l'offre</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.neutral.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Titre de l'offre *</Text>
            <TextInput
              style={styles.input}
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="Ex: Développeur Full Stack"
            />

            <Text style={styles.inputLabel}>Salaire</Text>
            <TextInput
              style={styles.input}
              value={editSalary}
              onChangeText={setEditSalary}
              placeholder="Ex: 8000-12000 MAD"
            />

            <Text style={styles.inputLabel}>Compétences (séparées par des virgules)</Text>
            <TextInput
              style={styles.input}
              value={editSkills}
              onChangeText={setEditSkills}
              placeholder="Ex: React, Node.js, MongoDB"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.saveBtnText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modale Confirmation Suppression */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <View style={[styles.modalIconContainer, { backgroundColor: COLORS.status.error + '20' }]}>
              <Ionicons name="trash-outline" size={32} color={COLORS.status.error} />
            </View>
            <Text style={styles.modalTitle}>Supprimer l'offre</Text>
            <Text style={styles.modalMessage}>
              Êtes-vous sûr de vouloir supprimer l'offre "{jobToDelete?.jobTitle}" ?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: COLORS.status.error }]}
                onPress={confirmDeleteJob}
              >
                <Text style={styles.confirmButtonText}>Supprimer</Text>
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
    maxWidth: width > 768 ? 600 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: width > 768 ? 600 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.textSecondary,
    marginTop: SPACING.md,
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  jobCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
    overflow: 'hidden',
  },
  jobHeader: {
    flexDirection: 'row',
    padding: SPACING.lg,
    alignItems: 'center',
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.neutral.text,
    marginBottom: SPACING.xs,
  },
  jobSalary: {
    ...TYPOGRAPHY.caption,
    color: COLORS.status.success,
    marginBottom: SPACING.sm,
  },
  jobSkillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  jobSkillBadge: {
    backgroundColor: COLORS.recruiter.background,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  jobSkillText: {
    ...TYPOGRAPHY.small,
    color: COLORS.recruiter.primary,
  },
  moreSkills: {
    ...TYPOGRAPHY.small,
    color: COLORS.neutral.textSecondary,
    alignSelf: 'center',
  },
  expandButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  candidatesSection: {
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral.border,
    padding: SPACING.lg,
    backgroundColor: COLORS.neutral.background,
  },
  candidatesSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  candidatesSectionTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.recruiter.primary,
    marginLeft: SPACING.sm,
  },
  noCandidates: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  noCandidatesText: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.textSecondary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  candidateCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.neutral.border,
  },
  candidateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  candidateAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.candidate.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  candidateInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  candidateName: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.neutral.text,
  },
  candidateEmail: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.textSecondary,
  },
  matchBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  matchScore: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.white,
    fontWeight: 'bold',
  },
  skillsContainer: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral.border,
  },
  skillsLabel: {
    ...TYPOGRAPHY.small,
    color: COLORS.neutral.textSecondary,
    marginBottom: SPACING.xs,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  skillBadge: {
    backgroundColor: COLORS.status.success + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  skillText: {
    ...TYPOGRAPHY.small,
    color: COLORS.status.success,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl * 2,
  },
  emptyTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.neutral.text,
    marginTop: SPACING.lg,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.recruiter.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  createButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.neutral.white,
  },
  // Styles pour les boutons d'action
  jobActions: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    flexDirection: 'row',
    gap: SPACING.xs,
    zIndex: 10,
  },
  actionBtn: {
    padding: SPACING.xs,
    backgroundColor: COLORS.neutral.background,
    borderRadius: BORDER_RADIUS.sm,
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
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.neutral.text,
  },
  inputLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.textSecondary,
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.neutral.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: 16,
    backgroundColor: COLORS.neutral.background,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  successBanner: {
    backgroundColor: COLORS.status.success + '15',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.status.success,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    ...SHADOWS.small,
  },
  errorBanner: {
    backgroundColor: COLORS.status.error + '15',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.status.error,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    ...SHADOWS.small,
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageTextContainer: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  successTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.status.success,
    marginBottom: 2,
  },
  errorTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.status.error,
    marginBottom: 2,
  },
  messageSubtitle: {
    ...TYPOGRAPHY.small,
    color: COLORS.neutral.text,
  },
  modalBtn: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  cancelBtn: {
    backgroundColor: COLORS.neutral.background,
  },
  cancelBtnText: {
    ...TYPOGRAPHY.button,
    color: COLORS.neutral.textSecondary,
  },
  saveBtn: {
    backgroundColor: COLORS.recruiter.primary,
  },
  saveBtnText: {
    ...TYPOGRAPHY.button,
    color: COLORS.neutral.white,
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

export default MyJobsScreen;
