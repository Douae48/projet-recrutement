// src/screens/ProfileScreen.js
// Écran de profil Candidat avec modification nom/email et gestion des compétences

import React, { useContext, useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Modal,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import SkillBadge from '../components/SkillBadge';
import { 
  addSkillToProfile, 
  getMySkills, 
  removeSkillFromProfile,
  getProfile,
  updateProfile 
} from '../api/profile';
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY, BORDER_RADIUS, getThemeColors } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const { logout, userData, primaryRole } = useContext(AuthContext);
  const themeColors = getThemeColors(primaryRole);
  
  // États pour le profil
  const [name, setName] = useState(userData?.name || '');
  const [email, setEmail] = useState(userData?.email || '');
  const [originalName, setOriginalName] = useState(userData?.name || '');
  const [originalEmail, setOriginalEmail] = useState(userData?.email || '');
  
  // États pour les compétences
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  
  // États de chargement
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [addingSkill, setAddingSkill] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showRemoveSkillModal, setShowRemoveSkillModal] = useState(false);
  const [skillToRemove, setSkillToRemove] = useState(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = useCallback(async () => {
    try {
      const profileData = await getProfile();
      if (profileData) {
        setName(profileData.name || '');
        setEmail(profileData.email || '');
        setOriginalName(profileData.name || '');
        setOriginalEmail(profileData.email || '');
        setSkills(profileData.skills || []);
      } else {
        const mySkills = await getMySkills();
        setSkills(mySkills);
      }
    } catch (error) {
      try {
        const mySkills = await getMySkills();
        setSkills(mySkills);
      } catch (e) {
        // Erreur silencieuse
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSaveProfile = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!name.trim()) {
      setErrorMessage('Le nom ne peut pas être vide.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Veuillez saisir un email valide.');
      return;
    }

    setSavingProfile(true);
    try {
      await updateProfile({ name: name.trim(), email: email.trim() });
      setOriginalName(name.trim());
      setOriginalEmail(email.trim());
      setEditMode(false);
      setSuccessMessage('Profil mis à jour avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Impossible de mettre à jour le profil.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    setName(originalName);
    setEmail(originalEmail);
    setEditMode(false);
  };

  const hasProfileChanges = name !== originalName || email !== originalEmail;

  const handleAddSkill = async () => {
    const skillLabel = newSkill.trim();
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!skillLabel) {
      setErrorMessage('Veuillez saisir une compétence.');
      return;
    }
    
    if (skills.includes(skillLabel)) {
      setErrorMessage('Cette compétence est déjà dans votre profil.');
      return;
    }

    setAddingSkill(true);
    try {
      await addSkillToProfile(skillLabel);
      setSkills([...skills, skillLabel]);
      setNewSkill('');
      setSuccessMessage(`Compétence "${skillLabel}" ajoutée !`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Impossible d\'ajouter la compétence.');
    } finally {
      setAddingSkill(false);
    }
  };

  const handleRemoveSkill = (skillLabel) => {
    setSkillToRemove(skillLabel);
    setShowRemoveSkillModal(true);
  };

  const confirmRemoveSkill = async () => {
    setShowRemoveSkillModal(false);
    try {
      await removeSkillFromProfile(skillToRemove);
      setSkills(skills.filter(s => s !== skillToRemove));
      setSuccessMessage(`Compétence "${skillToRemove}" retirée !`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Impossible de supprimer la compétence.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
    setSkillToRemove(null);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  const suggestedSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Figma', 'Agile', 'Communication'];
  const filteredSuggestions = suggestedSkills.filter(s => !skills.includes(s));

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={themeColors.primary} />
        <Text style={styles.loadingText}>Chargement du profil...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header 
        title="Mon Profil" 
        subtitle="Gérez vos informations"
        backgroundColor={themeColors.primary}
        rightIcon="log-out-outline"
        onRightPress={handleLogout}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Messages de succès/erreur */}
        {successMessage && (
          <View style={styles.successBanner}>
            <View style={styles.successContent}>
              <Ionicons name="checkmark-circle" size={24} color={COLORS.status.success} />
              <View style={styles.successTextContainer}>
                <Text style={styles.successTitle}>Succès !</Text>
                <Text style={styles.successSubtitle}>{successMessage}</Text>
              </View>
            </View>
          </View>
        )}
        
        {errorMessage && (
          <View style={styles.errorBanner}>
            <View style={styles.errorContent}>
              <Ionicons name="alert-circle" size={24} color={COLORS.status.error} />
              <View style={styles.errorTextContainer}>
                <Text style={styles.errorTitle}>Erreur</Text>
                <Text style={styles.errorSubtitle}>{errorMessage}</Text>
              </View>
            </View>
          </View>
        )}
        
        {/* Section Avatar */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatar, { backgroundColor: themeColors.primary }]}>
            <Ionicons name="person" size={40} color={COLORS.neutral.white} />
          </View>
          <View style={[styles.roleBadge, { backgroundColor: themeColors.primaryLight + '20' }]}>
            <Text style={[styles.roleText, { color: themeColors.primary }]}>
              🎯 Candidat
            </Text>
          </View>
        </View>

        {/* Section Informations Personnelles */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Informations personnelles</Text>
            {!editMode ? (
              <TouchableOpacity 
                style={[styles.editButton, { backgroundColor: themeColors.primaryLight + '20' }]}
                onPress={() => setEditMode(true)}
              >
                <Ionicons name="pencil" size={16} color={themeColors.primary} />
                <Text style={[styles.editButtonText, { color: themeColors.primary }]}>Modifier</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleCancelEdit}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Champ Nom */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Nom complet</Text>
            <View style={[
              styles.inputWrapper, 
              editMode && styles.inputWrapperActive,
              editMode && { borderColor: themeColors.primary }
            ]}>
              <Ionicons 
                name="person-outline" 
                size={20} 
                color={editMode ? themeColors.primary : COLORS.neutral.textSecondary} 
              />
              <TextInput
                style={[styles.input, !editMode && styles.inputDisabled]}
                value={name}
                onChangeText={setName}
                editable={editMode}
                placeholder="Votre nom"
                placeholderTextColor={COLORS.neutral.placeholder}
              />
            </View>
          </View>

          {/* Champ Email */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Adresse email</Text>
            <View style={[
              styles.inputWrapper, 
              editMode && styles.inputWrapperActive,
              editMode && { borderColor: themeColors.primary }
            ]}>
              <Ionicons 
                name="mail-outline" 
                size={20} 
                color={editMode ? themeColors.primary : COLORS.neutral.textSecondary} 
              />
              <TextInput
                style={[styles.input, !editMode && styles.inputDisabled]}
                value={email}
                onChangeText={setEmail}
                editable={editMode}
                placeholder="votre@email.com"
                placeholderTextColor={COLORS.neutral.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Bouton Sauvegarder */}
          {editMode && hasProfileChanges && (
            <TouchableOpacity 
              style={[styles.saveButton, { backgroundColor: themeColors.primary }]}
              onPress={handleSaveProfile}
              disabled={savingProfile}
            >
              {savingProfile ? (
                <ActivityIndicator size="small" color={COLORS.neutral.white} />
              ) : (
                <>
                  <Ionicons name="checkmark" size={20} color={COLORS.neutral.white} />
                  <Text style={styles.saveButtonText}>Sauvegarder</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Section Mes Compétences */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mes Compétences</Text>
            <Text style={styles.skillCount}>{skills.length} skills</Text>
          </View>
          
          <View style={styles.skillsGrid}>
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <SkillBadge 
                  key={index}
                  label={skill}
                  variant="primary"
                  removable
                  onRemove={() => handleRemoveSkill(skill)}
                />
              ))
            ) : (
              <Text style={styles.noSkillsText}>
                Aucune compétence ajoutée. Commencez ci-dessous !
              </Text>
            )}
          </View>
        </View>

        {/* Section Ajouter une compétence */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ajouter une compétence</Text>
          
          <View style={styles.addSkillRow}>
            <View style={styles.addInputWrapper}>
              <Ionicons name="add-circle-outline" size={20} color={COLORS.neutral.textSecondary} />
              <TextInput
                style={styles.skillInput}
                placeholder="Ex: React Native, Python..."
                placeholderTextColor={COLORS.neutral.placeholder}
                value={newSkill}
                onChangeText={setNewSkill}
                onSubmitEditing={handleAddSkill}
                returnKeyType="done"
              />
            </View>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: themeColors.primary }]}
              onPress={handleAddSkill}
              disabled={addingSkill}
            >
              {addingSkill ? (
                <ActivityIndicator size="small" color={COLORS.neutral.white} />
              ) : (
                <Ionicons name="add" size={24} color={COLORS.neutral.white} />
              )}
            </TouchableOpacity>
          </View>
          
          {filteredSuggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsLabel}>Suggestions :</Text>
              <View style={styles.suggestionsGrid}>
                {filteredSuggestions.slice(0, 4).map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionChip}
                    onPress={() => setNewSkill(suggestion)}
                  >
                    <Text style={styles.suggestionText}>+ {suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Conseils */}
        <View style={[styles.tipCard, { backgroundColor: themeColors.primaryLight + '15' }]}>
          <Ionicons name="bulb-outline" size={24} color={themeColors.primary} />
          <View style={styles.tipContent}>
            <Text style={[styles.tipTitle, { color: themeColors.primary }]}>
              Conseil JobMatch
            </Text>
            <Text style={styles.tipText}>
              Plus vous ajoutez de compétences pertinentes, meilleur sera votre score de matching avec les offres d'emploi !
            </Text>
          </View>
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

      {/* Modale Retirer Compétence */}
      <Modal
        visible={showRemoveSkillModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRemoveSkillModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <View style={[styles.modalIconContainer, { backgroundColor: COLORS.status.error + '20' }]}>
              <Ionicons name="trash-outline" size={32} color={COLORS.status.error} />
            </View>
            <Text style={styles.modalTitle}>Retirer la compétence</Text>
            <Text style={styles.modalMessage}>
              Voulez-vous retirer "{skillToRemove}" de votre profil ?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowRemoveSkillModal(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: COLORS.status.error }]}
                onPress={confirmRemoveSkill}
              >
                <Text style={styles.confirmButtonText}>Retirer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
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
    maxWidth: width > 768 ? 600 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.textSecondary,
    marginTop: SPACING.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  roleBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.sm,
  },
  roleText: {
    ...TYPOGRAPHY.small,
    fontWeight: '600',
  },
  section: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.neutral.text,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  editButtonText: {
    ...TYPOGRAPHY.small,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  cancelButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  cancelButtonText: {
    ...TYPOGRAPHY.small,
    color: COLORS.status.error,
    fontWeight: '600',
  },
  fieldContainer: {
    marginBottom: SPACING.md,
  },
  fieldLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.textSecondary,
    marginBottom: SPACING.xs,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.neutral.background,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputWrapperActive: {
    backgroundColor: COLORS.neutral.white,
    borderWidth: 2,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.text,
    marginLeft: SPACING.sm,
  },
  inputDisabled: {
    color: COLORS.neutral.textSecondary,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.sm,
    ...SHADOWS.small,
  },
  saveButtonText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.neutral.white,
    marginLeft: SPACING.xs,
  },
  skillCount: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.textSecondary,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  noSkillsText: {
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.textSecondary,
    fontStyle: 'italic',
  },
  addSkillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  addInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.neutral.background,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
  },
  skillInput: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.neutral.text,
    marginLeft: SPACING.sm,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  suggestionsContainer: {
    marginTop: SPACING.md,
  },
  suggestionsLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.textSecondary,
    marginBottom: SPACING.sm,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  suggestionChip: {
    backgroundColor: COLORS.neutral.background,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.neutral.border,
    borderStyle: 'dashed',
  },
  suggestionText: {
    ...TYPOGRAPHY.small,
    color: COLORS.neutral.textSecondary,
  },
  successBanner: {
    backgroundColor: COLORS.status.success + '15',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.status.success,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  successContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  successTextContainer: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  successTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.status.success,
    marginBottom: 2,
  },
  successSubtitle: {
    ...TYPOGRAPHY.small,
    color: COLORS.neutral.text,
  },
  errorBanner: {
    backgroundColor: COLORS.status.error + '15',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.status.error,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorTextContainer: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  errorTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.status.error,
    marginBottom: 2,
  },
  errorSubtitle: {
    ...TYPOGRAPHY.small,
    color: COLORS.neutral.text,
  },
  tipCard: {
    flexDirection: 'row',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  tipContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  tipTitle: {
    ...TYPOGRAPHY.bodyBold,
    marginBottom: SPACING.xs,
  },
  tipText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.neutral.textSecondary,
    lineHeight: 18,
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

export default ProfileScreen;
