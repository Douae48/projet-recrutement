// src/screens/ProfileScreen.js
// Écran de profil Candidat avec modification nom/email et gestion des compétences

import React, { useContext, useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert,
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
      console.error('Erreur chargement profil:', error);
      try {
        const mySkills = await getMySkills();
        setSkills(mySkills);
      } catch (e) {
        console.error('Erreur skills:', e);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      window.alert('Le nom ne peut pas être vide.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      window.alert('Veuillez saisir un email valide.');
      return;
    }

    setSavingProfile(true);
    try {
      await updateProfile({ name: name.trim(), email: email.trim() });
      setOriginalName(name.trim());
      setOriginalEmail(email.trim());
      setEditMode(false);
      window.alert('Profil mis à jour avec succès !');
    } catch (error) {
      window.alert('Impossible de mettre à jour le profil.');
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
    
    if (!skillLabel) {
      window.alert('Veuillez saisir une compétence.');
      return;
    }
    
    if (skills.includes(skillLabel)) {
      window.alert('Cette compétence est déjà dans votre profil.');
      return;
    }

    setAddingSkill(true);
    try {
      await addSkillToProfile(skillLabel);
      setSkills([...skills, skillLabel]);
      setNewSkill('');
      window.alert(`Compétence "${skillLabel}" ajoutée !`);
    } catch (error) {
      window.alert('Impossible d\'ajouter la compétence.');
    } finally {
      setAddingSkill(false);
    }
  };

  const handleRemoveSkill = async (skillLabel) => {
    // Utiliser confirm pour le web (Alert.alert ne fonctionne pas bien sur web)
    const confirmed = window.confirm(`Retirer "${skillLabel}" de votre profil ?`);
    
    if (confirmed) {
      try {
        await removeSkillFromProfile(skillLabel);
        setSkills(skills.filter(s => s !== skillLabel));
      } catch (error) {
        window.alert('Erreur: Impossible de supprimer la compétence.');
      }
    }
  };

  const handleLogout = () => {
    const confirmed = window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?');
    if (confirmed) {
      logout();
    }
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
});

export default ProfileScreen;
